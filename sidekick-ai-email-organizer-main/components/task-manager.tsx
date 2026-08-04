"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Edit, Trash2, Plus, Check } from "lucide-react"

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

interface TaskManagerProps {
  obligations: Obligation[]
  onObligationsChange: (obligations: Obligation[]) => void
}

export function TaskManager({ obligations, onObligationsChange }: TaskManagerProps) {
  const [editingObligation, setEditingObligation] = useState<Obligation | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newObligation, setNewObligation] = useState<Partial<Obligation>>({
    type: "task",
    priority: "medium",
    completed: false,
  })

  const toggleComplete = (id: string) => {
    const updated = obligations.map((obligation) =>
      obligation.id === id ? { ...obligation, completed: !obligation.completed } : obligation,
    )
    onObligationsChange(updated)
  }

  const deleteObligation = (id: string) => {
    const updated = obligations.filter((obligation) => obligation.id !== id)
    onObligationsChange(updated)
  }

  const saveEdit = () => {
    if (!editingObligation) return

    const updated = obligations.map((obligation) =>
      obligation.id === editingObligation.id ? editingObligation : obligation,
    )
    onObligationsChange(updated)
    setEditingObligation(null)
  }

  const addNewObligation = () => {
    if (!newObligation.title) return

    const obligation: Obligation = {
      id: Date.now().toString(),
      type: newObligation.type as "meeting" | "task" | "deadline",
      title: newObligation.title,
      description: newObligation.description || "",
      date: newObligation.date,
      time: newObligation.time,
      priority: newObligation.priority as "low" | "medium" | "high",
      location: newObligation.location,
      attendees: newObligation.attendees,
      source: "Manual Entry",
      completed: false,
    }

    onObligationsChange([...obligations, obligation])
    setNewObligation({
      type: "task",
      priority: "medium",
      completed: false,
    })
    setIsAddingNew(false)
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

  const completedCount = obligations.filter((o) => o.completed).length
  const totalCount = obligations.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Task Management
              <Badge variant="secondary" className="ml-2">
                {completedCount}/{totalCount} completed
              </Badge>
            </CardTitle>
            <CardDescription>Manage, edit, and track your obligations</CardDescription>
          </div>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Obligation</DialogTitle>
                <DialogDescription>Create a new task, meeting, or deadline manually.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newObligation.type}
                    onValueChange={(value) => setNewObligation({ ...newObligation, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newObligation.title || ""}
                    onChange={(e) => setNewObligation({ ...newObligation, title: e.target.value })}
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newObligation.description || ""}
                    onChange={(e) => setNewObligation({ ...newObligation, description: e.target.value })}
                    placeholder="Enter description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newObligation.date || ""}
                      onChange={(e) => setNewObligation({ ...newObligation, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="time"
                      value={newObligation.time || ""}
                      onChange={(e) => setNewObligation({ ...newObligation, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newObligation.priority}
                    onValueChange={(value) => setNewObligation({ ...newObligation, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Location (optional)</label>
                  <Input
                    value={newObligation.location || ""}
                    onChange={(e) => setNewObligation({ ...newObligation, location: e.target.value })}
                    placeholder="Enter location..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNewObligation} disabled={!newObligation.title}>
                    Add Obligation
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {obligations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No obligations to manage yet.</p>
            <p className="text-sm">Process emails or add obligations manually.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {obligations.map((obligation) => (
              <Card
                key={obligation.id}
                className={`border-l-4 border-l-accent ${obligation.completed ? "opacity-60" : ""}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={obligation.completed || false}
                      onCheckedChange={() => toggleComplete(obligation.id)}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(obligation.type)}
                          <h3
                            className={`font-semibold text-sm ${
                              obligation.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {obligation.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(obligation.priority)}>{obligation.priority}</Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setEditingObligation(obligation)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Obligation</DialogTitle>
                                <DialogDescription>Update the details of this obligation.</DialogDescription>
                              </DialogHeader>
                              {editingObligation && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                      value={editingObligation.title}
                                      onChange={(e) =>
                                        setEditingObligation({ ...editingObligation, title: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                      value={editingObligation.description}
                                      onChange={(e) =>
                                        setEditingObligation({ ...editingObligation, description: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Date</label>
                                      <Input
                                        type="date"
                                        value={editingObligation.date || ""}
                                        onChange={(e) =>
                                          setEditingObligation({ ...editingObligation, date: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Time</label>
                                      <Input
                                        type="time"
                                        value={editingObligation.time || ""}
                                        onChange={(e) =>
                                          setEditingObligation({ ...editingObligation, time: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <Select
                                      value={editingObligation.priority}
                                      onValueChange={(value) =>
                                        setEditingObligation({ ...editingObligation, priority: value as any })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={saveEdit}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Save Changes
                                    </Button>
                                    <Button variant="outline" onClick={() => setEditingObligation(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteObligation(obligation.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <p
                        className={`text-sm mb-2 ${
                          obligation.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {obligation.description}
                      </p>

                      <div className="text-xs text-muted-foreground mb-2 bg-muted/50 px-2 py-1 rounded">
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
                    </div>
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
