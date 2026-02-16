'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreateUserPage() {
  const [email, setEmail] = useState('testuser@smartmotor.ae')
  const [password, setPassword] = useState('TestPassword@2026')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/auth/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      setResult(data)

      if (data.success) {
        toast.success('✅ User created!')
      } else if (data.message === 'User already exists') {
        toast.info('ℹ️ User already exists')
      } else {
        toast.error(data.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('Error creating user')
      setResult({ error: 'Failed to create user' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-md mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🔐 Create Test User
          </h1>
          <p className="text-slate-500 mb-8">
            Development only - generates Firebase test accounts
          </p>

          <form onSubmit={handleCreateUser} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@smartmotor.ae"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password@2026"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                Min 6 characters recommended
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : '✨ Create User'}
            </button>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-6 rounded-xl bg-slate-50 border-2 border-slate-200"
              >
                {result.error ? (
                  <div className="flex gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-700">Error</h3>
                      <p className="text-red-600 text-sm">{result.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {result.info}
                    </p>

                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-mono text-sm text-slate-900">
                            {result.email}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.email)}
                          className="p-2 hover:bg-slate-100 rounded transition"
                        >
                          {copied ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-slate-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-500">Password</p>
                          <p className="font-mono text-sm text-slate-900">
                            {result.password}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.password)}
                          className="p-2 hover:bg-slate-100 rounded transition"
                        >
                          {copied ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href="/auth"
                      target="_blank"
                      className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                      🔓 Go to Login
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-slate-400 text-center mt-8">
            This page is only available in development mode
          </p>
        </motion.div>
      </div>
    </div>
  )
}
