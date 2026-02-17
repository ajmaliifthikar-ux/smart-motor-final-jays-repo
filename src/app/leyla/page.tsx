import { LeylaAgent } from '@/components/ui/leyla-agent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Leyla - Smart Motor Booking Assistant',
  description: 'Chat with Leyla, our AI booking assistant, to schedule your service appointment',
}

export default function LeylaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Meet <span className="text-blue-600">Leyla</span> 👋
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your Smart Motor Booking Assistant
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="mb-8 shadow-lg">
          <div className="h-[600px] flex flex-col rounded-lg overflow-hidden">
            <LeylaAgent />
          </div>
        </Card>

        {/* Info Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* About Leyla */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Leyla</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Leyla is your dedicated automotive specialist at Smart Motor. She's passionate about cars and helping you find the perfect service solution.
              </p>
              <p className="text-muted-foreground">
                With years of experience in automotive care, Leyla will guide you through booking your appointment with warmth and expertise.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li>✅ <strong>Chat or Speak:</strong> Use voice or text</li>
                <li>📋 <strong>Provide Info:</strong> Name, contact, car details</li>
                <li>✔️ <strong>Confirm:</strong> Verify your information</li>
                <li>📅 <strong>Schedule:</strong> Book your service</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>What Leyla can help you with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">💬 Services</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Oil Changes</li>
                  <li>✓ Tire Rotations</li>
                  <li>✓ Brake Service</li>
                  <li>✓ Battery Replacement</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📱 Communication</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Text Chat</li>
                  <li>✓ Voice Input</li>
                  <li>✓ Booking Confirmation</li>
                  <li>✓ Service Reminders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Do I need to create an account?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                No! Leyla lets you book without an account. She'll just need your contact information.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Can I use voice input?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes! Click the microphone button to speak. Leyla will understand and respond.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">How long does it take to book?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Usually just a few minutes! Leyla will collect your info and confirm your booking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">What if I change my mind?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll get a confirmation email with options to modify or cancel your booking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Smart Motor © 2026 • All rights reserved<br />
            Contact us: support@smartmotor.ae
          </p>
        </div>
      </div>
    </div>
  )
}
