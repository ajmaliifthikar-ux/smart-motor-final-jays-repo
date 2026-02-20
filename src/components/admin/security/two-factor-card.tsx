'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Shield, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Setup2FAModal from '@/components/admin/modals/setup-2fa-modal'
import Verify2FAModal from '@/components/admin/modals/verify-2fa-modal'
import BackupCodesModal from '@/components/admin/modals/backup-codes-modal'

interface TwoFactorCardProps {
  isEnabled: boolean
  method?: string
  backupCodesCount?: number
  onSettingsChanged: () => void
}

export default function TwoFactorCard({
  isEnabled,
  method,
  backupCodesCount = 0,
  onSettingsChanged,
}: TwoFactorCardProps) {
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDisable2FA() {
    setShowVerifyModal(true)
  }

  async function handleRegenerateBackupCodes() {
    setShowVerifyModal(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
            {isEnabled ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="border-orange-200 text-orange-800">
                Disabled
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            Add an extra layer of security to your account by requiring a code from an
            authenticator app when logging in.
          </p>
        </div>

        {/* Status Card */}
        {isEnabled ? (
          <Card className="border-green-200 bg-green-50 p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">2FA is Active</h3>
                <p className="text-sm text-green-800 mt-1">
                  Your account is protected with {method || 'authenticator-based'} two-factor
                  authentication.
                </p>
                {backupCodesCount !== undefined && (
                  <p className="text-sm text-green-700 mt-2">
                    You have <strong>{backupCodesCount} backup codes</strong> remaining.
                    {backupCodesCount < 3 && (
                      <span className="ml-2 inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        Low supply
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">2FA is Disabled</h3>
                <p className="text-sm text-orange-800 mt-1">
                  Your account has basic protection. Enabling 2FA provides significantly better
                  security.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Information Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">How it works</h3>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0">
                1
              </span>
              <span className="text-sm text-gray-700">
                Scan a QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0">
                2
              </span>
              <span className="text-sm text-gray-700">
                Verify your setup by entering a code from your app
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0">
                3
              </span>
              <span className="text-sm text-gray-700">
                Save your backup codes in a secure location
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0">
                4
              </span>
              <span className="text-sm text-gray-700">
                Enter a code when logging in for added security
              </span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {!isEnabled ? (
            <Button
              onClick={() => setShowSetupModal(true)}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Enable Two-Factor Authentication
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleRegenerateBackupCodes}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Backup Codes
              </Button>
              <Button
                variant="danger"
                onClick={handleDisable2FA}
                className="flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Disable 2FA
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <Setup2FAModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={() => {
          setShowSetupModal(false)
          onSettingsChanged()
        }}
      />

      <Verify2FAModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        purpose={showBackupCodesModal ? 'regenerate' : 'disable'}
        onSuccess={() => {
          setShowVerifyModal(false)
          if (showBackupCodesModal) {
            setShowBackupCodesModal(true)
          }
          onSettingsChanged()
        }}
      />

      <BackupCodesModal
        isOpen={showBackupCodesModal}
        onClose={() => setShowBackupCodesModal(false)}
      />
    </>
  )
}
