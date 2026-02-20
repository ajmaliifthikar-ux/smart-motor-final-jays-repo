'use client'

import { useState, useEffect } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AlertCircle, Lock, KeyRound, Smartphone, Clock, Settings } from 'lucide-react'
import TwoFactorCard from '@/components/admin/security/two-factor-card'
import PasswordManagement from '@/components/admin/security/password-management'
import SecurityQuestions from '@/components/admin/security/security-questions'
import TrustedDevices from '@/components/admin/security/trusted-devices'
import SessionManagement from '@/components/admin/security/session-management'

interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod?: string
  lastPasswordChange?: Date
  backupCodesCount?: number
  trustedDevices?: Array<{
    id: string
    name: string
    ipAddress: string
    lastUsedAt: Date
    createdAt: Date
  }>
}

export default function SecuritySettingsPage() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load security settings
    loadSecuritySettings()
  }, [])

  async function loadSecuritySettings() {
    try {
      const response = await fetch('/api/admin/2fa/status')
      if (response.ok) {
        const data = await response.json()
        setSecuritySettings(data)
      }
    } catch (error) {
      console.error('Failed to load security settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const securityTabs = [
    {
      id: 'two-factor',
      label: '2FA',
      content: (
        <div className="bg-white rounded-lg p-6">
          <TwoFactorCard
            isEnabled={securitySettings?.twoFactorEnabled || false}
            method={securitySettings?.twoFactorMethod}
            backupCodesCount={securitySettings?.backupCodesCount}
            onSettingsChanged={loadSecuritySettings}
          />
        </div>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      content: (
        <div className="bg-white rounded-lg p-6">
          <PasswordManagement
            lastChanged={securitySettings?.lastPasswordChange}
            onPasswordChanged={loadSecuritySettings}
          />
        </div>
      ),
    },
    {
      id: 'questions',
      label: 'Questions',
      content: (
        <div className="bg-white rounded-lg p-6">
          <SecurityQuestions onQuestionsUpdated={loadSecuritySettings} />
        </div>
      ),
    },
    {
      id: 'devices',
      label: 'Devices',
      content: (
        <div className="bg-white rounded-lg p-6">
          <TrustedDevices
            devices={securitySettings?.trustedDevices || []}
            onDevicesChanged={loadSecuritySettings}
          />
        </div>
      ),
    },
    {
      id: 'sessions',
      label: 'Sessions',
      content: (
        <div className="bg-white rounded-lg p-6">
          <SessionManagement onSessionsChanged={loadSecuritySettings} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account security, passwords, and authentication methods
        </p>
      </div>

      {/* Security Alert Banner */}
      <Card className="border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Security Best Practices</h3>
            <p className="text-sm text-amber-800 mt-1">
              Keep your account secure by enabling two-factor authentication, using strong
              passwords, and regularly reviewing your security settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs for Different Security Sections */}
      <Tabs tabs={securityTabs} defaultTab="two-factor" />
    </div>
  )
}
