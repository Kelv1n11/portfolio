import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@microsoft/microsoft-graph-client"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, count = 10 } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 400 })
    }

    // Create Graph client
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      },
    })

    // Fetch emails from inbox
    const messages = await graphClient
      .api("/me/messages")
      .select("id,subject,from,toRecipients,receivedDateTime,body,hasAttachments")
      .orderby("receivedDateTime desc")
      .top(count)
      .get()

    // Transform messages to our format
    const emails = messages.value.map((message: any) => ({
      id: message.id,
      subject: message.subject || "No Subject",
      from: message.from?.emailAddress?.address || "Unknown",
      fromName: message.from?.emailAddress?.name || "Unknown",
      to: message.toRecipients?.map((r: any) => r.emailAddress?.address).join(", ") || "",
      date: message.receivedDateTime,
      body: message.body?.content || "",
      bodyType: message.body?.contentType || "text",
      hasAttachments: message.hasAttachments || false,
    }))

    return NextResponse.json({ emails })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}
