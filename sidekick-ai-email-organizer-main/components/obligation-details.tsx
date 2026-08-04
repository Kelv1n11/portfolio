"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react"

interface Obligation {
  type: "meeting" | "task" | "deadline"
  title: string
  description: string
  date?: string
  time?: string
  priority: "low" | "medium" | "high"
  location?: string
  attendees?: string[]
  source: string
}

interface ObligationDetailsProps {
  obligations: Obligation[]
}

export function ObligationDetails({ obligations }: ObligationDetailsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "task":
        return <CheckCircle className="h-4 w-4" />
      case "deadline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const sortedObligations = [...obligations].sort((a, b) => {
    // Sort by priority (high -> medium -> low) then by date
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]

    if (priorityDiff !== 0) return priorityDiff

    // If same priority, sort by date
    if (a.date && b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }

    return 0
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          All Obligations
          {obligations.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {obligations.length} total
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Complete list of extracted meetings, tasks, and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        {obligations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No obligations detected yet.</p>
            <p className="text-sm">Process emails to see extracted tasks and meetings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedObligations.map((obligation, index) => (
              <Card key={index} className="border-l-4 border-l-accent">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(obligation.type)}
                      <h3 className="font-semibold text-sm">{obligation.title}</h3>
                    </div>
                    <Badge className={getPriorityColor(obligation.priority)}>{obligation.priority}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{obligation.description}</p>

                  <div className="text-xs text-muted-foreground mb-3 bg-muted/50 px-2 py-1 rounded">
                    Source: {obligation.source}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {obligation.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {obligation.date}
                      </div>
                    )}
                    {obligation.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {obligation.time}
                      </div>
                    )}
                    {obligation.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {obligation.location}
                      </div>
                    )}
                    {obligation.attendees && obligation.attendees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {obligation.attendees.length} attendees
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
