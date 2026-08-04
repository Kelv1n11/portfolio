import { type NextRequest, NextResponse } from "next/server"
import { ConfidentialClientApplication } from "@azure/msal-node"

function getMsalClient() {
  const clientId = process.env.MICROSOFT_CLIENT_ID
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Microsoft credentials not configured")
  }

  const msalConfig = {
    auth: {
      clientId,
      clientSecret,
      authority: "https://login.microsoftonline.com/common",
    },
  }

  return new ConfidentialClientApplication(msalConfig)
}

export async function GET(request: NextRequest) {
  try {
    const cca = getMsalClient()
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      // Generate auth URL
      const authCodeUrlParameters = {
        scopes: ["https://graph.microsoft.com/Mail.Read", "https://graph.microsoft.com/User.Read"],
        redirectUri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/microsoft`,
      }

      try {
        const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters)
        return NextResponse.json({ authUrl })
      } catch (error) {
        return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
      }
    }

    // Exchange code for token
    try {
      const tokenRequest = {
        code,
        scopes: ["https://graph.microsoft.com/Mail.Read", "https://graph.microsoft.com/User.Read"],
        redirectUri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/microsoft`,
      }

      const response = await cca.acquireTokenByCode(tokenRequest)

      // In a real app, you'd store this token securely (database, encrypted cookies, etc.)
      // For this MVP, we'll return it to be stored client-side
      return NextResponse.json({
        accessToken: response?.accessToken,
        account: response?.account,
      })
    } catch (error) {
      return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 500 })
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Microsoft credentials not configured") {
      return NextResponse.json(
        {
          error:
            "Microsoft Graph integration not configured. Please add MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET environment variables.",
        },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
