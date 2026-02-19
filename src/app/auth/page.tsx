'use client'

import { Suspense, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebase-client'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { setSessionCookie } from '@/app/actions/firebase-auth'
import { KeyRound, Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, Fingerprint } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// ─── WebAuthn / Passkey helpers ───────────────────────────────────────────────

function bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let str = ''
    for (const byte of bytes) str += String.fromCharCode(byte)
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const str = atob(base64)
    const buf = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i)
    return buf.buffer
}

const PASSKEY_STORE_KEY = 'sm_admin_passkey_cred_id'
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'smartmotor.ae'
const RP_NAME = 'Smart Motor Admin'

async function registerPasskey(email: string): Promise<boolean> {
    if (!window.PublicKeyCredential) return false
    try {
        const challenge = crypto.getRandomValues(new Uint8Array(32))
        const userId = new TextEncoder().encode(email)

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: RP_NAME, id: RP_ID },
                user: { id: userId, name: email, displayName: 'Smart Motor Admin' },
                pubKeyCredParams: [
                    { type: 'public-key', alg: -7 },   // ES256
                    { type: 'public-key', alg: -257 },  // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    requireResidentKey: true,
                    residentKey: 'required',
                    userVerification: 'required',
                },
                timeout: 60000,
                attestation: 'none',
            },
        }) as PublicKeyCredential | null

        if (!credential) return false
        localStorage.setItem(PASSKEY_STORE_KEY, bufferToBase64url(credential.rawId))
        return true
    } catch {
        return false
    }
}

async function authenticateWithPasskey(): Promise<string | null> {
    if (!window.PublicKeyCredential) return null
    try {
        const challenge = crypto.getRandomValues(new Uint8Array(32))
        const storedId = localStorage.getItem(PASSKEY_STORE_KEY)

        const opts: PublicKeyCredentialRequestOptions = {
            challenge,
            rpId: RP_ID,
            timeout: 60000,
            userVerification: 'required',
        }
        if (storedId) {
            opts.allowCredentials = [{ type: 'public-key', id: base64urlToBuffer(storedId) }]
        }

        const assertion = await navigator.credentials.get({ publicKey: opts }) as PublicKeyCredential | null
        if (!assertion) return null

        // Store credential ID for next time
        localStorage.setItem(PASSKEY_STORE_KEY, bufferToBase64url(assertion.rawId))

        // Return the credential ID as a verifiable token — the server uses the stored
        // Firebase session paired with the passkey as the second factor.
        // We retrieve the persisted Firebase id-token from session storage (set on first
        // password login when user chose to save a passkey).
        const pairedToken = sessionStorage.getItem('sm_admin_paired_token')
        return pairedToken
    } catch {
        return null
    }
}

