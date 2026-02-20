'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordManagementProps {
  lastChanged?: Date
  onPasswordChanged: () => void
}

interface PasswordRequirement {
  met: boolean
  text: string
}

export default function PasswordManagement({
  lastChanged,
  onPasswordChanged,
}: PasswordManagementProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([])
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    validatePasswordRequirements(value)
  }

  const validatePasswordRequirements = (pwd: string) => {
    const requirements: PasswordRequirement[] = [
      {
        met: pwd.length >= 8,
        text: 'At least 8 characters',
      },
      {
        met: /[A-Z]/.test(pwd),
        text: 'One uppercase letter',
      },
      {
        met: /[a-z]/.test(pwd),
        text: 'One lowercase letter',
      },
      {
        met: /\d/.test(pwd),
        text: 'One number',
      },
      {
        met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
        text: 'One special character',
      },
    ]

    setPasswordRequirements(requirements)
    const metCount = requirements.filter((r) => r.met).length
    setPasswordStrength((metCount / requirements.length) * 100)
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200'
    if (passwordStrength < 40) return 'bg-red-500'
    if (passwordStrength < 60) return 'bg-orange-500'
    if (passwordStrength < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength < 40) return 'Weak'
    if (passwordStrength < 60) return 'Fair'
    if (passwordStrength < 80) return 'Good'
    return 'Strong'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Current password is required')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    const allRequirementsMet = passwordRequirements.every((r) => r.met)
    if (!allRequirementsMet) {
      toast.error('New password does not meet all requirements')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/security/password/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to change password')
        return
      }

      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordRequirements([])
      setPasswordStrength(0)
      setIsOpen(false)
      onPasswordChanged()
    } catch (error) {
      toast.error('An error occurred while changing password')
      console.error('Password change error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Password Management</h2>
        <p className="text-gray-600 mt-2">Keep your account secure with a strong password</p>
      </div>

      {/* Current Status */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Password Status</h3>
            {lastChanged ? (
              <p className="text-sm text-blue-800 mt-1">
                Last changed on {new Date(lastChanged).toLocaleDateString()} at{' '}
                {new Date(lastChanged).toLocaleTimeString()}
              </p>
            ) : (
              <p className="text-sm text-blue-800 mt-1">
                Last changed when you created your account
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Change Password Form */}
      {isOpen ? (
        <Card className="p-6 border-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter a new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Password strength:</span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength < 40
                          ? 'text-red-600'
                          : passwordStrength < 60
                          ? 'text-orange-600'
                          : passwordStrength < 80
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-200`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {passwordRequirements.length > 0 && (
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-green-100' : 'bg-gray-200'
                        }`}
                      >
                        {req.met && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                      </div>
                      <span
                        className={`text-xs ${
                          req.met ? 'text-green-700 font-medium' : 'text-gray-600'
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Warning */}
            <Card className="p-3 bg-amber-50 border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  You will be logged out after changing your password. You'll need to log in
                  again with your new password.
                </p>
              </div>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setPasswordRequirements([])
                  setPasswordStrength(0)
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="w-full">
          Change Password
        </Button>
      )}
    </div>
  )
}
