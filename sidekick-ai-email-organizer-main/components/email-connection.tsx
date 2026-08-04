"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Calendar, AlertCircle } from "lucide-react"

interface EmailAccount {
  accessToken: string
  account: {
    username: string
    name: string
  }
}

interface EmailConnectionProps {
  onEmailsFetched: (emails: any[]) => void
}

export function EmailConnection({ onEmailsFetched }: EmailConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [account, setAccount] = useState<EmailAccount | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const connectToMicrosoft = async () => {
    setIsConnecting(true)
    try {
      // Get auth URL
      const response = await fetch("/api/auth/microsoft")
      const { authUrl } = await response.json()

      // Open auth window
      const authWindow = window.open(authUrl, "auth", "width=500,height=600")

      // Listen for auth completion
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed)
          setIsConnecting(false)
          // In a real app, you'd handle the callback properly
          // For this MVP, we'll simulate a successful connection
          setTimeout(() => {
            setAccount({
              accessToken: "demo_token",
              account: {
                username: "user@company.com",
                name: "Demo User",
              },
            })
          }, 1000)
        }
      }, 1000)
    } catch (error) {
      console.error("Connection failed:", error)
      setIsConnecting(false)
    }
  }

  const fetchEmails = async () => {
    if (!account) return

    setIsFetching(true)
    try {
      const response = await fetch("/api/emails/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: account.accessToken,
          count: 20,
        }),
      })

      const { emails } = await response.json()
      onEmailsFetched(emails)
    } catch (error) {
      console.error("Failed to fetch emails:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Connection
        </CardTitle>
        <CardDescription>Connect your Outlook/Office 365 account to automatically process emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!account ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              You'll need to set up Microsoft App Registration first
            </div>
            <Button onClick={connectToMicrosoft} disabled={isConnecting} className="w-full">
              {isConnecting ? "Connecting..." : "Connect Microsoft Account"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <div className="font-medium">{account.account.name}</div>
                  <div className="text-sm text-muted-foreground">{account.account.username}</div>
                </div>
              </div>
              <Badge variant="secondary">Connected</Badge>
            </div>

            <div className="flex gap-2">
              <Button onClick={fetchEmails} disabled={isFetching} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                {isFetching ? "Fetching..." : "Fetch Recent Emails"}
              </Button>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
