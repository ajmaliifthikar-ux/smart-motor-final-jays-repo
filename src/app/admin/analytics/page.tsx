'use client'

import { useEffect, useState } from 'react'
import {
  Users, Eye, Clock, TrendingUp, TrendingDown, Smartphone, Monitor, Tablet,
  Globe, FileText, RefreshCw, BarChart3, MousePointerClick, ArrowUpRight, Info
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyticsData {
  source: 'ga4' | 'mock'
  overview: {
    sessions: number
    activeUsers: number
    newUsers: number
    bounceRate: number
    avgSessionDuration: number
    pageViews: number
    conversions: number
  }
  channels: Array<{ channel: string; sessions: number; users: number }>
  pages: Array<{ path: string; views: number; users: number; avgDuration: number }>
  devices: Array<{ device: string; sessions: number; users: number }>
  countries: Array<{ country: string; sessions: number; users: number }>
  daily: Array<{ date: string; sessions: number; users: number }>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function KPICard({
  label, value, sub, icon: Icon, color, trend
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  color: string
  trend?: { value: string; up: boolean }
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${trend.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {trend.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-[#121212] leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
    </div>
  )
}

function MiniSparkline({ data, color = '#E62329' }: { data: number[]; color?: string }) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 280
  const h = 60
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Fill area */}
      <polyline
        fill={`${color}15`}
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  )
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 font-medium w-32 truncate flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-black text-[#121212] w-12 text-right">{fmtNum(value)}</span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/google/analytics', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch (e: any) {
      setError(e.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const ov = data?.overview

  // Device totals
  const totalDeviceSessions = (data?.devices ?? []).reduce((a, d) => a + d.sessions, 0)

  // Daily sparkline arrays
  const dailySessions = (data?.daily ?? []).map(d => d.sessions)
  const dailyUsers = (data?.daily ?? []).map(d => d.users)

  const channelMax = Math.max(...(data?.channels ?? []).map(c => c.sessions), 1)
  const pageMax = Math.max(...(data?.pages ?? []).map(p => p.views), 1)
  const countryMax = Math.max(...(data?.countries ?? []).map(c => c.sessions), 1)

  const deviceIcons: Record<string, React.ElementType> = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#121212]">Website Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Google Analytics 4 — Last 30 days
            {lastUpdated && (
              <span className="ml-3 text-gray-400">· Synced {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data?.source === 'mock' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
              <Info size={12} className="text-amber-600" />
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Sample Data</span>
            </div>
          )}
          {data?.source === 'ga4' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Live GA4</span>
            </div>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#E62329] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 h-32 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-7 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-600 mb-3">{error}</p>
          <button onClick={fetchData} className="text-xs font-black text-[#E62329] uppercase tracking-widest hover:underline">
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Sessions"
              value={fmtNum(ov!.sessions)}
              sub="last 30 days"
              icon={BarChart3}
              color="bg-[#121212]"
              trend={{ value: '+12%', up: true }}
            />
            <KPICard
              label="Active Users"
              value={fmtNum(ov!.activeUsers)}
              sub={`${fmtNum(ov!.newUsers)} new`}
              icon={Users}
              color="bg-[#E62329]"
              trend={{ value: '+8%', up: true }}
            />
            <KPICard
              label="Page Views"
              value={fmtNum(ov!.pageViews)}
              sub={`${(ov!.pageViews / Math.max(ov!.sessions, 1)).toFixed(1)} per session`}
              icon={Eye}
              color="bg-blue-500"
              trend={{ value: '+15%', up: true }}
            />
            <KPICard
              label="Avg. Session"
              value={fmtDuration(ov!.avgSessionDuration)}
              sub={`${(ov!.bounceRate * 100).toFixed(0)}% bounce rate`}
              icon={Clock}
              color="bg-violet-500"
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Conversions"
              value={ov!.conversions.toLocaleString()}
              sub={`${ov!.sessions > 0 ? ((ov!.conversions / ov!.sessions) * 100).toFixed(1) : 0}% conv. rate`}
              icon={MousePointerClick}
              color="bg-emerald-500"
              trend={{ value: '+5%', up: true }}
            />
            <KPICard
              label="New Users"
              value={fmtNum(ov!.newUsers)}
              sub={`${ov!.activeUsers > 0 ? Math.round((ov!.newUsers / ov!.activeUsers) * 100) : 0}% of users`}
              icon={ArrowUpRight}
              color="bg-orange-500"
            />
            <KPICard
              label="Bounce Rate"
              value={`${(ov!.bounceRate * 100).toFixed(1)}%`}
              sub="of sessions bounced"
              icon={TrendingDown}
              color="bg-amber-500"
            />
            <KPICard
              label="Return Rate"
              value={`${ov!.activeUsers > 0 ? Math.max(0, Math.round(((ov!.activeUsers - ov!.newUsers) / ov!.activeUsers) * 100)) : 0}%`}
              sub="returning visitors"
              icon={TrendingUp}
              color="bg-cyan-500"
            />
          </div>

          {/* Daily Traffic Chart + Channels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Trend */}
            <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-black text-[#121212]">Daily Traffic</h2>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Sessions & Users — 30 days</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded bg-[#121212] inline-block" />
                    Sessions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded bg-[#E62329] inline-block" />
                    Users
                  </span>
                </div>
              </div>
              {/* Bar chart */}
              <div className="h-48 flex items-end gap-1 px-2">
                {data.daily.map((d, i) => {
                  const maxSessions = Math.max(...data.daily.map(x => x.sessions), 1)
                  const sessionH = (d.sessions / maxSessions) * 100
                  const userH = (d.users / maxSessions) * 100
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#121212] text-white text-[8px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {d.date.slice(5)}<br />{d.sessions}s / {d.users}u
                      </div>
                      <div className="w-full flex items-end gap-0.5 h-40">
                        <div
                          className="flex-1 bg-[#121212] rounded-t transition-all duration-500 group-hover:bg-[#E62329]"
                          style={{ height: `${sessionH}%` }}
                        />
                        <div
                          className="flex-1 bg-[#E62329]/40 rounded-t transition-all duration-500 group-hover:bg-[#E62329]/70"
                          style={{ height: `${userH}%` }}
                        />
                      </div>
                      {i % 5 === 0 && (
                        <span className="text-[7px] text-gray-300 font-bold">{d.date.slice(8)}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Traffic Channels */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-black text-[#121212] mb-1">Traffic Channels</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-5">Sessions by source</p>
              <div className="space-y-4">
                {data.channels.map((c, i) => (
                  <BarRow
                    key={c.channel}
                    label={c.channel}
                    value={c.sessions}
                    max={channelMax}
                    color={['#121212', '#E62329', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#14B8A6'][i % 8]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Devices + Countries + Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Devices */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-black text-[#121212] mb-1">Devices</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-5">Session split</p>
              <div className="space-y-4">
                {data.devices.map((d) => {
                  const DeviceIcon = deviceIcons[d.device.toLowerCase()] ?? Monitor
                  const pct = totalDeviceSessions > 0 ? Math.round((d.sessions / totalDeviceSessions) * 100) : 0
                  const colors: Record<string, string> = { mobile: '#E62329', desktop: '#121212', tablet: '#8B5CF6' }
                  const color = colors[d.device.toLowerCase()] ?? '#6B7280'
                  return (
                    <div key={d.device} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DeviceIcon size={14} style={{ color }} />
                          <span className="text-xs font-bold text-[#121212] capitalize">{d.device}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">{fmtNum(d.sessions)} sessions · {fmtNum(d.users)} users</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Countries */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-black text-[#121212] mb-1">Top Countries</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-5">By sessions</p>
              <div className="space-y-4">
                {data.countries.map((c, i) => (
                  <BarRow
                    key={c.country}
                    label={c.country}
                    value={c.sessions}
                    max={countryMax}
                    color={i === 0 ? '#E62329' : '#121212'}
                  />
                ))}
              </div>
            </div>

            {/* Sparkline summary */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
              <h2 className="text-base font-black text-[#121212] mb-1">Trend Overview</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-4">Sessions vs Users sparklines</p>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sessions</p>
                  <MiniSparkline data={dailySessions} color="#121212" />
                  <div className="flex justify-between text-[9px] text-gray-400 font-medium mt-1">
                    <span>30d ago</span>
                    <span className="font-black text-[#121212]">{fmtNum(ov!.sessions)} total</span>
                    <span>today</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Users</p>
                  <MiniSparkline data={dailyUsers} color="#E62329" />
                  <div className="flex justify-between text-[9px] text-gray-400 font-medium mt-1">
                    <span>30d ago</span>
                    <span className="font-black text-[#E62329]">{fmtNum(ov!.activeUsers)} total</span>
                    <span>today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <FileText size={18} className="text-[#E62329]" />
              <div>
                <h2 className="text-base font-black text-[#121212]">Top Pages</h2>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">By page views — 30 days</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                    <th className="text-left px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Page</th>
                    <th className="text-right px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Views</th>
                    <th className="text-right px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Users</th>
                    <th className="text-right px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Time</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pages.map((p, i) => (
                    <tr key={p.path} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-black text-gray-300">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="text-gray-300 flex-shrink-0" />
                          <span className="text-xs font-medium text-[#121212]">{p.path}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-black text-[#121212]">{fmtNum(p.views)}</td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-gray-500">{fmtNum(p.users)}</td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-gray-500">{fmtDuration(p.avgDuration)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                            <div
                              className="h-full bg-[#E62329] rounded-full transition-all duration-1000"
                              style={{ width: `${(p.views / pageMax) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-8 text-right">
                            {Math.round((p.views / pageMax) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GA4 Setup Prompt if showing mock data */}
          {data.source === 'mock' && (
            <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/50 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Info size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-900 mb-2">Connect Real GA4 Data</h3>
                  <p className="text-xs text-amber-700 leading-relaxed mb-3">
                    You're viewing sample data. To see real analytics, add your GA4 Property ID to your environment variables.
                  </p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Go to <strong>Google Analytics → Admin → Property Settings</strong></li>
                    <li>Copy the numeric <strong>Property ID</strong> (e.g. <code className="bg-amber-100 px-1 rounded font-mono">123456789</code>)</li>
                    <li>Add <code className="bg-amber-100 px-1 rounded font-mono">GA4_PROPERTY_ID=123456789</code> to your <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> and Vercel</li>
                    <li>Make sure the service account (<code className="bg-amber-100 px-1 rounded font-mono">FIREBASE_CLIENT_EMAIL</code>) has <strong>Viewer</strong> access in GA4</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
