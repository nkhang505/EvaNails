"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus, ChevronDown, ChevronUp, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  display_order: number
}

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
  ),
)

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Nail Art",
    display_order: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("gallery_images").select("*").order("category", { ascending: true })
      if (error) throw error
      setImages(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch gallery images")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "Nail Art",
      display_order: "",
    })
    setFile(null)
    setPreviewUrl("")
    setError(null)
  }

  const handleFieldChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Upload image file to Supabase Storage
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from("gallery").upload(fileName, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from("gallery").getPublicUrl(fileName)
    return publicUrlData.publicUrl
  }

  const handleAdd = async () => {
    if (!file) {
      setError("Please select an image file")
      return
    }
    try {
      const imageUrl = await uploadImageToSupabase(file)
      const { data: existing, error: fetchError } = await supabase
        .from("gallery_images")
        .select("display_order")
        .eq("category", formData.category)
      if (fetchError) throw fetchError
      const maxOrder = existing?.length ? Math.max(...existing.map((img) => img.display_order || 0)) : 0
      const nextOrder = maxOrder + 1
      const { data, error } = await supabase
        .from("gallery_images")
        .insert([
          {
            ...formData,
            image_url: imageUrl,
            display_order: nextOrder,
          },
        ])
        .select()
      if (error) throw error
      setImages((prev) => [...prev, data[0]])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add gallery image")
    }
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    try {
      // Get image data (to know file path)
      const { data: imageData, error: fetchError } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("id", confirmDeleteId)
        .single()
      if (fetchError) throw fetchError

      // Extract file name from the public URL
      if (imageData?.image_url) {
        const urlParts = imageData.image_url.split("/")
        const fileName = decodeURIComponent(urlParts[urlParts.length - 1]) // <--- decode it

        const { error: storageError } = await supabase.storage.from("gallery").remove([fileName])
        if (storageError) console.warn("Storage delete error:", storageError.message)
      }

      // Delete the database record
      const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", confirmDeleteId)
      if (dbError) throw dbError

      // Update UI
      setImages((prev) => prev.filter((img) => img.id !== confirmDeleteId))
      setConfirmDeleteId(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete gallery image")
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id)
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      category: image.category,
      display_order: image.display_order.toString(),
    })
    setPreviewUrl(image.image_url)
    setFile(null)

    if (formRef.current) {
      const yOffset = -80
      const y = formRef.current.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    const displayOrder = formData.display_order ? Number.parseInt(formData.display_order) : 0
    // remove title required check
    try {
      let imageUrl = formData.image_url
      if (file) {
        imageUrl = await uploadImageToSupabase(file)
      }
      const { error } = await supabase
        .from("gallery_images")
        .update({ ...formData, image_url: imageUrl, display_order: displayOrder })
        .eq("id", editingId)
      if (error) throw error
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingId ? { id: editingId, ...formData, image_url: imageUrl, display_order: displayOrder } : img,
        ),
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update gallery image")
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  if (isLoading) return <div className="text-center text-muted-foreground">Loading gallery images...</div>

  const categories = Array.from(new Set(images.map((img) => img.category)))
  const groupedImages = categories.map((category) => ({
    category,
    images: images.filter((img) => img.category === category).sort((a, b) => a.display_order - b.display_order),
  }))

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card ref={formRef} className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} /> {editingId ? "Edit Image" : "Add New Image"}
        </h3>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <InputField
            label="Image Title"
            value={formData.title}
            onChange={(val) => handleFieldChange("title", val)}
            placeholder="e.g., Gold Glitter Nails"
          />
          <InputField
            label="Description"
            value={formData.description}
            onChange={(val) => handleFieldChange("description", val)}
            placeholder="Brief description of the image"
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Upload size={16} /> Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-md object-cover mt-2 border" />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option>Nail Art</option>
              <option>Dipping</option>
              <option>Extensions</option>
              <option>Sample</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
                  Update Image
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                Add Image
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Images List */}
      <div className="space-y-4">
        {groupedImages.map(({ category, images }) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between w-full px-4 py-2 bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20 transition-colors"
            >
              {category} ({images.length})
              {openCategories.includes(category) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openCategories.includes(category) && (
              <div className="mt-2 grid gap-3">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className="bg-card border-border p-4 flex justify-between items-start hover:border-primary hover:shadow-md transition-all rounded-lg"
                  >
                    <div className="flex-1 flex gap-4">
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{image.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 truncate" title={image.description}>
                          {image.description || "No description"}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            Order: {image.display_order}
                          </span>
                          <span className="bg-background text-muted-foreground px-2 py-1 rounded-full text-xs">
                            {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(image)}
                        variant="outline"
                        size="sm"
                        className="text-primary hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(image.id)}
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
      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="h3">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this image? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
