'use client'

import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

import { useActionState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authenticate } from '@/app/actions/auth'
import { KeyRound, Mail, ArrowRight } from 'lucide-react'

function LoginContent() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined
    )
    const searchParams = useSearchParams()
    const router = useRouter()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin'

    // Handle successful login (no error message)
    useEffect(() => {
        if (!isPending && !errorMessage) {
            // Redirect to callback URL or admin dashboard
            router.push(callbackUrl)
        }
    }, [isPending, errorMessage, router, callbackUrl])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAF9]">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#E62329]/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-black/5 blur-[100px]" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
                <h2 className="mt-6 text-center text-3xl font-black uppercase tracking-tight text-[#121212]">
                    Smart Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your credentials to access the dashboard
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
                <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-white/50">
                    <form action={dispatch} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-xl border-0 py-3.5 pl-11 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E62329] sm:text-sm sm:leading-6 bg-white/50 transition-all"
                                    placeholder="admin@smartmotors.ae"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <KeyRound className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-xl border-0 py-3.5 pl-11 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E62329] sm:text-sm sm:leading-6 bg-white/50 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-xl bg-[#121212] px-3 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E62329] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E62329] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    {isPending ? 'Authenticating...' : 'Sign In'}
                                    {!isPending && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </div>

                        <div
                            className="flex h-8 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage && (
                                <>
                                    <p className="text-sm text-red-500 font-medium w-full text-center bg-red-50 py-2 rounded-lg">
                                        {errorMessage}
                                    </p>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
