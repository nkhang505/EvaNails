"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

  function getMonday(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  function getSundayFromMonday(monday: Date) {
    return new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

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

      const { data, error } = await supabase
        .from("report")
        .select("name, income, tip, date")
        .gte("date", start)
        .lte("date", end)

      if (error) throw error

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

  const exportToPDF = () => {
    if (summaries.length === 0) return

    const doc = new jsPDF()

    // Title
    doc.setFontSize(16)
    doc.text("Weekly Summary", 14, 20)
    doc.setFontSize(12)
    doc.text(`Week: ${formatDisplayDate(weekStart)} - ${formatDisplayDate(displayEnd)}`, 14, 28)

    const headers = [["Name", "Income", "Tip", "Check + Tip", "Cash"]]
    const rows = summaries.map((s) => {
      const checkPlusTip = s.totalIncome * 0.6 * 0.6 + s.totalTip
      const cash = s.totalIncome * 0.6 * 0.4
      return [
        s.name,
        `$${s.totalIncome.toFixed(2)}`,
        `$${s.totalTip.toFixed(2)}`,
        `$${checkPlusTip.toFixed(2)}`,
        `$${cash.toFixed(2)}`,
      ]
    })

    autoTable(doc, {
      startY: 35,
      head: headers,
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [33, 150, 243] },
    })

    doc.save(`weekly_summary_${formatLocalDate(weekStart)}.pdf`)
}

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 bg-card border-border shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2 justify-center sm:justify-start">
            <Calendar size={20} /> Weekly Pay
          </h3>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Button variant="outline" onClick={prevWeek} className="text-sm sm:text-base">
              <ChevronLeft size={16} /> Prev
            </Button>
            <div className="text-sm font-medium text-foreground text-center min-w-[120px]">
              {formatDisplayDate(weekStart)} - {formatDisplayDate(displayEnd)}
            </div>
            <Button variant="outline" onClick={nextWeek} className="text-sm sm:text-base">
              Next <ChevronRight size={16} />
            </Button>
          </div>
          <Button onClick={exportToPDF} className="flex items-center gap-2 text-sm sm:text-base">
            <Download size={16} /> Export
          </Button>
        </div>

        {/* Status */}
        {error && <p className="text-destructive mb-4 text-center">{error}</p>}
        {isLoading ? (
          <p className="text-foreground text-center py-6">Loading weekly data...</p>
        ) : summaries.length === 0 ? (
          <p className="text-foreground text-center py-6">No data for this week.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto rounded-md">
              <table className="w-full border border-border rounded-md overflow-hidden text-lg">
                <thead className="bg-primary/10">
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

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {summaries.map((s) => {
                const checkPlusTip = s.totalIncome * 0.6 * 0.6 + s.totalTip
                const cash = s.totalIncome * 0.6 * 0.4
                return (
                  <Card key={s.name} className="p-4 border border-border shadow-sm">
                    <h4 className="font-semibold text-primary text-xl mb-1">{s.name}</h4>
                    <p className="text-lg text-foreground">
                      <strong>Income / Tip:</strong> ${s.totalIncome.toFixed(2)} / ${s.totalTip.toFixed(2)}
                    </p>
                    <p className="text-lg text-green-700 font-semibold mt-1">
                      Check + Tip: ${checkPlusTip.toFixed(2)}
                    </p>
                    <p className="text-lg text-yellow-700 font-semibold">
                      Cash: ${cash.toFixed(2)}
                    </p>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
