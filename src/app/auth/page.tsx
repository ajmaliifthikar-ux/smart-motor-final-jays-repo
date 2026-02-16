'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebase-client'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { setSessionCookie } from '@/app/actions/firebase-auth'
import { KeyRound, Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin'

    // Relaxed validation for testing
    const isLongEnough = password.length >= 6
    const isPasswordValid = isLongEnough

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError(null)

        if (!isPasswordValid) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            console.log('🚀 Authenticating via Firebase Client...')
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await userCredential.user.getIdToken()

            await setSessionCookie(idToken)
            
            toast.success('Access Granted')
            router.push(callbackUrl)
            router.refresh()
        } catch (error: any) {
            console.error('Login Error:', error.code)
            let friendlyMessage = 'Authentication failed.'
            
            if (error.code === 'auth/invalid-credential') friendlyMessage = 'Invalid email or password.'
            else if (error.code === 'auth/too-many-requests') friendlyMessage = 'Too many attempts. Locked.'
            else friendlyMessage = error.message

            setAuthError(friendlyMessage)
            toast.error(friendlyMessage)
        } finally {
            setIsLoading(false)
        }
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

                <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 text-left relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E62329]/50 to-transparent" />
                    
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
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-2xl border-0 py-5 pl-12 pr-12 text-sm font-bold bg-gray-50/50 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#121212] focus:bg-white transition-all outline-none"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#121212] transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {authError && (
                            <AnimatePresence>
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase flex items-center gap-2 border border-red-100"
                                >
                                    <AlertCircle size={14} /> {authError}
                                </motion.div>
                            </AnimatePresence>
                        )}

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading || !isPasswordValid}
                                className={cn(
                                    "group relative flex w-full justify-center rounded-2xl px-3 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all duration-500 overflow-hidden",
                                    isPasswordValid ? "bg-[#121212] hover:bg-[#E62329] shadow-2xl scale-100 active:scale-95" : "bg-gray-100 cursor-not-allowed text-gray-400"
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <>Establish Session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
                                </span>
                            </button>

                            {process.env.NODE_ENV === 'development' && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsLoading(true)
                                        try {
                                            await setSessionCookie('mock-token-secret-123')
                                            toast.success('Mock Session Established')
                                            router.push(callbackUrl)
                                            router.refresh()
                                        } catch (error) {
                                            console.error('Mock login failed', error)
                                            toast.error('Mock Login Failed')
                                        } finally {
                                            setIsLoading(false)
                                        }
                                    }}
                                    className="w-full text-center text-[9px] font-black text-gray-400 hover:text-[#E62329] transition-colors mt-2 uppercase tracking-[0.3em] py-2"
                                >
                                    [DEV] Rapid Authentication Bypass
                                </button>
                            )}
                        </div>
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
