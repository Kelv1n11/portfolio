"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailProcessor } from "@/components/email-processor"
import { EmailConnection } from "@/components/email-connection"
import { CalendarView } from "@/components/calendar-view"
import { ObligationDetails } from "@/components/obligation-details"
import { TaskManager } from "@/components/task-manager"
import { DashboardOverview } from "@/components/dashboard-overview"
import { Brain } from "lucide-react"

interface Obligation {
  id: string
  type: "meeting" | "task" | "deadline"
  title: string
  description: string
  date?: string
  time?: string
  priority: "low" | "medium" | "high"
  location?: string
  attendees?: string[]
  source: string
  completed?: boolean
}

export default function EmailObligationTracker() {
  const [obligations, setObligations] = useState<Obligation[]>([])

  const handleObligationsExtracted = (newObligations: any[]) => {
    const obligationsWithIds = newObligations.map((obligation) => ({
      ...obligation,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completed: false,
    }))
    setObligations(obligationsWithIds)
  }

  const handleEmailsFetched = async (emails: any[]) => {
    try {
      // Process fetched emails through our AI system
      const response = await fetch("/api/process-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emails.map((email) => email.body) }),
      })

      const { obligations: extractedObligations } = await response.json()
      handleObligationsExtracted(extractedObligations)
    } catch (error) {
      console.error("Failed to process fetched emails:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Email Obligation Tracker</h1>
              <p className="text-muted-foreground">
                AI-powered email analysis for automatic task and meeting extraction
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Email Processing Section */}
          <div className="xl:col-span-1 space-y-6">
            <EmailConnection onEmailsFetched={handleEmailsFetched} />
            <EmailProcessor onObligationsExtracted={handleObligationsExtracted} />
          </div>

          {/* Main Content Section */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <DashboardOverview obligations={obligations} />
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <CalendarView obligations={obligations} />
              </TabsContent>

              <TabsContent value="manage" className="mt-6">
                <TaskManager obligations={obligations} onObligationsChange={setObligations} />
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <ObligationDetails obligations={obligations} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
