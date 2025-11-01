"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  full_set_price?: number
  fill_ins_price?: number
}

// Memoized InputField
const InputField = React.memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
  }: {
    label: string
    value: string
    onChange: (val: string) => void
    type?: string
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  )
)

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    full_set_price: "",
    fill_ins_price: "",
    category: "Manicure",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("category", { ascending: true })

      if (error) throw error
      setServices(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      full_set_price: "",
      fill_ins_price: "",
      category: "Manicure",
    })
    setError(null)
  }

  const handleFieldChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleAdd = async () => {
    const priceNumber = parseFloat(formData.price)
    const fullSetNumber = formData.full_set_price ? parseFloat(formData.full_set_price) : null
    const fillInsNumber = formData.fill_ins_price ? parseFloat(formData.fill_ins_price) : null

    if (!formData.name || isNaN(priceNumber) || priceNumber <= 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const { data, error } = await supabase
        .from("services")
        .insert([
          {
            ...formData,
            price: priceNumber,
            full_set_price: fullSetNumber,
            fill_ins_price: fillInsNumber,
          },
        ])
        .select()

      if (error) throw error
      setServices((prev) => [...prev, data[0]])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id)
      if (error) throw error
      setServices((prev) => prev.filter((s) => s.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service")
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      full_set_price: service.full_set_price ? service.full_set_price.toString() : "",
      fill_ins_price: service.fill_ins_price ? service.fill_ins_price.toString() : "",
      category: service.category,
    })

    if (formRef.current) {
      const yOffset = -80 // adjust this value to move up more or less
      const y = formRef.current.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    const priceNumber = parseFloat(formData.price)
    const fullSetNumber = formData.full_set_price ? parseFloat(formData.full_set_price) : null
    const fillInsNumber = formData.fill_ins_price ? parseFloat(formData.fill_ins_price) : null

    if (!formData.name || isNaN(priceNumber) || priceNumber <= 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const { error } = await supabase
        .from("services")
        .update({
          ...formData,
          price: priceNumber,
          full_set_price: fullSetNumber,
          fill_ins_price: fillInsNumber,
        })
        .eq("id", editingId)

      if (error) throw error
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { id: editingId, ...formData, price: priceNumber, full_set_price: fullSetNumber, fill_ins_price: fillInsNumber }
            : s
        )
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service")
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  if (isLoading) return <div className="text-center text-muted-foreground">Loading services...</div>

  // Group services by category
  const categories = Array.from(new Set(services.map((s) => s.category)))
  const groupedServices = categories.map((category) => ({
    category,
    services: services.filter((s) => s.category === category),
  }))

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card
        ref={formRef} // Attach ref here
        className="bg-card border-border p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} /> {editingId ? "Edit Service" : "Add New Service"}
        </h3>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <InputField label="Service Name" value={formData.name} onChange={(val) => handleFieldChange("name", val)} placeholder="e.g., Gel Manicure" />
          <InputField label="Description" value={formData.description} onChange={(val) => handleFieldChange("description", val)} placeholder="Brief description of the service" />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select value={formData.category} onChange={(e) => handleFieldChange("category", e.target.value)} className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              <option>Manicure</option>
              <option>Pedicure</option>
              <option>Nail Enhancement</option>
              <option>Dipping Powder</option>
              <option>Waxing</option>
              <option>Additional Services</option>
            </select>
          </div>
          <InputField
            label="Price ($)"
            type="number"
            value={formData.price}
            onChange={(val) => handleFieldChange("price", val)}
            placeholder="0.00"
          />

          <InputField
            label="Full Set Price ($)"
            type="number"
            value={formData.full_set_price}
            onChange={(val) => handleFieldChange("full_set_price", val)}
            placeholder="Optional"
          />

          <InputField
            label="Fill-Ins Price ($)"
            type="number"
            value={formData.fill_ins_price}
            onChange={(val) => handleFieldChange("fill_ins_price", val)}
            placeholder="Optional"
          />


          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">Update Service</Button>
                <Button onClick={resetForm} variant="outline">Cancel</Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">Add Service</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        {groupedServices.map(({ category, services }) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between w-full px-4 py-2 bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20 transition-colors"
            >
              {category} ({services.length})
              {openCategories.includes(category) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openCategories.includes(category) && (
              <div className="mt-2 grid gap-3">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="bg-card border-border p-4 flex justify-between items-start hover:border-primary hover:shadow-md transition-all rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      <p
                        className="text-sm text-muted-foreground mt-1 truncate"
                        title={service.description}
                      >
                        {service.description || "No description"}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap items-center">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold text-sm">
                          ${service.price.toFixed(2)}
                        </span>
                        {service.full_set_price && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Full: ${service.full_set_price.toFixed(2)}
                          </span>
                        )}
                        {service.fill_ins_price && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Fill: ${service.fill_ins_price.toFixed(2)}
                          </span>
                        )}
                        <span className="bg-background text-muted-foreground px-2 py-1 rounded-full text-xs">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(service)} // scroll happens here
                        variant="outline"
                        size="sm"
                        className="text-primary hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(service.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
