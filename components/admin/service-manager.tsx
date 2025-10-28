"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Service {
  id: number
  name: string
  description: string
  price: number
}

const initialServices: Service[] = [
  { id: 1, name: "Manicure", description: "Classic and gel manicures", price: 50 },
  { id: 2, name: "Pedicure", description: "Relaxing pedicures", price: 60 },
  { id: 3, name: "Nail Art", description: "Custom designs", price: 75 },
  { id: 4, name: "Extensions", description: "Acrylic and gel extensions", price: 90 },
]

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", price: 0 })

  const handleAdd = () => {
    if (formData.name && formData.price > 0) {
      setServices([...services, { id: Date.now(), ...formData }])
      setFormData({ name: "", description: "", price: 0 })
    }
  }

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({ name: service.name, description: service.description, price: service.price })
  }

  const handleUpdate = () => {
    if (editingId && formData.name && formData.price > 0) {
      setServices(services.map((s) => (s.id === editingId ? { id: editingId, ...formData } : s)))
      setEditingId(null)
      setFormData({ name: "", description: "", price: 0 })
    }
  }

  const InputField = ({ label, ...props }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} />
          {editingId ? "Edit Service" : "Add New Service"}
        </h3>
        <div className="space-y-4">
          <InputField
            label="Service Name"
            type="text"
            placeholder="e.g., Gel Manicure"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputField
            label="Description"
            type="text"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
          />
          <InputField
            label="Price ($)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e: any) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
          />
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
                  Update Service
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: "", description: "", price: 0 })
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                Add Service
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">Current Services ({services.length})</h3>
        {services.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">No services yet. Add one to get started!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="bg-card border-border p-4 hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{service.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <p className="text-primary font-bold mt-2">${service.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
