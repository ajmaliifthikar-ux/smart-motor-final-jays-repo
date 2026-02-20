'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Monitor, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface Session {
  id: string
  deviceName: string
  ipAddress: string
  userAgent: string
  lastActivityAt: Date
  createdAt: Date
  isCurrent?: boolean
}

interface SessionManagementProps {
  onSessionsChanged: () => void
}

export default function SessionManagement({ onSessionsChanged }: SessionManagementProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // In a real app, fetch sessions from API
    // For now, show placeholder
    setSessions([
      {
        id: '1',
        deviceName: 'Chrome - macOS',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome',
        lastActivityAt: new Date(),
        createdAt: new Date(),
        isCurrent: true,
      },
    ])
  }, [])

  async function handleRevokeSession(sessionId: string) {
    const session = sessions.find((s) => s.id === sessionId)
    if (session?.isCurrent && !confirm('This is your current session. Logging out will end it.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/security/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to revoke session')
        return
      }

      toast.success('Session revoked successfully')
      onSessionsChanged()
    } catch (error) {
      toast.error('An error occurred while revoking session')
      console.error('Revoke session error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRevokeAllOtherSessions() {
    if (!confirm('This will log out all other sessions. Continue?')) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/security/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokeAllOthers: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to revoke sessions')
        return
      }

      toast.success('All other sessions revoked')
      onSessionsChanged()
    } catch (error) {
      toast.error('An error occurred while revoking sessions')
      console.error('Revoke sessions error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
        <p className="text-gray-600 mt-2">Manage your active login sessions across devices</p>
      </div>

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            If you notice sessions from unknown devices, revoke them immediately for security.
          </p>
        </div>
      </Card>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card className="p-6 text-center">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">No sessions found</h3>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Monitor className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{session.deviceName}</h3>
                      {session.isCurrent && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Current
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">IP: {session.ipAddress}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Last activity{' '}
                      {new Date(session.lastActivityAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Revoke All Button */}
      {sessions.filter((s) => !s.isCurrent).length > 0 && (
        <Button
          variant="outline"
          onClick={handleRevokeAllOtherSessions}
          disabled={isLoading}
          className="w-full text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out All Other Sessions
        </Button>
      )}
    </div>
  )
}
