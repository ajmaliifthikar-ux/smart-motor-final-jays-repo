'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordRequirement {
  met: boolean
  text: string
}

interface PageProps {
  params: {
    token: string
  }
}

export default function AdminSetupPage({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'verify' | 'password' | 'complete'>('verify')
  const [adminName, setAdminName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([])
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    // Verify invitation token on mount
    verifyInvitation()
  }, [])

  useEffect(() => {
    // Update password requirements as user types
    if (password) {
      validatePasswordRequirements(password)
    } else {
      setPasswordRequirements([])
      setPasswordStrength(0)
    }
  }, [password])

  async function verifyInvitation() {
    try {
      // Verify the token is valid (could add validation endpoint)
      if (!params.token || !email) {
        toast.error('Invalid invitation link')
        router.push('/')
        return
      }
      setStep('password')
    } catch (error) {
      toast.error('Failed to verify invitation')
      router.push('/')
    }
  }

  function validatePasswordRequirements(pwd: string) {
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
        text: 'One special character (!@#$...)',
      },
    ]

    setPasswordRequirements(requirements)

    const metCount = requirements.filter((r) => r.met).length
    const strength = (metCount / requirements.length) * 100
    setPasswordStrength(strength)
  }

  async function handleCompleteSetup(e: React.FormEvent) {
    e.preventDefault()

    if (!adminName.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match')
      return
    }

    const allRequirementsMet = passwordRequirements.every((r) => r.met)
    if (!allRequirementsMet) {
      toast.error('Password does not meet all requirements')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/invitations/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          email,
          password,
          passwordConfirm,
          adminName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to complete setup')
        return
      }

      setStep('complete')
      toast.success('Account setup complete!')

      // Redirect to 2FA setup after 2 seconds
      setTimeout(() => {
        router.push('/admin/settings?tab=security&step=2fa_setup')
      }, 2000)
    } catch (error) {
      toast.error('An error occurred during setup')
      console.error('Setup error:', error)
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Setup</h1>
            <p className="text-sm text-gray-500 mt-2">Set up your secure admin account</p>
          </div>

          {/* Step 1: Verify Email */}
          {step === 'verify' && (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}

          {/* Step 2: Password Setup */}
          {step === 'password' && (
            <form onSubmit={handleCompleteSetup} className="space-y-6">
              {/* Email Display */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  required
                  className="mt-1"
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Password strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength < 40
                          ? 'text-red-600'
                          : passwordStrength < 60
                          ? 'text-orange-600'
                          : passwordStrength < 80
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
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
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="mt-1"
                />
                {password && passwordConfirm && password !== passwordConfirm && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Security Note */}
              <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  After setup, you'll configure two-factor authentication to secure your account.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !adminName.trim() ||
                  !passwordRequirements.every((r) => r.met) ||
                  password !== passwordConfirm
                }
                className="w-full"
              >
                {isLoading ? 'Setting up...' : 'Continue to 2FA Setup'}
              </Button>
            </form>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-4 py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account Created!</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Redirecting to security setup...
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
