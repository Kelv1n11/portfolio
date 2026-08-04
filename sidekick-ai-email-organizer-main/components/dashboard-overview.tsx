"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, Target, AlertCircle } from "lucide-react"

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

interface DashboardOverviewProps {
  obligations: Obligation[]
}

export function DashboardOverview({ obligations }: DashboardOverviewProps) {
  const stats = useMemo(() => {
    const total = obligations.length
    const completed = obligations.filter((o) => o.completed).length
    const pending = total - completed

    const byType = {
      meetings: obligations.filter((o) => o.type === "meeting").length,
      tasks: obligations.filter((o) => o.type === "task").length,
      deadlines: obligations.filter((o) => o.type === "deadline").length,
    }

    const byPriority = {
      high: obligations.filter((o) => o.priority === "high" && !o.completed).length,
      medium: obligations.filter((o) => o.priority === "medium" && !o.completed).length,
      low: obligations.filter((o) => o.priority === "low" && !o.completed).length,
    }

    // Calculate upcoming (next 7 days) and overdue
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcoming = obligations.filter((o) => {
      if (!o.date || o.completed) return false
      const obligationDate = new Date(o.date)
      return obligationDate >= now && obligationDate <= nextWeek
    })

    const overdue = obligations.filter((o) => {
      if (!o.date || o.completed) return false
      const obligationDate = new Date(o.date)
      return obligationDate < now
    })

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      pending,
      byType,
      byPriority,
      upcoming: upcoming.length,
      overdue: overdue.length,
      completionRate,
      upcomingItems: upcoming.slice(0, 5),
      overdueItems: overdue.slice(0, 5),
    }
  }, [obligations])

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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Obligations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed, {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
            <CardDescription>Pending obligations by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded"></div>
                <span className="text-sm">High Priority</span>
              </div>
              <Badge className="bg-destructive text-destructive-foreground">{stats.byPriority.high}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span className="text-sm">Medium Priority</span>
              </div>
              <Badge className="bg-secondary text-secondary-foreground">{stats.byPriority.medium}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span className="text-sm">Low Priority</span>
              </div>
              <Badge className="bg-muted text-muted-foreground">{stats.byPriority.low}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type Distribution</CardTitle>
            <CardDescription>All obligations by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Meetings</span>
              </div>
              <Badge variant="outline">{stats.byType.meetings}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Tasks</span>
              </div>
              <Badge variant="outline">{stats.byType.tasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Deadlines</span>
              </div>
              <Badge variant="outline">{stats.byType.deadlines}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming and Overdue Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming This Week
            </CardTitle>
            <CardDescription>Next {stats.upcomingItems.length} upcoming obligations</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming obligations this week</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingItems.map((obligation) => (
                  <div key={obligation.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    {getTypeIcon(obligation.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{obligation.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {obligation.date} {obligation.time && `at ${obligation.time}`}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(obligation.priority)} variant="secondary">
                      {obligation.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Overdue Items
            </CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.overdueItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No overdue items - great job!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.overdueItems.map((obligation) => (
                  <div
                    key={obligation.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    {getTypeIcon(obligation.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{obligation.title}</p>
                      <p className="text-xs text-destructive">
                        Due: {obligation.date} {obligation.time && `at ${obligation.time}`}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(obligation.priority)}>{obligation.priority}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
