'use client'

import { useState } from 'react'
import {
  Building2, Clock, Phone, Mail, MapPin, Globe, Instagram,
  Facebook, Twitter, Youtube, Settings, Bell, Shield, Eye,
  EyeOff, Save, CheckCircle2, AlertCircle, User, Lock,
  Smartphone, Wrench, DollarSign, Palette, Languages,
  ChevronRight, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── types ────────────────────────────────────────────────────────────────────
type TabId = 'business' | 'hours' | 'contact' | 'services' | 'notifications' | 'security'

interface Tab {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const TABS: Tab[] = [
  { id: 'business',      label: 'Business Profile',   icon: Building2,     description: 'Brand identity and company info' },
  { id: 'hours',         label: 'Operating Hours',    icon: Clock,         description: 'Daily schedule & holiday settings' },
  { id: 'contact',       label: 'Contact & Social',   icon: Phone,         description: 'Contact details and social links' },
  { id: 'services',      label: 'Service Config',     icon: Wrench,        description: 'Pricing, VAT, and service tiers' },
  { id: 'notifications', label: 'Notifications',      icon: Bell,          description: 'Alerts and email preferences' },
  { id: 'security',      label: 'Security',           icon: Shield,        description: 'Password, 2FA, and access control' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// ─── shared input component ───────────────────────────────────────────────────
function Field({
  label, hint, children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#121212] uppercase tracking-widest">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  )
}

function Input({
  value, onChange, placeholder, type = 'text', prefix, className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  prefix?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E62329]/20 focus-within:border-[#E62329]/50 transition-all', className)}>
      {prefix && (
        <span className="px-3 text-xs text-gray-400 font-medium border-r border-gray-200 bg-white h-full flex items-center">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 text-sm text-[#121212] bg-transparent outline-none placeholder-gray-300"
      />
    </div>
  )
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50 transition-all resize-none placeholder-gray-300"
    />
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          'relative w-10 h-5.5 rounded-full transition-all duration-200',
          checked ? 'bg-[#E62329]' : 'bg-gray-200'
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-200',
            checked ? 'left-[22px]' : 'left-0.5'
          )}
          style={{ width: 18, height: 18, top: 3, position: 'absolute', transition: 'left 200ms' }}
        />
      </div>
      {label && <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>}
    </label>
  )
}

// ─── section card wrapper ─────────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <h3 className="text-sm font-black text-[#121212] uppercase tracking-wider">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

// ─── save toast ───────────────────────────────────────────────────────────────
function SaveToast({ show, error }: { show: boolean; error?: string }) {
  if (!show) return null
  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all',
      error ? 'bg-red-500' : 'bg-[#121212]'
    )}>
      {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-green-400" />}
      {error || 'Settings saved successfully'}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('business')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // ── Business Profile ──────────────────────────────────────────────────────
  const [bizName, setBizName]             = useState('Smart Motor')
  const [bizTagline, setBizTagline]       = useState('UAE\'s Premier Automotive Service Hub')
  const [bizDesc, setBizDesc]             = useState('Smart Motor is a leading multi-brand automotive service center in the UAE, offering expert maintenance, repair, and performance upgrades for all vehicle makes.')
  const [bizRegistration, setBizRegistration] = useState('CN-1234567')
  const [bizVatNo, setBizVatNo]           = useState('100123456700003')
  const [bizCurrency, setBizCurrency]     = useState('AED')
  const [bizLanguage, setBizLanguage]     = useState('en')
  const [bizTimezone, setBizTimezone]     = useState('Asia/Dubai')

  // ── Operating Hours ───────────────────────────────────────────────────────
  const [hours, setHours] = useState<Record<string, { open: boolean; from: string; to: string }>>(
    Object.fromEntries(DAYS.map(d => [
      d,
      { open: d !== 'Sunday', from: '08:00', to: '20:00' },
    ]))
  )

  // ── Contact & Social ──────────────────────────────────────────────────────
  const [phone, setPhone]       = useState('80076278')
  const [whatsapp, setWhatsapp] = useState('+971 50 123 4567')
  const [email, setEmail]       = useState('info@smartmotor.ae')
  const [address, setAddress]   = useState('Sheikh Zayed Road, Dubai, UAE')
  const [website, setWebsite]   = useState('https://smartmotorlatest.vercel.app')
  const [instagram, setInstagram] = useState('@smartmotoruae')
  const [facebook, setFacebook]   = useState('smartmotoruae')
  const [twitter, setTwitter]     = useState('@smartmotoruae')
  const [youtube, setYoutube]     = useState('SmartMotorUAE')
  const [gmapsUrl, setGmapsUrl]   = useState('https://maps.google.com/?q=Smart+Motor+Dubai')

  // ── Service Config ────────────────────────────────────────────────────────
  const [vatRate, setVatRate]               = useState('5')
  const [laborRate, setLaborRate]           = useState('250')
  const [minBookingHours, setMinBookingHours] = useState('2')
  const [bookingSlot, setBookingSlot]       = useState('60')
  const [vatEnabled, setVatEnabled]         = useState(true)
  const [onlineBooking, setOnlineBooking]   = useState(true)
  const [depositRequired, setDepositRequired] = useState(false)
  const [depositPercent, setDepositPercent] = useState('20')
  const [maxAdvanceDays, setMaxAdvanceDays] = useState('30')

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifEmail, setNotifEmail]           = useState(true)
  const [notifSms, setNotifSms]               = useState(true)
  const [notifWhatsapp, setNotifWhatsapp]     = useState(true)
  const [notifNewBooking, setNotifNewBooking] = useState(true)
  const [notifCancelled, setNotifCancelled]   = useState(true)
  const [notifReminder, setNotifReminder]     = useState(true)
  const [notifReview, setNotifReview]         = useState(false)
  const [notifMarketing, setNotifMarketing]   = useState(false)
  const [notifEmail2, setNotifEmail2]         = useState('admin@smartmotor.ae')
  const [reminderHours, setReminderHours]     = useState('24')

  // ── Security ──────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [confirmPw, setConfirmPw]   = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [twoFactor, setTwoFactor]   = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('480')
  const [loginNotif, setLoginNotif] = useState(true)
  const [pwError, setPwError]       = useState('')

  const handleSave = async () => {
    // Validation
    if (activeTab === 'security' && newPw) {
      if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
      if (newPw.length < 8)    { setPwError('Password must be at least 8 characters'); return }
      setPwError('')
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#121212] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#E62329]" />
            General Settings
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Configure your business profile, hours, services, and preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md',
            saving
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#E62329] text-white hover:bg-[#c91e23] shadow-red-200 hover:shadow-red-300'
          )}
        >
          {saving ? (
            <><span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />Saving…</>
          ) : (
            <><Save size={15} />Save Changes</>
          )}
        </button>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0',
                active
                  ? 'bg-[#121212] text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────── */}

      {/* BUSINESS PROFILE */}
      {activeTab === 'business' && (
        <div className="space-y-4">
          <Section title="Brand Identity" description="How your business appears to customers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Business Name">
                <Input value={bizName} onChange={setBizName} placeholder="Smart Motor" />
              </Field>
              <Field label="Tagline">
                <Input value={bizTagline} onChange={setBizTagline} placeholder="Your business tagline" />
              </Field>
            </div>
            <Field label="Business Description" hint="Used in SEO metadata and email footers.">
              <Textarea value={bizDesc} onChange={setBizDesc} rows={4} placeholder="Describe your business…" />
            </Field>
          </Section>

          <Section title="Legal & Compliance" description="Registration and tax details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Trade License / Registration No.">
                <Input value={bizRegistration} onChange={setBizRegistration} placeholder="CN-XXXXXXX" />
              </Field>
              <Field label="VAT Registration Number">
                <Input value={bizVatNo} onChange={setBizVatNo} placeholder="100XXXXXXXXXXX3" />
              </Field>
            </div>
          </Section>

          <Section title="Regional Settings" description="Locale, currency and timezone">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Currency">
                <select
                  value={bizCurrency}
                  onChange={e => setBizCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                >
                  <option value="AED">AED — UAE Dirham</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </Field>
              <Field label="Language">
                <select
                  value={bizLanguage}
                  onChange={e => setBizLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic (عربي)</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select
                  value={bizTimezone}
                  onChange={e => setBizTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                >
                  <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                  <option value="Europe/London">Europe/London (UTC+0/+1)</option>
                </select>
              </Field>
            </div>
          </Section>
        </div>
      )}

      {/* OPERATING HOURS */}
      {activeTab === 'hours' && (
        <div className="space-y-4">
          <Section title="Weekly Schedule" description="Set your regular opening hours for each day">
            <div className="space-y-3">
              {DAYS.map(day => {
                const h = hours[day]
                return (
                  <div key={day} className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="w-24 text-sm font-bold text-[#121212]">{day}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setHours(prev => ({ ...prev, [day]: { ...prev[day], open: !prev[day].open } }))}
                        className={cn(
                          'relative rounded-full cursor-pointer transition-all duration-200',
                          h.open ? 'bg-[#E62329]' : 'bg-gray-200'
                        )}
                        style={{ width: 36, height: 20 }}
                      >
                        <span
                          className="absolute bg-white rounded-full shadow-sm transition-all duration-200"
                          style={{
                            width: 16, height: 16, top: 2,
                            left: h.open ? 18 : 2,
                          }}
                        />
                      </div>
                      <span className={cn('text-xs font-semibold w-12', h.open ? 'text-[#E62329]' : 'text-gray-400')}>
                        {h.open ? 'Open' : 'Closed'}
                      </span>
                    </label>
                    {h.open && (
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="time"
                          value={h.from}
                          onChange={e => setHours(prev => ({ ...prev, [day]: { ...prev[day], from: e.target.value } }))}
                          className="text-sm text-[#121212] bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#E62329]/20"
                        />
                        <span className="text-xs text-gray-400 font-medium">to</span>
                        <input
                          type="time"
                          value={h.to}
                          onChange={e => setHours(prev => ({ ...prev, [day]: { ...prev[day], to: e.target.value } }))}
                          className="text-sm text-[#121212] bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#E62329]/20"
                        />
                      </div>
                    )}
                    {!h.open && (
                      <span className="ml-auto text-xs text-gray-300 italic">Closed all day</span>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section title="Quick Actions">
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Mon–Fri 8am–6pm', action: () => setHours(Object.fromEntries(DAYS.map(d => [d, { open: !['Saturday','Sunday'].includes(d), from: '08:00', to: '18:00' }]))) },
                { label: 'Mon–Sat 8am–8pm', action: () => setHours(Object.fromEntries(DAYS.map(d => [d, { open: d !== 'Sunday', from: '08:00', to: '20:00' }]))) },
                { label: 'All 7 Days 9am–9pm', action: () => setHours(Object.fromEntries(DAYS.map(d => [d, { open: true, from: '09:00', to: '21:00' }]))) },
              ].map(q => (
                <button
                  key={q.label}
                  onClick={q.action}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 hover:bg-[#E62329]/10 hover:text-[#E62329] transition-all border border-gray-200 hover:border-[#E62329]/30"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* CONTACT & SOCIAL */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <Section title="Contact Details" description="Primary contact information shown to customers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Toll-Free / Main Phone" hint="Shown in navbar and footer">
                <Input value={phone} onChange={setPhone} prefix="📞" placeholder="80076278" />
              </Field>
              <Field label="WhatsApp Number">
                <Input value={whatsapp} onChange={setWhatsapp} prefix="💬" placeholder="+971 50 XXX XXXX" />
              </Field>
              <Field label="Email Address">
                <Input value={email} onChange={setEmail} type="email" placeholder="info@yourbrand.ae" />
              </Field>
              <Field label="Website URL">
                <Input value={website} onChange={setWebsite} prefix="🌐" placeholder="https://yourwebsite.com" />
              </Field>
            </div>
            <Field label="Business Address">
              <Textarea value={address} onChange={setAddress} rows={2} placeholder="Full address…" />
            </Field>
            <Field label="Google Maps URL" hint="Link opened when customer clicks directions">
              <Input value={gmapsUrl} onChange={setGmapsUrl} prefix="📍" placeholder="https://maps.google.com/…" />
            </Field>
          </Section>

          <Section title="Social Media Handles" description="Connect your social accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Instagram">
                <Input value={instagram} onChange={setInstagram} prefix="@" placeholder="yourbrand" />
              </Field>
              <Field label="Facebook">
                <Input value={facebook} onChange={setFacebook} prefix="fb.com/" placeholder="yourbrand" />
              </Field>
              <Field label="X / Twitter">
                <Input value={twitter} onChange={setTwitter} prefix="@" placeholder="yourbrand" />
              </Field>
              <Field label="YouTube Channel">
                <Input value={youtube} onChange={setYoutube} prefix="youtube.com/" placeholder="YourBrand" />
              </Field>
            </div>
          </Section>
        </div>
      )}

      {/* SERVICE CONFIG */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <Section title="Pricing & Tax" description="Configure default rates applied to all services">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="VAT Rate (%)" hint="UAE standard = 5%">
                <Input value={vatRate} onChange={setVatRate} type="number" placeholder="5" />
              </Field>
              <Field label="Default Labour Rate (AED/hr)">
                <Input value={laborRate} onChange={setLaborRate} type="number" placeholder="250" />
              </Field>
              <Field label="Advance Booking Window (days)">
                <Input value={maxAdvanceDays} onChange={setMaxAdvanceDays} type="number" placeholder="30" />
              </Field>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-[#121212]">Enable VAT on all services</p>
                  <p className="text-xs text-gray-400 mt-0.5">Apply {vatRate}% VAT automatically to all line items</p>
                </div>
                <div
                  onClick={() => setVatEnabled(!vatEnabled)}
                  className={cn('relative rounded-full cursor-pointer transition-all duration-200', vatEnabled ? 'bg-[#E62329]' : 'bg-gray-200')}
                  style={{ width: 40, height: 22, flexShrink: 0 }}
                >
                  <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 18, height: 18, top: 2, left: vatEnabled ? 20 : 2 }} />
                </div>
              </label>
            </div>
          </Section>

          <Section title="Booking Settings" description="Online booking configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Minimum Lead Time (hours)" hint="Min. hours before booking is allowed">
                <Input value={minBookingHours} onChange={setMinBookingHours} type="number" placeholder="2" />
              </Field>
              <Field label="Appointment Slot Duration (mins)">
                <Input value={bookingSlot} onChange={setBookingSlot} type="number" placeholder="60" />
              </Field>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {[
                { label: 'Enable Online Bookings', desc: 'Accept bookings through your website', val: onlineBooking, set: setOnlineBooking },
                { label: 'Require Deposit', desc: 'Customers pay a deposit when booking online', val: depositRequired, set: setDepositRequired },
              ].map(row => (
                <label key={row.label} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#121212]">{row.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.desc}</p>
                  </div>
                  <div
                    onClick={() => row.set(!row.val)}
                    className={cn('relative rounded-full cursor-pointer transition-all duration-200', row.val ? 'bg-[#E62329]' : 'bg-gray-200')}
                    style={{ width: 40, height: 22, flexShrink: 0 }}
                  >
                    <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 18, height: 18, top: 2, left: row.val ? 20 : 2 }} />
                  </div>
                </label>
              ))}
              {depositRequired && (
                <Field label="Deposit Percentage (%)" hint="Amount charged as deposit on booking">
                  <Input value={depositPercent} onChange={setDepositPercent} type="number" placeholder="20" className="max-w-xs" />
                </Field>
              )}
            </div>
          </Section>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Section title="Notification Channels" description="Choose how you receive admin alerts">
            <div className="flex flex-col gap-3">
              {[
                { label: 'Email Notifications', desc: 'Receive alerts via email', val: notifEmail, set: setNotifEmail },
                { label: 'SMS Notifications', desc: 'Receive text message alerts', val: notifSms, set: setNotifSms },
                { label: 'WhatsApp Notifications', desc: 'Receive notifications on WhatsApp', val: notifWhatsapp, set: setNotifWhatsapp },
              ].map(row => (
                <label key={row.label} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#121212]">{row.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.desc}</p>
                  </div>
                  <div
                    onClick={() => row.set(!row.val)}
                    className={cn('relative rounded-full cursor-pointer transition-all duration-200', row.val ? 'bg-[#E62329]' : 'bg-gray-200')}
                    style={{ width: 40, height: 22, flexShrink: 0 }}
                  >
                    <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 18, height: 18, top: 2, left: row.val ? 20 : 2 }} />
                  </div>
                </label>
              ))}
            </div>
            <Field label="Admin Notification Email" hint="Alerts are sent to this address">
              <Input value={notifEmail2} onChange={setNotifEmail2} type="email" placeholder="admin@yourbrand.ae" />
            </Field>
          </Section>

          <Section title="Alert Types" description="Select which events trigger notifications">
            <div className="flex flex-col gap-3">
              {[
                { label: 'New Booking', desc: 'Alert when a customer books an appointment', val: notifNewBooking, set: setNotifNewBooking },
                { label: 'Booking Cancelled', desc: 'Alert when a booking is cancelled', val: notifCancelled, set: setNotifCancelled },
                { label: 'Appointment Reminders', desc: 'Send reminders to customers before appointments', val: notifReminder, set: setNotifReminder },
                { label: 'New Review Posted', desc: 'Alert when a customer leaves a Google review', val: notifReview, set: setNotifReview },
                { label: 'Marketing Campaigns', desc: 'Updates about campaign performance', val: notifMarketing, set: setNotifMarketing },
              ].map(row => (
                <label key={row.label} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#121212]">{row.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.desc}</p>
                  </div>
                  <div
                    onClick={() => row.set(!row.val)}
                    className={cn('relative rounded-full cursor-pointer transition-all duration-200', row.val ? 'bg-[#E62329]' : 'bg-gray-200')}
                    style={{ width: 40, height: 22, flexShrink: 0 }}
                  >
                    <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 18, height: 18, top: 2, left: row.val ? 20 : 2 }} />
                  </div>
                </label>
              ))}
            </div>
            {notifReminder && (
              <Field label="Reminder Lead Time (hours)" hint="How many hours before the appointment to send reminder">
                <Input value={reminderHours} onChange={setReminderHours} type="number" placeholder="24" className="max-w-xs" />
              </Field>
            )}
          </Section>
        </div>
      )}

      {/* SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Section title="Change Password" description="Update your admin account password">
            <div className="space-y-4 max-w-md">
              <Field label="Current Password">
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 pr-12 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                  />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="New Password" hint="At least 8 characters">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                />
              </Field>
              <Field label="Confirm New Password">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329]/50"
                />
              </Field>
              {pwError && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                  <AlertCircle size={13} /> {pwError}
                </div>
              )}

              {/* Password strength indicator */}
              {newPw && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password Strength</p>
                  <div className="flex gap-1">
                    {[8, 12, 16, 20].map(threshold => (
                      <div
                        key={threshold}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-all',
                          newPw.length >= threshold ? 'bg-[#E62329]' : 'bg-gray-200'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {newPw.length < 8 ? 'Too short' : newPw.length < 12 ? 'Acceptable' : newPw.length < 16 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>
          </Section>

          <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E62329]/10 flex items-center justify-center">
                  <Smartphone size={18} className="text-[#E62329]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#121212]">Authenticator App</p>
                  <p className="text-xs text-gray-400">Google Authenticator / Authy</p>
                </div>
              </div>
              <div
                onClick={() => setTwoFactor(!twoFactor)}
                className={cn('relative rounded-full cursor-pointer transition-all duration-200', twoFactor ? 'bg-[#E62329]' : 'bg-gray-200')}
                style={{ width: 44, height: 24, flexShrink: 0 }}
              >
                <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 20, height: 20, top: 2, left: twoFactor ? 22 : 2 }} />
              </div>
            </div>
          </Section>

          <Section title="Session & Access" description="Control session duration and login alerts">
            <div className="space-y-5">
              <Field label="Session Timeout (minutes)" hint="Admin is logged out after this period of inactivity">
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full max-w-xs px-4 py-2.5 text-sm text-[#121212] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20"
                >
                  <option value="60">60 minutes</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                  <option value="1440">24 hours</option>
                </select>
              </Field>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-[#121212]">Login Notifications</p>
                  <p className="text-xs text-gray-400 mt-0.5">Receive email when a new session starts</p>
                </div>
                <div
                  onClick={() => setLoginNotif(!loginNotif)}
                  className={cn('relative rounded-full cursor-pointer transition-all duration-200', loginNotif ? 'bg-[#E62329]' : 'bg-gray-200')}
                  style={{ width: 40, height: 22, flexShrink: 0 }}
                >
                  <span className="absolute bg-white rounded-full shadow-sm transition-all duration-200" style={{ width: 18, height: 18, top: 2, left: loginNotif ? 20 : 2 }} />
                </div>
              </label>
            </div>
          </Section>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700">Admin Account Protection</p>
              <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
                For maximum security, use a strong unique password and enable 2FA. Never share your admin credentials. Contact your developer to create additional admin accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  )
}
