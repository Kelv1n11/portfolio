"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Settings, Key, Globe } from "lucide-react"

export function SetupInstructions() {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Settings className="h-5 w-5" />
          Microsoft Graph Setup Required
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          To connect your Outlook/Office 365 account, you need to set up a Microsoft App Registration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              1
            </Badge>
            <div>
              <p className="font-medium">Create App Registration</p>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <a
                  href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Azure Portal <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and create a new app registration
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              2
            </Badge>
            <div>
              <p className="font-medium">Configure Redirect URI</p>
              <p className="text-sm text-muted-foreground">
                Add <code className="bg-muted px-1 rounded">http://localhost:3000/api/auth/microsoft</code> as a
                redirect URI
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              3
            </Badge>
            <div>
              <p className="font-medium">Add API Permissions</p>
              <p className="text-sm text-muted-foreground">
                Add <code className="bg-muted px-1 rounded">Mail.Read</code> and{" "}
                <code className="bg-muted px-1 rounded">User.Read</code> permissions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              4
            </Badge>
            <div>
              <p className="font-medium">Set Environment Variables</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  <code className="bg-muted px-1 rounded">MICROSOFT_CLIENT_ID</code>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  <code className="bg-muted px-1 rounded">MICROSOFT_CLIENT_SECRET</code>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <code className="bg-muted px-1 rounded">NEXTAUTH_URL</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
