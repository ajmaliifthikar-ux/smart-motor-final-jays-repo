'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  auth,
  googleProvider,
  twitterProvider,
  appleProvider,
  signInWithProvider,
} from '@/lib/firebase-client'
import { toast } from 'sonner'
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

// ─── Social icon components ───────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function exchangeTokenAndRedirect(
  idToken: string,
  router: ReturnType<typeof useRouter>
) {
  const res = await fetch('/api/user/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Session creation failed')
  }
  router.push('/user/dashboard')
  router.refresh()
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserRegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const isLoading = loading !== null

  // ─── Social sign-in (also acts as registration) ──────────────────────────

  const handleSocialSignIn = async (
    providerKey: 'google' | 'twitter' | 'apple'
  ) => {
    const providerMap = {
      google: googleProvider,
      twitter: twitterProvider,
      apple: appleProvider,
    }
    setLoading(providerKey)
    try {
      const credential = await signInWithProvider(providerMap[providerKey])
      const idToken = await credential.user.getIdToken()
      await exchangeTokenAndRedirect(idToken, router)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign-in failed. Please try again.'
      if (!message.includes('popup-closed')) {
        toast.error(message)
      }
    } finally {
      setLoading(null)
    }
  }

  // ─── Email registration ───────────────────────────────────────────────────

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading('email')
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: fullName.trim() })
      const idToken = await credential.user.getIdToken()
      await exchangeTokenAndRedirect(idToken, router)
      toast.success(`Welcome, ${fullName.split(' ')[0]}!`)
    } catch (err: unknown) {
      const msg =
        err instanceof Error && 'code' in err
          ? (err as { code: string }).code === 'auth/email-already-in-use'
            ? 'An account with this email already exists.'
            : (err as Error).message
          : 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#E62329]/8 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#121212]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/5 overflow-hidden">
          {/* Header strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#E62329] via-[#ff4d53] to-[#E62329]" />

          <div className="px-8 pt-8 pb-10">
            {/* Branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1 mb-3">
                <span className="text-3xl font-black uppercase tracking-widest text-[#E62329] italic">
                  Smart
                </span>
                <span className="text-3xl font-black uppercase tracking-widest text-[#121212] italic">
                  Motor
                </span>
              </div>
              <p className="text-[#121212]/50 text-sm font-medium tracking-wide">
                Create your free account
              </p>
            </div>

            {/* Social sign-in buttons */}
            <div className="space-y-3 mb-6">
              {/* Google */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignIn('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#121212] text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <GoogleIcon />
                )}
                Sign up with Google
              </motion.button>

              {/* Twitter / X */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignIn('twitter')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#121212] text-white text-sm font-semibold hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading === 'twitter' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                ) : (
                  <XIcon />
                )}
                Sign up with X
              </motion.button>

              {/* Apple */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialSignIn('apple')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#121212] text-white text-sm font-semibold hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading === 'apple' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                ) : (
                  <AppleIcon />
                )}
                Sign up with Apple
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 font-medium uppercase tracking-widest">
                  or register with email
                </span>
              </div>
            </div>

            {/* Registration form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#121212] placeholder-gray-400 bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] transition-all"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#121212] placeholder-gray-400 bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm text-[#121212] placeholder-gray-400 bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E62329] text-white text-sm font-semibold hover:bg-[#cc1f25] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#E62329]/20"
              >
                {loading === 'email' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link
                href="/user/login"
                className="text-[#E62329] font-semibold hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Tagline below card */}
        <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">
          By creating an account you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  )
}
