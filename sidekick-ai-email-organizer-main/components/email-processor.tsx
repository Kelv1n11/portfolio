"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, Trash2, Mail, FileText, Loader2 } from "lucide-react"

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

interface EmailProcessorProps {
  onObligationsExtracted: (obligations: Obligation[]) => void
}

export function EmailProcessor({ onObligationsExtracted }: EmailProcessorProps) {
  const [emails, setEmails] = useState<string[]>([""])
  const [isProcessing, setIsProcessing] = useState(false)
  const [singleEmail, setSingleEmail] = useState("")

  const addEmailField = () => {
    setEmails([...emails, ""])
  }

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, content: string) => {
    const newEmails = [...emails]
    newEmails[index] = content
    setEmails(newEmails)
  }

  const processEmails = async (emailsToProcess: string[]) => {
    const validEmails = emailsToProcess.filter((email) => email.trim())
    if (validEmails.length === 0) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/process-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: validEmails }),
      })

      const data = await response.json()
      onObligationsExtracted(data.obligations || [])
    } catch (error) {
      console.error("Error processing emails:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSingleEmailProcess = () => {
    processEmails([singleEmail])
  }

  const handleMultipleEmailsProcess = () => {
    processEmails(emails)
  }

  const loadSampleEmails = () => {
    const samples = [
      `Subject: Quarterly Review Meeting
From: sarah.manager@company.com
Date: March 10, 2024

Hi John,

I hope this email finds you well. I wanted to follow up on our project discussion and schedule our quarterly review meeting for next Tuesday, March 15th at 2:00 PM in Conference Room B. Please bring the Q1 reports.

Best regards,
Sarah`,
      `Subject: Marketing Campaign Deadline
From: marketing@company.com
Date: March 12, 2024

Team,

Just a reminder that the marketing campaign proposal is due by Friday, March 18th at 5:00 PM. Please make sure to review the draft and submit your final versions.

The client presentation is scheduled for Monday, March 21st at 10:00 AM at their downtown office.

Thanks,
Marketing Team`,
      `Subject: Budget Analysis Task
From: finance@company.com
Date: March 13, 2024

Hi there,

I need you to complete the budget analysis by Wednesday, March 16th so we can discuss it in our team meeting on Thursday.

Also, don't forget about the department meeting this Friday at 3:00 PM.

Best,
Finance Team`,
    ]
    setEmails(samples)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Processing
        </CardTitle>
        <CardDescription>Process single or multiple emails to extract obligations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Email</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <Textarea
              placeholder="Paste your email content here..."
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button
              onClick={handleSingleEmailProcess}
              disabled={!singleEmail.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Email...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Process Email
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="multiple" className="space-y-4">
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    placeholder={`Email ${index + 1} content...`}
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="min-h-[120px] resize-none flex-1"
                  />
                  {emails.length > 1 && (
                    <Button variant="outline" size="icon" onClick={() => removeEmailField(index)} className="mt-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addEmailField} className="flex-1 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
              <Button variant="outline" onClick={loadSampleEmails} className="flex-1 bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Load Samples
              </Button>
            </div>

            <Button
              onClick={handleMultipleEmailsProcess}
              disabled={emails.every((email) => !email.trim()) || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing {emails.filter((e) => e.trim()).length} Emails...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Process All Emails
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
