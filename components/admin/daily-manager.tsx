"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Calendar, Plus, Save, Trash2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase/client"

interface Report {
  id?: string
  name: string
  income?: number | null
  tip?: number | null
  date: string
}

export default function DailyManager() {
  const [date, setDate] = useState<Date>(new Date())
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchDailyData()
  }, [date])

  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const fetchDailyData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const day = formatLocalDate(date)

      const { data, error } = await supabase.from("report").select("*").eq("date", day)
      if (error) throw error

      if (!data || data.length === 0) {
        // Carry over names from previous day
        const prev = new Date(date)
        prev.setDate(date.getDate() - 1)
        const prevDay = formatLocalDate(prev)
        const { data: prevData } = await supabase.from("report").select("name").eq("date", prevDay)

        if (prevData && prevData.length > 0) {
          const carryOver = prevData.map((p) => ({
            id: crypto.randomUUID(),
            name: p.name,
            income: null,
            tip: null,
            date: day,
          }))
          setReports(carryOver)
        } else {
          setReports([])
        }
      } else {
        setReports(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRow = () => {
    setReports((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", income: null, tip: null, date: formatLocalDate(date) },
    ])
    setIsEditing(true)
  }

  const handleDeleteRow = (id?: string) => {
    if (!id) return
    setConfirmDeleteId(id)
  }

  const confirmDelete = () => {
    if (!confirmDeleteId) return
    setReports((prev) => prev.filter((r) => r.id !== confirmDeleteId))
    setConfirmDeleteId(null)
    setIsEditing(true)
  }

  const cancelDelete = () => setConfirmDeleteId(null)

  const handleChange = (id: string | undefined, field: keyof Report, value: string | number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, [field]: field === "name" ? value : value === "" ? null : Number(value) }
          : r
      )
    )
    setIsEditing(true)
  }

  const prevDay = () => {
    const d = new Date(date)
    d.setDate(d.getDate() - 1)
    setDate(d)
  }

  const nextDay = () => {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    setDate(d)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const day = formatLocalDate(date)
      await supabase.from("report").delete().eq("date", day)

      const cleanData = reports.map(({ id, ...r }) => ({
        ...r,
        id: id || crypto.randomUUID(),
        date: day,
        income: r.income ?? 0,
        tip: r.tip ?? 0,
      }))

      const { error } = await supabase.from("report").insert(cleanData)
      if (error) throw error
      setIsEditing(false)
      fetchDailyData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save daily data")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDisplayDate = (d: Date, isMobile = false) =>
    d.toLocaleDateString("en-US", isMobile
      ? { weekday: "short", month: "short", day: "numeric" } // e.g., Mon, Nov 4
      : { weekday: "long", month: "short", day: "numeric", year: "numeric" } // full
    )

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 bg-card border-border shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2 justify-center sm:justify-start">
            <Calendar size={20} /> Daily Report
          </h3>
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <Button variant="outline" onClick={prevDay} className="flex items-center gap-1 text-sm sm:text-base">
              <ChevronLeft size={16} /> Prev
            </Button>
            <div className="text-sm sm:text-base font-medium text-foreground whitespace-nowrap">
              <span className="block sm:hidden">{formatDisplayDate(date, true)}</span>
              <span className="hidden sm:block">{formatDisplayDate(date)}</span>
            </div>
            <Button variant="outline" onClick={nextDay} className="flex items-center gap-1 text-sm sm:text-base">
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {error && <p className="text-destructive mb-3 text-sm">{error}</p>}

        {isLoading ? (
          <p className="text-foreground text-center py-6 text-sm sm:text-base">
            Loading daily data...
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border rounded-lg overflow-hidden text-sm sm:text-base">
                <thead className="bg-primary/10 sticky top-0">
                  <tr>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold">Name</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold">Income</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold">Tip</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-primary/5 transition-colors">
                      <td className="py-1.5 sm:py-2">
                        <Input
                          value={r.name}
                          placeholder="Enter name"
                          onChange={(e) => handleChange(r.id, "name", e.target.value)}
                          className="w-full text-sm sm:text-base"
                        />
                      </td>
                      <td className="py-1.5 sm:py-2">
                        <Input
                          type="number"
                          value={r.income ?? ""}
                          placeholder=""
                          onChange={(e) => handleChange(r.id, "income", e.target.value)}
                          className="w-full text-sm sm:text-base"
                        />
                      </td>
                      <td className="py-1.5 sm:py-2">
                        <Input
                          type="number"
                          value={r.tip ?? ""}
                          placeholder=""
                          onChange={(e) => handleChange(r.id, "tip", e.target.value)}
                          className="w-full text-sm sm:text-base"
                        />
                      </td>
                      <td className="py-1.5 sm:py-2 flex justify-center sm:justify-start gap-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteRow(r.id)}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
              <Button
                onClick={handleAddRow}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <Plus size={16} /> Add Row
              </Button>

              <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {isEditing && (
                  <Button
                    onClick={fetchDailyData}
                    variant="outline"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <X size={16} /> Cancel
                  </Button>
                )}
                <Button onClick={handleSave} className="flex items-center gap-2 text-sm sm:text-base">
                  <Save size={16} /> Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Dialog open={!!confirmDeleteId} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-foreground text-sm">
            Are you sure you want to delete this row? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
