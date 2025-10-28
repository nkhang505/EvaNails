"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ServiceManager from "@/components/admin/service-manager"
import { DollarSign, Settings, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")
  const [activeTab, setActiveTab] = useState<"services">("services")

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

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPinInput("")
    setPinError("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-card border-border p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 metallic-gold">Eva Nails Admin</h1>
          <p className="text-center text-muted-foreground mb-8">Enter PIN to access admin panel</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">PIN Code</label>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.slice(0, 4))}
                onKeyPress={(e) => e.key === "Enter" && handlePinSubmit()}
                className="bg-input border-border text-center text-2xl tracking-widest"
              />
              {pinError && <p className="text-destructive text-sm mt-2">{pinError}</p>}
            </div>

            <Button onClick={handlePinSubmit} className="w-full bg-primary hover:bg-primary/90">
              Access Admin Panel
            </Button>

            <Link href="/">
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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold metallic-gold">
            Eva Nails Admin
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Services</p>
                <p className="text-3xl font-bold text-primary mt-2">6</p>
              </div>
              <Settings className="w-12 h-12 text-primary/30" />
            </div>
          </Card>
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="text-3xl font-bold text-primary mt-2">$2,450</p>
              </div>
              <DollarSign className="w-12 h-12 text-primary/30" />
            </div>
          </Card>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
          <Button
            onClick={() => setActiveTab("services")}
            variant={activeTab === "services" ? "default" : "ghost"}
            className={`rounded-none border-b-2 transition-all ${
              activeTab === "services"
                ? "border-primary bg-transparent text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Services
          </Button>
        </div>

        {activeTab === "services" && <ServiceManager />}
      </div>
    </div>
  )
}
