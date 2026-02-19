'use client'

import { useState, useEffect } from 'react'
import { QrCode, Plus, Download, Copy, Trash2, BarChart3, Link2, RefreshCw, CheckCircle2, Loader2, ExternalLink, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface QRItem {
    id: string
    code: string // base64 data URL
    url: string
    scans: number
    createdAt: any
    expiresAt: any | null
    metadata: { campaignName?: string; description?: string }
    analytics: {
        browsers: Record<string, number>
        devices: Record<string, number>
        locations: Record<string, number>
    }
}

export default function QrCodePage() {
    const [qrCodes, setQrCodes] = useState<QRItem[]>([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [selected, setSelected] = useState<QRItem | null>(null)

    // Form state
    const [url, setUrl] = useState('')
    const [campaign, setCampaign] = useState('')
    const [desc, setDesc] = useState('')
    const [size, setSize] = useState(300)
    const [showForm, setShowForm] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    async function loadQRCodes() {
        setLoading(true)
        try {
            const res = await fetch('/api/qr/list')
            if (res.ok) {
                const data = await res.json()
                setQrCodes(data.qrCodes || [])
            }
        } catch {
            // API might not have list endpoint yet — silently handle
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadQRCodes() }, [])

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault()
        if (!url) return
        setGenerating(true)
        try {
            const res = await fetch('/api/qr/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, campaignName: campaign, description: desc, size }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.success('QR code generated!')
                setQrCodes(prev => [data.data, ...prev])
                setUrl('')
                setCampaign('')
                setDesc('')
                setShowForm(false)
            } else {
                toast.error(data.error || 'Failed to generate QR code')
            }
        } catch {
            toast.error('Request failed')
        } finally {
            setGenerating(false)
        }
    }

    function copyImage(item: QRItem) {
        navigator.clipboard.writeText(item.url).then(() => {
            setCopied(item.id)
            toast.success('URL copied!')
            setTimeout(() => setCopied(null), 2000)
        })
    }

    function downloadQR(item: QRItem) {
        const a = document.createElement('a')
        a.href = item.code
        a.download = `qr-${item.metadata.campaignName || 'smart-motor'}-${item.id?.slice(0, 6)}.png`
        a.click()
    }

    const totalScans = qrCodes.reduce((s, q) => s + (q.scans || 0), 0)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#121212] italic">QR Code Generator</h1>
                    <p className="text-sm text-gray-500 mt-1">Generate trackable QR codes for campaigns and marketing</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 bg-[#E62329] hover:bg-[#c41e24] text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                >
                    <Plus size={14} />
                    New QR Code
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total QR Codes', value: qrCodes.length, icon: QrCode, color: 'blue' },
                    { label: 'Total Scans', value: totalScans, icon: BarChart3, color: 'green' },
                    { label: 'Active Codes', value: qrCodes.filter(q => !q.expiresAt || new Date(q.expiresAt?.seconds * 1000) > new Date()).length, icon: CheckCircle2, color: 'purple' },
                ].map(stat => {
                    const Icon = stat.icon
                    const colors: Record<string, string> = { blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900', green: 'from-green-50 to-green-100 border-green-200 text-green-900', purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900' }
                    return (
                        <div key={stat.label} className={cn('bg-gradient-to-br rounded-2xl p-6 border', colors[stat.color])}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold opacity-70">{stat.label}</p>
                                <Icon size={18} className="opacity-50" />
                            </div>
                            <p className="text-4xl font-black">{stat.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Generate Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black uppercase tracking-tighter">Generate New QR Code</h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleGenerate} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Target URL *</label>
                            <div className="relative">
                                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    required
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://smartmotor.ae/services/oil-change"
                                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Campaign Name</label>
                                <input
                                    type="text"
                                    value={campaign}
                                    onChange={e => setCampaign(e.target.value)}
                                    placeholder="Summer Promo 2026"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Size (px)</label>
                                <select
                                    value={size}
                                    onChange={e => setSize(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] outline-none bg-white"
                                >
                                    {[200, 300, 400, 500, 600].map(s => (
                                        <option key={s} value={s}>{s}×{s}px</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
                            <input
                                type="text"
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="Used in flyers at M9 workshop"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={generating || !url}
                                className="flex items-center gap-2 bg-[#121212] hover:bg-[#E62329] text-white rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {generating ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                                {generating ? 'Generating...' : 'Generate QR Code'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-gray-300 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* QR Codes Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">Your QR Codes</h2>
                    <button onClick={loadQRCodes} className="text-gray-400 hover:text-[#E62329] transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-gray-300" />
                    </div>
                ) : qrCodes.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <QrCode size={40} className="mx-auto mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-sm">No QR codes yet</p>
                        <p className="text-xs mt-1">Create your first QR code above</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {qrCodes.map(item => (
                            <div key={item.id} className="group border border-gray-100 rounded-2xl p-5 hover:border-[#E62329]/20 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    {item.code && (
                                        <div className="w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                                            <img src={item.code} alt="QR Code" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-[#121212] text-sm truncate">
                                            {item.metadata?.campaignName || 'QR Code'}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.url}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-black bg-[#E62329]/10 text-[#E62329] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {item.scans || 0} scans
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => downloadQR(item)}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#121212] transition-colors"
                                        title="Download PNG"
                                    >
                                        <Download size={12} /> Download
                                    </button>
                                    <span className="text-gray-200">|</span>
                                    <button
                                        onClick={() => copyImage(item)}
                                        className={cn('flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-colors', copied === item.id ? 'text-green-600' : 'text-gray-500 hover:text-[#121212]')}
                                        title="Copy URL"
                                    >
                                        {copied === item.id ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                        {copied === item.id ? 'Copied' : 'Copy URL'}
                                    </button>
                                    <span className="text-gray-200">|</span>
                                    <button
                                        onClick={() => setSelected(item)}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#E62329] transition-colors"
                                    >
                                        <Eye size={12} /> Analytics
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Analytics Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-1">{selected.metadata?.campaignName || 'QR Analytics'}</h2>
                        <p className="text-xs text-gray-400 mb-6 truncate">{selected.url}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#E62329]/5 rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-[#E62329]">{selected.scans || 0}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Scans</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                {selected.code && <img src={selected.code} alt="QR" className="w-16 h-16 mx-auto" />}
                            </div>
                        </div>

                        {Object.entries({ Browsers: selected.analytics?.browsers, Devices: selected.analytics?.devices }).map(([label, data]) => {
                            if (!data || !Object.keys(data).length) return null
                            const sorted = Object.entries(data).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 4)
                            const total = sorted.reduce((s, [, v]) => s + (v as number), 0)
                            return (
                                <div key={label} className="mb-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{label}</p>
                                    <div className="space-y-2">
                                        {sorted.map(([key, count]) => (
                                            <div key={key}>
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>{key}</span>
                                                    <span className="font-bold">{count as number}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className="bg-[#E62329] h-1.5 rounded-full" style={{ width: `${total > 0 ? ((count as number) / total) * 100 : 0}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        <button
                            onClick={() => downloadQR(selected)}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#E62329] text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all"
                        >
                            <Download size={14} /> Download QR PNG
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
