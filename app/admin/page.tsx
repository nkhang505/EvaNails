"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ServiceManager from "@/components/admin/service-manager"
import GalleryManager from "@/components/admin/gallery-manager"
import WeeklyManager from "@/components/admin/weekly-manager"
import DailyManager from "@/components/admin/daily-manager"
import {
  DollarSign,
  Settings,
  CalendarDays,
  ImageIcon,
} from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")
  const [activeTab, setActiveTab] = useState<"services" | "gallery" | "weekly" | "daily">("daily")

  const handlePinSubmit = () => {
    if (pinInput === "1234") {
      setIsAuthenticated(true)
      setPinError("")
      setPinInput("")
    } else {
      setPinError("Invalid PIN. Please try again.")
      setPinInput("")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <Card className="bg-card border-border p-8 w-full max-w-md shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2">Eva Nails Admin</h1>
          <p className="text-center text-muted-foreground mb-8">
            Enter PIN to access admin panel
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">PIN Code</label>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.slice(0, 4))}
                onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                className="bg-input border-border text-center text-2xl tracking-widest"
              />
              {pinError && <p className="text-destructive text-sm mt-2">{pinError}</p>}
            </div>

            <Button
              onClick={handlePinSubmit}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Access Admin Panel
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Site
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Eva Nails & Spa Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="text-xl sm:text-2xl font-semibold">Eva Nails Admin</h1>
          </Link>

          <div className="flex justify-end w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
            <h2 className="text-2xl font-semibold text-primary">Welcome, Admin!</h2>
            <p className="text-muted-foreground mt-2">
              Manage services, update the gallery, and track your daily and weekly reports.
            </p>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-border justify-around sm:justify-start">
          {[
            { key: "daily", label: "Daily Report", icon: <CalendarDays className="w-5 h-5" /> },
            { key: "weekly", label: "Weekly Pay", icon: <DollarSign className="w-5 h-5" /> },
            { key: "gallery", label: "Gallery", icon: <ImageIcon className="w-5 h-5" /> },
            { key: "services", label: "Services", icon: <Settings className="w-5 h-5" /> },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              variant="ghost"
              className={`rounded-none border-b-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base transition-all px-3 sm:px-4 py-2 sm:py-3 ${activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "services" && <ServiceManager />}
          {activeTab === "weekly" && <WeeklyManager />}
          {activeTab === "daily" && <DailyManager />}
        </div>
      </main>
    </div>
  )
}
