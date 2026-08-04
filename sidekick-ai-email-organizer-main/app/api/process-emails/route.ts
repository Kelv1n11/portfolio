import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const obligationSchema = z.object({
  obligations: z.array(
    z.object({
      type: z.enum(["meeting", "task", "deadline"]),
      title: z.string(),
      description: z.string(),
      date: z.string().optional(),
      time: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]),
      location: z.string().optional(),
      attendees: z.array(z.string()).optional(),
      source: z.string(), // Which email this came from
    }),
  ),
})

interface EmailData {
  subject: string
  from: string
  to: string
  date: string
  body: string
}

function parseEmailContent(rawEmail: string): EmailData {
  // Basic email parsing - handles common email formats
  const lines = rawEmail.split("\n")
  let subject = ""
  let from = ""
  let to = ""
  let date = ""
  let body = ""
  let inBody = false

  for (const line of lines) {
    if (!inBody) {
      if (line.toLowerCase().startsWith("subject:")) {
        subject = line.substring(8).trim()
      } else if (line.toLowerCase().startsWith("from:")) {
        from = line.substring(5).trim()
      } else if (line.toLowerCase().startsWith("to:")) {
        to = line.substring(3).trim()
      } else if (line.toLowerCase().startsWith("date:")) {
        date = line.substring(5).trim()
      } else if (line.trim() === "") {
        inBody = true
      }
    } else {
      body += line + "\n"
    }
  }

  // If no headers found, treat entire content as body
  if (!subject && !from && !body) {
    body = rawEmail
    subject = "Email Content"
  }

  return { subject, from, to, date, body: body.trim() }
}

function cleanEmailContent(content: string): string {
  // Remove common email artifacts
  return content
    .replace(/^>.*$/gm, "") // Remove quoted lines
    .replace(/On .* wrote:/g, "") // Remove "On ... wrote:" lines
    .replace(/-----Original Message-----[\s\S]*$/i, "") // Remove forwarded content
    .replace(/\[mailto:.*?\]/g, "") // Remove mailto links
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
}

export async function POST(request: Request) {
  try {
    const { emails } = await request.json()

    if (!Array.isArray(emails) || emails.length === 0) {
      return Response.json({ error: "No emails provided" }, { status: 400 })
    }

    const allObligations = []

    for (const rawEmail of emails) {
      const emailData = parseEmailContent(rawEmail)
      const cleanedBody = cleanEmailContent(emailData.body)

      const emailContext = `
Subject: ${emailData.subject}
From: ${emailData.from}
Date: ${emailData.date}
Content: ${cleanedBody}
      `.trim()

      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: obligationSchema,
        prompt: `Analyze this email and extract any obligations like meetings, tasks, or deadlines.
        
        Email: ${emailContext}
        
        Look for:
        - Meeting invitations, requests, or confirmations
        - Tasks that need to be completed
        - Deadlines or due dates
        - Action items or commitments
        - Follow-up requirements
        - Appointments or scheduled calls
        
        Consider the email context (subject, sender, date) when determining priority and details.
        Extract specific dates, times, locations, and attendees when mentioned.
        If no specific date is mentioned but urgency is implied, note that in the description.`,
      })

      // Add source information to each obligation
      const obligationsWithSource = object.obligations.map((obligation) => ({
        ...obligation,
        source: emailData.subject || `Email from ${emailData.from}` || "Email Content",
      }))

      allObligations.push(...obligationsWithSource)
    }

    return Response.json({ obligations: allObligations })
  } catch (error) {
    console.error("Error processing emails:", error)
    return Response.json({ error: "Failed to process emails" }, { status: 500 })
  }
}
