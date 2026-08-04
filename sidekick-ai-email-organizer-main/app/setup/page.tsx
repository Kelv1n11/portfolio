import { SetupInstructions } from "@/components/setup-instructions"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Setup Instructions</h1>
            <p className="text-muted-foreground">Follow these steps to connect your Microsoft email account</p>
          </div>
          <SetupInstructions />
        </div>
      </div>
    </div>
  )
}
