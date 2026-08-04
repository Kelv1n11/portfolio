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
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const { emailContent } = await request.json()

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: obligationSchema,
      prompt: `Analyze this email and extract any obligations like meetings, tasks, or deadlines. 
      
      Email content: ${emailContent}
      
      Look for:
      - Meeting invitations or requests
      - Tasks that need to be completed
      - Deadlines or due dates
      - Action items
      - Commitments made or requested
      
      Extract the date, time, location, and other relevant details when available.`,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Error analyzing email:", error)
    return Response.json({ error: "Failed to analyze email" }, { status: 500 })
  }
}
