'use client'

export const dynamic = "force-dynamic"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ServiceSlotConfig } from '@/lib/booking-system'
import { ServiceConfigForm } from '@/components/admin/service-config-form'
import { ServiceConfigList } from '@/components/admin/service-config-list'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ServiceConfigPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [status, setStatus] = useState('loading')
  const [configs, setConfigs] = useState<(ServiceSlotConfig & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingConfig, setEditingConfig] = useState<(ServiceSlotConfig & { id: string }) | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch('/api/admin/session')
        const sessionData = await res.json()
        setSession(sessionData?.user || null)
        setStatus(sessionData?.user ? 'authenticated' : 'unauthenticated')
      } catch (e) {
        setSession(null)
        setStatus('unauthenticated')
      } finally {
        setIsMounted(true)
      }
    }
    loadSession()
  }, [])

  useEffect(() => {
    if (!isMounted) return
    if (status === 'unauthenticated') router.push('/auth')
    if (status === 'authenticated' && session?.role !== 'ADMIN') router.push('/')
  }, [status, session, router, isMounted])

  useEffect(() => {
    if (!isMounted || status !== 'authenticated' || session?.role !== 'ADMIN') return

    const fetchConfigs = async () => {
      try {
        const res = await fetch('/api/admin/service-config')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setConfigs(data)
      } catch (error) {
        console.error('Error fetching configs:', error)
        toast.error('Failed to load configurations')
      }
    }

    fetchConfigs()
  }, [status, session, isMounted])

  const handleSubmit = async (config: ServiceSlotConfig) => {
    setIsLoading(true)
    try {
      const url = '/api/admin/service-config'
      const method = editingConfig ? 'PUT' : 'POST'
      const body = editingConfig ? { id: editingConfig.id, ...config } : config

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to save')
      const result = await res.json()

      if (editingConfig) {
        setConfigs((prev) =>
          prev.map((c) => (c.id === editingConfig.id ? { id: result.id, ...result } : c))
        )
        toast.success('Configuration updated')
      } else {
        setConfigs((prev) => [...prev, { id: result.id, ...result }])
        toast.success('Configuration created')
      }
      setEditingConfig(null)
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/service-config?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setConfigs((prev) => prev.filter((c) => c.id !== id))
      toast.success('Configuration deleted')
    } catch (error) {
      console.error('Error deleting config:', error)
      toast.error('Failed to delete configuration')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted || status === 'loading') return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E62329]" />
    </div>
  )
  if (status === 'unauthenticated' || session?.role !== 'ADMIN') return null

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-[#121212] uppercase italic">
            Booking <span className="silver-shine">Engine</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">Global Capacity & Slot Orchestration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-8 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/5 blur-3xl rounded-full" />
            <h2 className="text-lg font-black text-[#121212] mb-6 uppercase tracking-widest relative z-10">
              {editingConfig ? 'Edit Logic' : 'Provision Slot'}
            </h2>
            <div className="relative z-10">
              <ServiceConfigForm
                config={editingConfig || undefined}
                onSubmit={handleSubmit}
                onCancel={() => setEditingConfig(null)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#121212] uppercase tracking-widest">Active Schemas</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Total Active: {configs.length}</p>
              </div>
            </div>
            <ServiceConfigList
              configs={configs}
              onEdit={setEditingConfig}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
