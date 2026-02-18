'use client'

import { useState, useEffect } from 'react'
import {
  Bell, Mail, Clock, CheckCircle2, AlertCircle, Play,
  Loader2, Info, Plus, X, Save,
  CalendarCheck, FileEdit, UserPlus, ShieldCheck, Megaphone
} from 'lucide-react'

const EVENT_TYPES = [
  { id: 'login', icon: ShieldCheck, label: 'Admin Login', description: 'When someone logs into the admin panel', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'booking_new', icon: CalendarCheck, label: 'New Booking', description: 'When a customer makes a booking', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'booking_cancelled', icon: CalendarCheck, label: 'Booking Cancelled', description: 'When a booking is cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'content_updated', icon: FileEdit, label: 'Content Updated', description: 'When blogs or pages are edited', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'user_registered', icon: UserPlus, label: 'New User Registered', description: 'When a new user creates an account', color: 'text-purple-600', bg: 'bg-purple-50' },
]

interface NotificationSettings {
  recipients: string[]
  enabledEvents: string[]
  dailyReportEnabled: boolean
  dailyReportTime: string
  dailyReportRecipients: string[]
}

const DEFAULT_SETTINGS: NotificationSettings = {
  recipients: [],
  enabledEvents: ['login', 'booking_new', 'booking_cancelled'],
  dailyReportEnabled: true,
  dailyReportTime: '08:00',
  dailyReportRecipients: [],
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
  const [newEmail, setNewEmail] = useState('')
  const [newReportEmail, setNewReportEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [runningCron, setRunningCron] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const saved = localStorage.getItem('sm-notification-settings')
    if (saved) {
      try { setSettings(JSON.parse(saved)) } catch {}
    }
  }, [])

  const saveSettings = async () => {
    setSaving(true)
    try {
      localStorage.setItem('sm-notification-settings', JSON.stringify(settings))
      showToast('Settings saved! ✓')
    } finally {
      setSaving(false)
    }
  }

  const addEmail = (type: 'recipients' | 'dailyReportRecipients') => {
    const email = type === 'recipients' ? newEmail.trim() : newReportEmail.trim()
    if (!email || !email.includes('@')) { showToast('Enter a valid email address', 'error'); return }
    const list = settings[type]
    if (list.includes(email)) { showToast('Email already added', 'error'); return }
    setSettings(s => ({ ...s, [type]: [...s[type], email] }))
    if (type === 'recipients') setNewEmail('')
    else setNewReportEmail('')
  }

  const removeEmail = (type: 'recipients' | 'dailyReportRecipients', email: string) => {
    setSettings(s => ({ ...s, [type]: s[type].filter(e => e !== email) }))
  }

  const toggleEvent = (eventId: string) => {
    setSettings(s => ({
      ...s,
      enabledEvents: s.enabledEvents.includes(eventId)
        ? s.enabledEvents.filter(e => e !== eventId)
        : [...s.enabledEvents, eventId]
    }))
  }

  const testNotification = async (eventId: string) => {
    setTesting(eventId)
    try {
      const event = EVENT_TYPES.find(e => e.id === eventId)
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventId,
          data: { test_mode: 'true', triggered_by: 'Admin Settings Page', time: new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }) },
          subject: `🔔 Test: ${event?.label || eventId}`,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Test sent to ${data.recipients?.join(', ') || 'recipients'}`)
      } else {
        showToast(data.error || 'Failed to send test', 'error')
      }
    } catch {
      showToast('Failed to send test notification', 'error')
    } finally {
      setTesting(null)
    }
  }

  const runDailyReportNow = async () => {
    setRunningCron(true)
    try {
      const res = await fetch('/api/cron/daily-report', {
        headers: { 'Authorization': 'Bearer smartmotor-cron-secret' }
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Daily report sent! Bookings: ${data.stats?.bookings?.today || 0} today, ${data.stats?.subscribers || 0} subscribers`)
      } else {
        showToast(data.error || 'Report failed', 'error')
      }
    } catch {
      showToast('Failed to run daily report', 'error')
    } finally {
      setRunningCron(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E62329]/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#E62329]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-sm text-gray-500">Configure admin alerts and daily report recipients</p>
          </div>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-[#E62329] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c8181e] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      {/* Env Var Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Important:</strong> Set <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">NOTIFICATION_EMAILS</code> in Vercel as comma-separated emails.
          Example: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">dev@smartmotor.ae,boss1@smartmotor.ae,boss2@smartmotor.ae</code>
        </div>
      </div>

      {/* Alert Recipients */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#E62329]" /> Alert Recipients
        </h2>
        <p className="text-xs text-gray-500 mb-5">These emails receive real-time event alerts</p>
        <div className="space-y-2 mb-4">
          {settings.recipients.length === 0 && (
            <p className="text-sm text-gray-400 italic py-2">Using NOTIFICATION_EMAILS env var. Add emails below to override.</p>
          )}
          {settings.recipients.map(email => (
            <div key={email} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-sm font-medium text-gray-700">{email}</span>
              <button onClick={() => removeEmail('recipients', email)} className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEmail('recipients')}
            placeholder="admin@smartmotor.ae"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]" />
          <button onClick={() => addEmail('recipients')}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Event Toggles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#E62329]" /> Event Alerts
        </h2>
        <p className="text-xs text-gray-500 mb-5">Toggle which events trigger an immediate email alert</p>
        <div className="space-y-3">
          {EVENT_TYPES.map(event => {
            const Icon = event.icon
            const enabled = settings.enabledEvents.includes(event.id)
            return (
              <div key={event.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                enabled ? 'border-[#E62329]/20 bg-[#E62329]/5' : 'border-gray-100 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.bg}`}>
                    <Icon className={`w-4 h-4 ${event.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{event.label}</p>
                    <p className="text-xs text-gray-400">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => testNotification(event.id)} disabled={testing === event.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 bg-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    {testing === event.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    Test
                  </button>
                  <button onClick={() => toggleEvent(event.id)}
                    className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#E62329]' : 'bg-gray-300'}`}>
                    <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily Report */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E62329]" /> Daily Report
          </h2>
          <button onClick={() => setSettings(s => ({ ...s, dailyReportEnabled: !s.dailyReportEnabled }))}
            className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${settings.dailyReportEnabled ? 'bg-[#E62329]' : 'bg-gray-300'}`}>
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ${settings.dailyReportEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-5">Daily summary: bookings, subscribers, top links, activity</p>
        {settings.dailyReportEnabled && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Report Time (UAE)</label>
              <input type="time" value={settings.dailyReportTime}
                onChange={e => setSettings(s => ({ ...s, dailyReportTime: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Report Recipients</label>
              <div className="space-y-2 mb-3">
                {settings.dailyReportRecipients.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Using NOTIFICATION_EMAILS env var</p>
                )}
                {settings.dailyReportRecipients.map(email => (
                  <div key={email} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-700">{email}</span>
                    <button onClick={() => removeEmail('dailyReportRecipients', email)} className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="email" value={newReportEmail} onChange={e => setNewReportEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addEmail('dailyReportRecipients')}
                  placeholder="boss@smartmotor.ae"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]" />
                <button onClick={() => addEmail('dailyReportRecipients')}
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">
                Vercel cron runs at <code className="bg-gray-100 px-1.5 py-0.5 rounded">0 4 * * *</code> UTC (8:00 AM UAE daily).
                Click below to send a test report now.
              </p>
              <button onClick={runDailyReportNow} disabled={runningCron}
                className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
                {runningCron ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {runningCron ? 'Sending...' : 'Send Daily Report Now'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#E62329]" /> Setup Checklist
        </h2>
        <ol className="space-y-3 text-sm text-gray-300">
          {[
            <>Add <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-green-400">NOTIFICATION_EMAILS=dev@smartmotor.ae,boss1@example.com,boss2@example.com</code> to Vercel env vars</>,
            <>Add <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-green-400">CRON_SECRET=your-secret</code> to Vercel (default: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-green-400">smartmotor-cron-secret</code>)</>,
            <>Vercel cron is configured in <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-green-400">vercel.json</code> — runs at 8:00 AM UAE automatically</>,
            <>Test each event alert using the <strong className="text-white">Test</strong> buttons above</>,
            <>Login notifications: hook <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-green-400">POST /api/notifications/send</code> into auth flow</>,
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 bg-[#E62329] text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