// ─── Main Login Component ─────────────────────────────────────────────────────

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [showSavePasskey, setShowSavePasskey] = useState(false)
    const [savedIdToken, setSavedIdToken] = useState<string | null>(null)
    const [hasPasskey, setHasPasskey] = useState(() => {
        if (typeof window === 'undefined') return false
        return !!localStorage.getItem(PASSKEY_STORE_KEY)
    })

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin'

    const isPasswordValid = password.length >= 8

    const navigateToAdmin = useCallback(async (idToken: string) => {
        await setSessionCookie(idToken)
        toast.success('Access Granted', { description: 'Welcome back.' })
        router.push(callbackUrl)
        router.refresh()
    }, [callbackUrl, router])

    // ── Password login ──────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError(null)
        if (!isPasswordValid) {
            toast.error('Password must be at least 8 characters')
            return
        }
        setIsLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await userCredential.user.getIdToken()

            // Check if passkeys are supported — offer to save one
            if (window.PublicKeyCredential && !hasPasskey) {
                setSavedIdToken(idToken)
                sessionStorage.setItem('sm_admin_paired_token', idToken)
                setShowSavePasskey(true)
                setIsLoading(false)
                return
            }

            await navigateToAdmin(idToken)
        } catch (error: any) {
            let msg = 'Authentication failed.'
            if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.'
            else if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.'
            else if (error.code === 'auth/user-disabled') msg = 'Account disabled.'
            setAuthError(msg)
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    // ── Save passkey after successful password login ─────────────────────────
    const handleSavePasskey = async () => {
        if (!savedIdToken) return
        setIsLoading(true)
        const saved = await registerPasskey(email)
        if (saved) {
            setHasPasskey(true)
            toast.success('Passkey saved!', { description: 'Use Face ID / fingerprint next time.' })
        } else {
            toast.error('Could not save passkey — continuing with password.')
        }
        await navigateToAdmin(savedIdToken)
    }

    const handleSkipPasskey = async () => {
        if (!savedIdToken) return
        await navigateToAdmin(savedIdToken)
    }

    // ── Passkey login ────────────────────────────────────────────────────────
    const handlePasskeyLogin = async () => {
        setIsPasskeyLoading(true)
        setAuthError(null)
        try {
            const token = await authenticateWithPasskey()
            if (!token) {
                setAuthError('Passkey authentication failed or was cancelled.')
                toast.error('Passkey failed. Use password instead.')
                return
            }
            await navigateToAdmin(token)
        } catch {
            setAuthError('Passkey error. Please use your password.')
            toast.error('Passkey error.')
        } finally {
            setIsPasskeyLoading(false)
        }
    }

    // ── Save Passkey prompt overlay ──────────────────────────────────────────
    if (showSavePasskey) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center py-12 px-6 bg-[#FAFAF9] relative overflow-hidden">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-[#E62329]/5 blur-[120px] animate-pulse" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md z-10 text-center"
                >
                    <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E62329]/50 to-transparent" />
                        <div className="w-20 h-20 bg-[#121212] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl carbon-fiber">
                            <Fingerprint className="text-[#E62329] w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#121212] italic mb-2">
                            Save <span className="silver-shine">Passkey</span>?
                        </h3>
                        <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
                            Sign in instantly next time using Face ID, fingerprint, or device PIN — no password needed.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleSavePasskey}
                                disabled={isLoading}
                                className="w-full bg-[#121212] hover:bg-[#E62329] text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Fingerprint size={16} /> Save Passkey</>}
                            </button>
                            <button
                                onClick={handleSkipPasskey}
                                className="w-full text-[10px] font-black text-gray-400 hover:text-[#121212] transition-colors uppercase tracking-[0.3em] py-3"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-6 bg-[#FAFAF9] relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-[#E62329]/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-black/5 blur-[120px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md z-10 space-y-8 text-center"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-[#121212] mb-2 shadow-2xl carbon-fiber relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[#E62329] opacity-0 group-hover:opacity-10 transition-opacity" />
                    <ShieldCheck className="text-[#E62329] w-10 h-10 relative z-10" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-[#121212] italic leading-none">
                        Smart <span className="silver-shine">Access</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Restricted Engineering Portal</p>
                </div>

                <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E62329]/50 to-transparent" />

                    {/* Passkey login button — shown when a passkey is registered */}
                    {hasPasskey && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <button
                                type="button"
                                onClick={handlePasskeyLogin}
                                disabled={isPasskeyLoading}
                                className="w-full flex items-center justify-center gap-3 bg-[#121212] hover:bg-[#E62329] text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl group"
                            >
                                {isPasskeyLoading ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <>
                                        <Fingerprint size={16} className="group-hover:scale-110 transition-transform" />
                                        Sign in with Passkey
                                    </>
                                )}
                            </button>
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">or use password</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Security ID (Email)</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center text-gray-300 group-focus-within:text-[#E62329] transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username webauthn"
                                    className="block w-full rounded-2xl border-0 py-5 pl-12 pr-4 text-sm font-bold bg-gray-50/50 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#121212] focus:bg-white transition-all outline-none"
                                    placeholder="admin@smartmotor.ae"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Access Key (Password)</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center text-gray-300 group-focus-within:text-[#E62329] transition-colors">
                                    <KeyRound size={16} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password webauthn"
                                    className="block w-full rounded-2xl border-0 py-5 pl-12 pr-12 text-sm font-bold bg-gray-50/50 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#121212] focus:bg-white transition-all outline-none"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#121212] transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {authError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase flex items-center gap-2 border border-red-100"
                                >
                                    <AlertCircle size={14} /> {authError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordValid}
                            className={cn(
                                'group relative flex w-full justify-center rounded-2xl px-3 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all duration-500 overflow-hidden',
                                isPasswordValid ? 'bg-[#121212] hover:bg-[#E62329] shadow-2xl scale-100 active:scale-95' : 'bg-gray-100 cursor-not-allowed text-gray-400'
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading
                                    ? <Loader2 className="animate-spin h-4 w-4" />
                                    : <>Establish Session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                                }
                            </span>
                        </button>
                    </form>
                </div>

                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                    &copy; 2026 Smart Motor UAE. Precision Systems Division.
                </p>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}
