"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, CheckCircle } from "lucide-react"

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

interface CalendarViewProps {
  obligations: Obligation[]
}

export function CalendarView({ obligations }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Parse obligation dates and organize by day
  const obligationsByDate = useMemo(() => {
    const dateMap: { [key: string]: Obligation[] } = {}

    obligations.forEach((obligation) => {
      if (obligation.date) {
        // Try to parse various date formats
        let parsedDate: Date | null = null

        // Try common formats
        const dateFormats = [
          obligation.date, // As is
          `${obligation.date} ${new Date().getFullYear()}`, // Add current year
          obligation.date.replace(/(\w+)\s+(\d+)(?:st|nd|rd|th)?/, "$1 $2"), // Remove ordinals
        ]

        for (const format of dateFormats) {
          const testDate = new Date(format)
          if (!isNaN(testDate.getTime())) {
            parsedDate = testDate
            break
          }
        }

        if (parsedDate) {
          const dateKey = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}-${parsedDate.getDate()}`
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = []
          }
          dateMap[dateKey].push(obligation)
        }
      }
    })

    return dateMap
  }, [obligations])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      const dateKey = `${currentDateObj.getFullYear()}-${currentDateObj.getMonth()}-${currentDateObj.getDate()}`
      const dayObligations = obligationsByDate[dateKey] || []

      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        obligations: dayObligations,
      })

      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return days
  }, [currentDate, obligationsByDate])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive"
      case "medium":
        return "bg-secondary"
      case "low":
        return "bg-muted"
      default:
        return "bg-muted"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-3 w-3" />
      case "task":
        return <CheckCircle className="h-3 w-3" />
      case "deadline":
        return <Clock className="h-3 w-3" />
      default:
        return <CheckCircle className="h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded-lg ${
                day.isCurrentMonth ? "bg-background" : "bg-muted/30"
              } ${day.isToday ? "ring-2 ring-accent" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                } ${day.isToday ? "text-accent font-bold" : ""}`}
              >
                {day.date.getDate()}
              </div>

              <div className="space-y-1">
                {day.obligations.slice(0, 3).map((obligation, obligationIndex) => (
                  <div
                    key={obligationIndex}
                    className={`text-xs p-1 rounded text-white truncate ${getPriorityColor(obligation.priority)}`}
                    title={`${obligation.title} - ${obligation.description}`}
                  >
                    <div className="flex items-center gap-1">
                      {getTypeIcon(obligation.type)}
                      <span className="truncate">{obligation.title}</span>
                    </div>
                    {obligation.time && <div className="text-xs opacity-90">{obligation.time}</div>}
                  </div>
                ))}
                {day.obligations.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">+{day.obligations.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Task</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
