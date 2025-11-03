"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Report {
  id: string
  name: string
  income: number
  tip: number
  date: string
}

interface WeeklySummary {
  name: string
  totalIncome: number
  totalTip: number
}

export default function WeeklyManager() {
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()))
  const [summaries, setSummaries] = useState<WeeklySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeeklyData()
  }, [weekStart])

  // Get Monday of the week
  function getMonday(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  // Get Sunday of the week (derived from monday)
  function getSundayFromMonday(monday: Date) {
    return new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  // Format date as YYYY-MM-DD using local date (avoids timezone shifts)
  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const fetchWeeklyData = async () => {
    try {
      setIsLoading(true)

      const start = formatLocalDate(weekStart)
      const weekEnd = getSundayFromMonday(weekStart)
      const end = formatLocalDate(weekEnd)

      // Query reports between local start and end (inclusive)
      const { data, error } = await supabase
        .from("report")
        .select("name, income, tip, date")
        .gte("date", start)
        .lte("date", end)

      if (error) throw error

      // Group by name
      const grouped: Record<string, WeeklySummary> = {}
      data?.forEach((item: Report) => {
        if (!grouped[item.name]) {
          grouped[item.name] = { name: item.name, totalIncome: 0, totalTip: 0 }
        }
        grouped[item.name].totalIncome += Number(item.income) || 0
        grouped[item.name].totalTip += Number(item.tip) || 0
      })

      setSummaries(Object.values(grouped))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weekly data")
    } finally {
      setIsLoading(false)
    }
  }

  const prevWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(weekStart.getDate() - 7)
    setWeekStart(getMonday(newStart))
  }

  const nextWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(weekStart.getDate() + 7)
    setWeekStart(getMonday(newStart))
  }

  const formatDisplayDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const displayEnd = getSundayFromMonday(weekStart)

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Calendar size={20} /> Weekly Manager
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prevWeek}>
              <ChevronLeft size={18} /> Prev
            </Button>
            <div className="text-sm font-medium text-foreground">
              {formatDisplayDate(weekStart)} - {formatDisplayDate(displayEnd)}
            </div>
            <Button variant="outline" onClick={nextWeek}>
              Next <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-6">Loading weekly data...</p>
        ) : summaries.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No data for this week.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg overflow-hidden">
              <thead className="bg-primary/10 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Income / Tip</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Check + Tip</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Cash</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => {
                  const checkPlusTip = s.totalIncome * 0.6 * 0.6 + s.totalTip
                  const cash = s.totalIncome * 0.6 * 0.4
                  return (
                    <tr
                      key={s.name}
                      className="border-t border-border hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-2 px-4">{s.name}</td>
                      <td className="py-2 px-4 text-primary font-medium">
                        ${s.totalIncome.toFixed(2)} / ${s.totalTip.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-green-700 font-semibold">
                        ${checkPlusTip.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-yellow-700 font-semibold">
                        ${cash.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
