'use client'

import { useState } from 'react'
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
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Verify2FAModalProps {
  isOpen: boolean
  onClose: () => void
  purpose: 'disable' | 'regenerate' | 'action'
  onSuccess: () => void
}

type VerifyMethod = 'totp' | 'backup'

export default function Verify2FAModal({
  isOpen,
  onClose,
  purpose,
  onSuccess,
}: Verify2FAModalProps) {
  const [method, setMethod] = useState<VerifyMethod>('totp')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()

    if (!code || !password) {
      toast.error('Please enter code and password')
      return
    }

    setIsLoading(true)

    try {
      let endpoint = '/api/admin/2fa/disable'

      if (purpose === 'regenerate') {
        endpoint = '/api/admin/2fa/backup-codes/regenerate'
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [method === 'totp' ? 'totpCode' : 'backupCode']: code,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Verification failed')
        return
      }

      toast.success('Verified successfully')
      setCode('')
      setPassword('')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('An error occurred during verification')
      console.error('Verification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPurposeText = () => {
    switch (purpose) {
      case 'disable':
        return 'Disable Two-Factor Authentication'
      case 'regenerate':
        return 'Regenerate Backup Codes'
      default:
        return 'Verify Identity'
    }
  }

  const getPurposeDescription = () => {
    switch (purpose) {
      case 'disable':
        return 'To disable 2FA, please verify your identity with your current authentication method.'
      case 'regenerate':
        return 'To regenerate backup codes, please verify your identity for security.'
      default:
        return 'Please verify your identity to continue.'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getPurposeText()}</DialogTitle>
          <DialogDescription>{getPurposeDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4">
          {/* Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Verification Method</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('totp')
                  setCode('')
                }}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  method === 'totp'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Authenticator
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('backup')
                  setCode('')
                }}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  method === 'backup'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Backup Code
              </button>
            </div>
          </div>

          {/* Code Input */}
          <div>
            <Label htmlFor="code">
              {method === 'totp' ? '6-Digit Code' : 'Backup Code'}
            </Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => {
                let value = e.target.value.toUpperCase()
                if (method === 'totp') {
                  value = value.replace(/\D/g, '').slice(0, 6)
                }
                setCode(value)
              }}
              placeholder={method === 'totp' ? '000000' : 'ABCD-1234'}
              maxLength={method === 'totp' ? 6 : 9}
              className="mt-1"
              inputMode={method === 'totp' ? 'numeric' : 'text'}
            />
            {method === 'totp' && (
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code from your authenticator app
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Current Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {purpose === 'disable' &&
                'Disabling 2FA will reduce your account security. We recommend keeping it enabled.'}
              {purpose === 'regenerate' &&
                'Your old backup codes will no longer work after regeneration.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || !code || !password}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
