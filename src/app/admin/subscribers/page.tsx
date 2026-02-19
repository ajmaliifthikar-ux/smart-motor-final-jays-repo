'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, RefreshCw, Search, Loader2, ToggleLeft, ToggleRight, Trash2, Download, CheckCircle2, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Subscriber {
    id: string
    email: string
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
}

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [stats, setStats] = useState({ total: 0, active: 0 })
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/newsletter/subscribers')
            if (res.ok) {
                const data = await res.json()
                setSubscribers(data.subscribers || [])
                setStats({ total: data.total || 0, active: data.active || 0 })
            } else {
                toast.error('Failed to load subscribers')
            }
        } catch {
            toast.error('Network error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = subscribers.filter(s => {
        const matchSearch = search === '' || s.email.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || (filter === 'active' ? s.isActive : !s.isActive)
        return matchSearch && matchFilter
    })

    async function toggleActive(sub: Subscriber) {
        setTogglingId(sub.id)
        try {
            const res = await fetch('/api/newsletter/subscribers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: sub.id, isActive: !sub.isActive }),
            })
            if (res.ok) {
                setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, isActive: !s.isActive } : s))
                setStats(prev => ({
                    ...prev,
                    active: prev.active + (sub.isActive ? -1 : 1),
                }))
                toast.success(sub.isActive ? 'Unsubscribed' : 'Reactivated')
            } else {
                toast.error('Update failed')
            }
        } catch {
            toast.error('Network error')
        } finally {
            setTogglingId(null)
        }
    }

    async function deleteSubscriber(sub: Subscriber) {
        if (!confirm(`Remove ${sub.email} permanently?`)) return
        setDeletingId(sub.id)
        try {
            const res = await fetch(`/api/newsletter/subscribers?id=${sub.id}`, { method: 'DELETE' })
            if (res.ok) {
                setSubscribers(prev => prev.filter(s => s.id !== sub.id))
                setStats(prev => ({
                    total: prev.total - 1,
                    active: prev.active - (sub.isActive ? 1 : 0),
                }))
                toast.success('Subscriber removed')
            } else {
                toast.error('Delete failed')
            }
        } catch {
            toast.error('Network error')
        } finally {
            setDeletingId(null)
        }
    }

    function exportCSV() {
        const rows = [
            ['Email', 'Status', 'Subscribed Date'],
            ...filtered.map(s => [s.email, s.isActive ? 'Active' : 'Inactive', formatDate(s.createdAt)]),
        ]
        const csv = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        toast.success('CSV downloaded')
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#121212] italic">Email Subscribers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage newsletter subscriptions from the website</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportCSV} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                    <button onClick={load} disabled={loading} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-blue-600">Total Subscribers</p>
                        <Users size={18} className="text-blue-400" />
                    </div>
                    <p className="text-4xl font-black text-blue-900">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-green-600">Active</p>
                        <CheckCircle2 size={18} className="text-green-400" />
                    </div>
                    <p className="text-4xl font-black text-green-900">{stats.active}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-orange-600">Unsubscribed</p>
                        <X size={18} className="text-orange-400" />
                    </div>
                    <p className="text-4xl font-black text-orange-900">{stats.total - stats.active}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'active', 'inactive'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border',
                                    filter === f
                                        ? 'bg-[#E62329] text-white border-[#E62329]'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#E62329] hover:text-[#E62329]'
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-gray-300" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Mail size={40} className="mx-auto mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-sm">
                            {search ? 'No subscribers match your search' : 'No subscribers yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">#</th>
                                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Email</th>
                                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Subscribed</th>
                                    <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((sub, i) => (
                                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-xs text-gray-400 font-bold">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#E62329]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[10px] font-black text-[#E62329]">
                                                        {sub.email[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-[#121212]">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                'text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full',
                                                sub.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            )}>
                                                {sub.isActive ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                                            {formatDate(sub.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleActive(sub)}
                                                    disabled={togglingId === sub.id}
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-[#121212] transition-colors disabled:opacity-50"
                                                    title={sub.isActive ? 'Deactivate' : 'Reactivate'}
                                                >
                                                    {togglingId === sub.id
                                                        ? <Loader2 size={14} className="animate-spin" />
                                                        : sub.isActive
                                                        ? <ToggleRight size={16} className="text-green-500" />
                                                        : <ToggleLeft size={16} />
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => deleteSubscriber(sub)}
                                                    disabled={deletingId === sub.id}
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    title="Delete permanently"
                                                >
                                                    {deletingId === sub.id
                                                        ? <Loader2 size={14} className="animate-spin" />
                                                        : <Trash2 size={14} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Showing {filtered.length} of {stats.total} subscribers
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
