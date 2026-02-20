'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Copy, RefreshCw, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import BackupCodesModal from './backup-codes-modal'

interface Setup2FAModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface SetupData {
  secret: string
  qrCode: string
  manualEntry: string
  setupId: string
  expiresIn: number
}

type SetupStep = 'loading' | 'scan' | 'verify' | 'success'

export default function Setup2FAModal({ isOpen, onClose, onSuccess }: Setup2FAModalProps) {
  const [step, setStep] = useState<SetupStep>('loading')
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      initializeSetup()
    }
  }, [isOpen])

  async function initializeSetup() {
    setStep('loading')
    setCode('')
    setIsLoading(false)

    try {
      const response = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
      })

      if (!response.ok) {
        toast.error('Failed to initialize 2FA setup')
        onClose()
        return
      }

      const data = await response.json()
      setSetupData(data)
      setStep('scan')
    } catch (error) {
      toast.error('An error occurred during setup')
      console.error('Setup error:', error)
      onClose()
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()

    if (!setupData || !code) {
      toast.error('Please enter the verification code')
      return
    }

    if (!/^\d{6}$/.test(code)) {
      toast.error('Code must be 6 digits')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupId: setupData.setupId,
          code,
          generateCodes: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Invalid code')
        setCode('')
        return
      }

      setBackupCodes(data.backupCodes || [])
      setStep('success')
      toast.success('2FA enabled successfully!')
    } catch (error) {
      toast.error('An error occurred during verification')
      console.error('Verification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCopySecret() {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleClose() {
    if (step !== 'loading' && step !== 'verify') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 'loading' && 'Setting up 2FA...'}
              {step === 'scan' && 'Scan QR Code'}
              {step === 'verify' && 'Verify Setup'}
              {step === 'success' && 'Setup Complete'}
            </DialogTitle>
            <DialogDescription>
              {step === 'scan' && 'Use an authenticator app to scan the QR code below'}
              {step === 'verify' && 'Enter the 6-digit code from your authenticator app'}
              {step === 'success' && 'Your 2FA is now enabled. Save your backup codes.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Loading State */}
            {step === 'loading' && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Scan QR Code Step */}
            {step === 'scan' && setupData && (
              <>
                {/* QR Code */}
                <div className="flex justify-center p-6 bg-gray-50 rounded-lg border">
                  <img src={setupData.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>

                {/* Manual Entry Option */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600">
                    Can't scan? Enter manually:
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border font-mono text-sm text-gray-700">
                    <span className="flex-1 break-all">{setupData.secret}</span>
                    <button
                      onClick={handleCopySecret}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Save your secret in a secure location. You'll need it if you need to restore
                    your authenticator.
                  </p>
                </div>

                {/* Next Button */}
                <Button
                  onClick={() => setStep('verify')}
                  className="w-full"
                >
                  Next: Verify Code
                </Button>
              </>
            )}

            {/* Verify Code Step */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Label htmlFor="code">6-Digit Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="mt-1 text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('scan')}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </div>
              </form>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2FA Enabled!</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Your account is now protected with two-factor authentication.
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      setShowBackupCodes(true)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    View Backup Codes
                  </Button>
                  <Button
                    onClick={() => {
                      onSuccess()
                      onClose()
                    }}
                    className="flex-1"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Modal */}
      <BackupCodesModal
        isOpen={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
        backupCodes={backupCodes}
      />
    </>
  )
}
