'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Link2, Plus, Copy, ExternalLink, Trash2, ToggleLeft, ToggleRight,
  BarChart3, Globe, Smartphone, MousePointerClick, Search, RefreshCw,
  X, ChevronDown, ChevronUp, TrendingUp, Calendar, Hash, Info,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'

interface ShortURL {
  id: string
  shortCode: string
  originalUrl: string
  customUrl: string
  clicks: number
  active: boolean
  createdAt: string
  expiresAt: string | null
  metadata: {
    campaignName?: string
    description?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
  analytics: {
    browsers: Record<string, number>
    devices: Record<string, number>
    locations: Record<string, number>
    referrers: Record<string, number>
  }
}

function TopList({ data, label }: { data: Record<string, number>; label: string }) {
  const sorted = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 5)
  const total = sorted.reduce((s, [, v]) => s + v, 0)
  if (!sorted.length) return <p className="text-sm text-gray-400 italic">No data yet</p>
  return (
    <div className="space-y-2">
      {sorted.map(([key, count]) => (
        <div key={key}>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span className="truncate max-w-[160px]">{key}</span>
            <span className="font-semibold text-gray-800">{count}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#E62329] h-1.5 rounded-full transition-all"
              style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsDrawer({ url, onClose }: { url: ShortURL; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Link Analytics</h2>
            <p className="text-sm text-gray-500 font-mono truncate max-w-xs">{url.customUrl}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#E62329]/5 border border-[#E62329]/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-[#E62329]">{url.clicks.toLocaleString()}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Total Clicks</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-800 truncate">{url.metadata.utm_source || '—'}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">UTM Source</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-800 truncate">{url.metadata.campaignName || '—'}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Campaign</p>
            </div>
          </div>

          {/* URL info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-24 shrink-0 pt-0.5">Short URL</span>
              <a href={url.customUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#E62329] hover:underline font-mono break-all flex items-center gap-1">
                {url.customUrl} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-24 shrink-0 pt-0.5">Original</span>
              <a href={url.originalUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all">{url.originalUrl}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-24">Created</span>
              <span className="text-sm text-gray-700">{new Date(url.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Analytics breakdown */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E62329]" /> Browsers
              </p>
              <TopList data={url.analytics.browsers} label="browsers" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#E62329]" /> Devices
              </p>
              <TopList data={url.analytics.devices} label="devices" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E62329]" /> Locations
              </p>
              <TopList data={url.analytics.locations} label="locations" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#E62329]" /> Referrers
              </p>
              <TopList data={url.analytics.referrers} label="referrers" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CreateFormData {
  url: string
  customCode: string
  campaignName: string
  description: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  expiresIn: string
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (url: ShortURL) => void }) {
  const [form, setForm] = useState<CreateFormData>({
    url: '', customCode: '', campaignName: '', description: '',
    utmSource: '', utmMedium: '', utmCampaign: '', expiresIn: '365'
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  const checkCode = useCallback(async (code: string) => {
    if (!code) { setCodeStatus('idle'); return }
    setCodeStatus('checking')
    try {
      const res = await fetch(`/api/urls/shorten?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      setCodeStatus(data.available ? 'available' : 'taken')
    } catch {
      setCodeStatus('idle')
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => checkCode(form.customCode), 600)
    return () => clearTimeout(timer)
  }, [form.customCode, checkCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.url) return
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = {
        url: form.url,
        expiresIn: parseInt(form.expiresIn) || 365,
      }
      if (form.customCode) body.customCode = form.customCode
      if (form.campaignName) body.campaignName = form.campaignName
      if (form.description) body.description = form.description
      if (form.utmSource || form.utmMedium || form.utmCampaign) {
        body.utm = {
          source: form.utmSource || undefined,
          medium: form.utmMedium || undefined,
          campaign: form.utmCampaign || undefined,
        }
      }

      const res = await fetch('/api/urls/shorten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create')
      onCreated(data.data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Create Short Link</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Destination URL */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Destination URL *</label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://smartmotor.ae/services/dyno-tuning"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329]"
              required
            />
          </div>

          {/* Custom Code */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Custom Code (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">/s/</span>
              <input
                type="text"
                value={form.customCode}
                onChange={e => setForm(f => ({ ...f, customCode: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') }))}
                placeholder="my-campaign-link"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {codeStatus === 'checking' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                {codeStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {codeStatus === 'taken' && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
            {codeStatus === 'taken' && <p className="text-xs text-red-500 mt-1">Code already taken — choose a different one</p>}
            {codeStatus === 'available' && <p className="text-xs text-green-600 mt-1">Available ✓</p>}
            {!form.customCode && <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate</p>}
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Campaign Name</label>
            <input
              type="text"
              value={form.campaignName}
              onChange={e => setForm(f => ({ ...f, campaignName: e.target.value }))}
              placeholder="e.g. Ramadan Sale 2026, Instagram Bio"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329]"
            />
          </div>

          {/* Advanced Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            UTM Parameters & Advanced
          </button>

          {showAdvanced && (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">UTM Source</label>
                  <input type="text" value={form.utmSource} onChange={e => setForm(f => ({ ...f, utmSource: e.target.value }))}
                    placeholder="instagram" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E62329]/30 focus:border-[#E62329] bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">UTM Medium</label>
                  <input type="text" value={form.utmMedium} onChange={e => setForm(f => ({ ...f, utmMedium: e.target.value }))}
                    placeholder="social" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E62329]/30 focus:border-[#E62329] bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">UTM Campaign</label>
                  <input type="text" value={form.utmCampaign} onChange={e => setForm(f => ({ ...f, utmCampaign: e.target.value }))}
                    placeholder="ramadan26" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E62329]/30 focus:border-[#E62329] bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Internal notes about this link..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E62329]/30 focus:border-[#E62329] bg-white resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Expires In (days)</label>
                <select value={form.expiresIn} onChange={e => setForm(f => ({ ...f, expiresIn: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E62329]/30 focus:border-[#E62329] bg-white">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="3650">10 years (permanent)</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || codeStatus === 'taken'}
              className="flex-1 bg-[#E62329] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#c8181e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UrlShortenerPage() {
  const [urls, setUrls] = useState<ShortURL[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<ShortURL | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUrls = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/urls/list')
      const data = await res.json()
      if (data.success) setUrls(data.urls)
    } catch {
      showToast('Failed to load URLs', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUrls() }, [fetchUrls])

  const copyToClipboard = (url: ShortURL) => {
    navigator.clipboard.writeText(url.customUrl)
    setCopiedId(url.id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('Copied to clipboard!')
  }

  const toggleActive = async (url: ShortURL) => {
    try {
      const res = await fetch('/api/urls/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: url.id, active: !url.active })
      })
      if (res.ok) {
        setUrls(prev => prev.map(u => u.id === url.id ? { ...u, active: !u.active } : u))
        showToast(url.active ? 'Link disabled' : 'Link enabled')
      }
    } catch {
      showToast('Failed to update', 'error')
    }
  }

  const deleteUrl = async (url: ShortURL) => {
    if (!confirm(`Delete /${url.shortCode}? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/urls/manage?id=${url.id}`, { method: 'DELETE' })
      if (res.ok) {
        setUrls(prev => prev.filter(u => u.id !== url.id))
        showToast('Link deleted')
      }
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const filtered = urls.filter(u =>
    !search ||
    u.shortCode.toLowerCase().includes(search.toLowerCase()) ||
    u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
    (u.metadata.campaignName || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalClicks = urls.reduce((s, u) => s + u.clicks, 0)
  const activeCount = urls.filter(u => u.active).length
  const topLink = urls.reduce((best, u) => (!best || u.clicks > best.clicks) ? u : best, null as ShortURL | null)

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(newUrl) => {
            setUrls(prev => [newUrl as unknown as ShortURL, ...prev])
            showToast('Link created successfully!')
          }}
        />
      )}
      {selectedUrl && <AnalyticsDrawer url={selectedUrl} onClose={() => setSelectedUrl(null)} />}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#E62329]/10 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#E62329]" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">URL Shortener</h1>
          </div>
          <p className="text-sm text-gray-500 ml-13 pl-1">Track clicks on every link — social, CTA, newsletter, ads</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#E62329] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c8181e] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Link
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Total Links</p>
          <p className="text-3xl font-black text-gray-900">{urls.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Total Clicks</p>
          <p className="text-3xl font-black text-[#E62329]">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Active Links</p>
          <p className="text-3xl font-black text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Top Performer</p>
          <p className="text-lg font-black text-gray-900 truncate">{topLink ? `/${topLink.shortCode}` : '—'}</p>
          {topLink && <p className="text-xs text-gray-400 mt-0.5">{topLink.clicks} clicks</p>}
        </div>
      </div>

      {/* Search & Refresh */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code, URL, or campaign..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]"
          />
        </div>
        <button
          onClick={fetchUrls}
          disabled={loading}
          className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* URL Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#E62329] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Link2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">{search ? 'No links match your search' : 'No links yet'}</p>
            {!search && (
              <button onClick={() => setShowCreate(true)}
                className="mt-4 text-sm text-[#E62329] font-semibold hover:underline">
                Create your first link →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-6 py-3">Short Link</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Destination</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Campaign</th>
                  <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Clicks</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Created</th>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(url => (
                  <tr key={url.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Short code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#E62329]/10 rounded-lg flex items-center justify-center shrink-0">
                          <Link2 className="w-3.5 h-3.5 text-[#E62329]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 font-mono">/{url.shortCode}</p>
                          <p className="text-xs text-gray-400">{new URL(url.customUrl).host}</p>
                        </div>
                      </div>
                    </td>
                    {/* Destination */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600 max-w-[220px] truncate" title={url.originalUrl}>
                        {url.originalUrl}
                      </p>
                    </td>
                    {/* Campaign */}
                    <td className="px-4 py-4">
                      {url.metadata.campaignName ? (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {url.metadata.campaignName}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    {/* Clicks */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-[#E62329]" />
                        <span className="text-sm font-bold text-gray-900">{url.clicks.toLocaleString()}</span>
                      </div>
                    </td>
                    {/* Created */}
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-400">
                        {new Date(url.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => toggleActive(url)} title={url.active ? 'Click to disable' : 'Click to enable'}>
                        {url.active ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />Off
                          </span>
                        )}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => copyToClipboard(url)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
                          title="Copy URL"
                        >
                          {copiedId === url.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={url.customUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setSelectedUrl(url)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                          title="View analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUrl(url)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                          title="Delete link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Track every click.</strong> Use short links for all social media bios, newsletter CTAs, WhatsApp campaigns, and ad landing pages.
          Click <BarChart3 className="w-3.5 h-3.5 inline mx-0.5" /> to see browser, device, location and referrer breakdowns for any link.
        </div>
      </div>
    </div>
  )
}
