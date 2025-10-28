"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, TrendingUp } from "lucide-react"

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
}

export default function TransactionCalculator() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: "Morning Services", amount: 250, date: "2024-10-27" },
    { id: 2, description: "Afternoon Appointments", amount: 180, date: "2024-10-27" },
  ])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  const handleAddTransaction = () => {
    if (description && amount && Number.parseFloat(amount) > 0) {
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          description,
          amount: Number.parseFloat(amount),
          date: new Date().toISOString().split("T")[0],
        },
      ])
      setDescription("")
      setAmount("")
    }
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const average = transactions.length > 0 ? total / transactions.length : 0

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-primary mt-2">${total.toFixed(2)}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-muted-foreground text-sm">Average Transaction</p>
          <p className="text-3xl font-bold text-primary mt-2">${average.toFixed(2)}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-muted-foreground text-sm">Total Transactions</p>
          <p className="text-3xl font-bold text-primary mt-2">{transactions.length}</p>
        </Card>
      </div>

      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} />
          Add Transaction
        </h3>
        <div className="space-y-4">
          <InputField
            label="Description"
            type="text"
            placeholder="e.g., Morning Services"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <InputField
            label="Amount ($)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <Button onClick={handleAddTransaction} className="bg-primary hover:bg-primary/90 w-full">
            <Plus size={16} className="mr-2" /> Add Transaction
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
          <TrendingUp size={20} />
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">No transactions yet. Add one to get started!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="bg-card border-border p-4 flex justify-between items-center hover:border-primary transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{transaction.description}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-primary font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                  <Button
                    onClick={() => handleDeleteTransaction(transaction.id)}
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
    </div>
  )
}
