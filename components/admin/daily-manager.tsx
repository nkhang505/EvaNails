"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Calendar, Plus, Save, Trash2, Edit3, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Report {
  id?: string
  name: string
  income: number
  tip: number
  date: string
}

export default function DailyManager() {
  const [date, setDate] = useState<Date>(new Date())
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setReports(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRow = () => {
    setReports((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", income: 0, tip: 0, date: formatLocalDate(date) },
    ])
    setIsEditing(true)
  }

  const handleDeleteRow = (id?: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
    setIsEditing(true)
  }

  const handleChange = (id: string | undefined, field: keyof Report, value: string | number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: field === "name" ? value : Number(value) } : r))
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

      // delete all old data for this date (to avoid duplicates)
      await supabase.from("report").delete().eq("date", day)

      // insert all current rows
      const cleanData = reports.map(({ id, ...r }) => ({
        ...r,
        id: id || crypto.randomUUID(),
        date: day,
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

  const formatDisplayDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Calendar size={20} /> Daily Report Manager
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prevDay}>
              <ChevronLeft size={18} /> Prev
            </Button>
            <div className="text-sm font-medium text-foreground">{formatDisplayDate(date)}</div>
            <Button variant="outline" onClick={nextDay}>
              Next <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {error && <p className="text-destructive mb-3">{error}</p>}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-6">Loading daily data...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-lg overflow-hidden">
                <thead className="bg-primary/10 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Income</th>
                    <th className="py-3 px-4 text-left font-semibold">Tip</th>
                    <th className="py-3 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-primary/5 transition-colors">
                      <td className="py-2 px-4">
                        <Input
                          value={r.name}
                          placeholder="Enter name"
                          onChange={(e) => handleChange(r.id, "name", e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Input
                          type="number"
                          value={r.income}
                          onChange={(e) => handleChange(r.id, "income", e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Input
                          type="number"
                          value={r.tip}
                          onChange={(e) => handleChange(r.id, "tip", e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteRow(r.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <Button onClick={handleAddRow} variant="outline" className="flex items-center gap-2">
                <Plus size={16} /> Add Row
              </Button>

              <div className="flex gap-3">
                {isEditing && (
                  <Button onClick={() => fetchDailyData()} variant="outline" className="flex items-center gap-2">
                    <X size={16} /> Cancel
                  </Button>
                )}
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={16} /> Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
