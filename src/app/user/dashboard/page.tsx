'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import {
  Wrench,
  Star,
  Gauge,
  Car,
  CalendarCheck,
  ClipboardList,
  Trophy,
  Phone,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hourglass,
} from 'lucide-react'
import Link from 'next/link'

// ─── Fake / mock data ─────────────────────────────────────────────────────────

const USER_NAME = 'Alex'
const LAST_VISIT = 'February 12, 2026'

const QUICK_STATS = [
  { label: 'Total Services', value: '14', icon: Wrench, color: '#E62329' },
  { label: 'Loyalty Points', value: '1,250', icon: Star, color: '#FFD700' },
  { label: 'Next Service (km)', value: '2,300', icon: Gauge, color: '#3B82F6' },
  { label: 'Vehicles', value: '2', icon: Car, color: '#10B981' },
]

const CURRENT_KM = 7700
const NEXT_SERVICE_KM = 10000
const CAR_BRAND = 'Toyota Camry'
const CAR_YEAR = '2021'

const SERVICE_HISTORY = [
  { date: 'Feb 12, 2026', service: 'Full Service & Oil Change', cost: 'AED 480', status: 'completed' },
  { date: 'Nov 8, 2025', service: 'Brake Pad Replacement', cost: 'AED 320', status: 'completed' },
  { date: 'Aug 3, 2025', service: 'AC Service & Regas', cost: 'AED 250', status: 'completed' },
  { date: 'May 20, 2025', service: 'Tyre Rotation & Balance', cost: 'AED 150', status: 'completed' },
  { date: 'Jan 15, 2025', service: 'Annual Inspection', cost: 'AED 200', status: 'completed' },
]

// Next oil change is at every 10,000 km — last done at 5,000 km → next at 10,000 km
const LAST_OIL_CHANGE_KM = 5000
const OIL_CHANGE_INTERVAL = 10000
const NEXT_OIL_CHANGE_KM = LAST_OIL_CHANGE_KM + OIL_CHANGE_INTERVAL
const DAYS_UNTIL_OIL_CHANGE = 38 // estimated
const OIL_PROGRESS = Math.min((CURRENT_KM - LAST_OIL_CHANGE_KM) / OIL_CHANGE_INTERVAL, 1)

const UPCOMING_BOOKING = {
  service: 'Full Car Service',
  date: 'March 5, 2026',
  time: '10:00 AM',
  status: 'Confirmed',
}

const QUICK_ACTIONS = [
  { label: 'Book Service', href: '/#booking', icon: CalendarCheck, color: '#E62329' },
  { label: 'View History', href: '/user/bookings', icon: ClipboardList, color: '#3B82F6' },
  { label: 'Loyalty Points', href: '/user/loyalty', icon: Trophy, color: '#FFD700' },
  { label: 'Contact Us', href: 'tel:+97142345678', icon: Phone, color: '#10B981' },
]

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    pending: {
      label: 'Pending',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: <Hourglass className="w-3 h-3" />,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: <AlertCircle className="w-3 h-3" />,
    },
  }
  const s = map[status.toLowerCase()] ?? map.pending
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.icon}
      {s.label}
    </span>
  )
}

// ─── Circular SVG progress ring ───────────────────────────────────────────────

function CircularProgress({ progress, size = 120, stroke = 10, color = '#E62329' }: {
  progress: number
  size?: number
  stroke?: number
  color?: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(progress, 1))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

// ─── Section fade-in wrapper ──────────────────────────────────────────────────

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserDashboardPage() {
  const mileageProgress = Math.min(CURRENT_KM / NEXT_SERVICE_KM, 1)

  return (
    <div className="space-y-8 pb-12">

      {/* Welcome Header */}
      <FadeSection>
        <div className="carbon-fiber rounded-[2rem] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E62329]/90 to-[#121212]/95" />
          <div className="relative z-10">
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-1">
              Last visit: {LAST_VISIT}
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-tight">
              Welcome back,<br />
              <span className="text-[#E62329]">{USER_NAME}</span>
            </h1>
            <p className="text-white/60 mt-2 text-sm">Here&apos;s your vehicle health overview.</p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-[40px] border-white/5 pointer-events-none" />
          <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full border-[30px] border-white/5 pointer-events-none" />
        </div>
      </FadeSection>

      {/* Quick Stats */}
      <FadeSection delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#121212]">{stat.value}</p>
                <p className="text-xs text-[#121212]/50 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* Mileage Tracker + Oil Change Countdown — side by side on md+ */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Mileage Tracker */}
        <FadeSection delay={0.1}>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 h-full">
            <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-1">
              Mileage Tracker
            </h2>
            <p className="text-xs text-[#121212]/50 mb-5">
              {CAR_BRAND} &middot; {CAR_YEAR}
            </p>

            {/* Arc progress bar */}
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 flex-shrink-0">
                <CircularProgress progress={mileageProgress} size={112} stroke={10} color="#E62329" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-black text-[#121212]">{Math.round(mileageProgress * 100)}%</p>
                  <p className="text-[10px] text-[#121212]/40 leading-tight text-center">to service</p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-[#121212]/50 uppercase tracking-wide font-semibold">Current</p>
                  <p className="text-2xl font-black text-[#121212]">{CURRENT_KM.toLocaleString()} <span className="text-sm font-medium text-[#121212]/50">km</span></p>
                </div>
                <div className="h-px bg-[#121212]/10" />
                <div>
                  <p className="text-xs text-[#121212]/50 uppercase tracking-wide font-semibold">Next Service</p>
                  <p className="text-2xl font-black text-[#E62329]">{NEXT_SERVICE_KM.toLocaleString()} <span className="text-sm font-medium text-[#121212]/50">km</span></p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#E62329] to-[#ff6b6f] transition-all duration-1000"
                    style={{ width: `${mileageProgress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[#121212]/50">
                  {(NEXT_SERVICE_KM - CURRENT_KM).toLocaleString()} km remaining
                </p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* Oil Change Countdown */}
        <FadeSection delay={0.15}>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 h-full">
            <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-1">
              Oil Change
            </h2>
            <p className="text-xs text-[#121212]/50 mb-5">
              Every {OIL_CHANGE_INTERVAL.toLocaleString()} km &middot; Next at {NEXT_OIL_CHANGE_KM.toLocaleString()} km
            </p>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <CircularProgress
                  progress={OIL_PROGRESS}
                  size={140}
                  stroke={12}
                  color={OIL_PROGRESS > 0.8 ? '#E62329' : '#F59E0B'}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-black text-[#121212]">{DAYS_UNTIL_OIL_CHANGE}</p>
                  <p className="text-xs text-[#121212]/50 font-medium">days</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-[#121212]">Estimated change in {DAYS_UNTIL_OIL_CHANGE} days</p>
                <p className="text-xs text-[#121212]/50 mt-1">
                  {Math.round(OIL_PROGRESS * 100)}% of interval used &middot; {(CURRENT_KM - LAST_OIL_CHANGE_KM).toLocaleString()} / {OIL_CHANGE_INTERVAL.toLocaleString()} km
                </p>
              </div>

              {OIL_PROGRESS > 0.8 && (
                <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E62329] flex-shrink-0" />
                  <p className="text-xs text-[#E62329] font-semibold">Oil change due soon — book now!</p>
                </div>
              )}
            </div>
          </div>
        </FadeSection>
      </div>

      {/* Service History Timeline + Upcoming Booking */}
      <div className="grid md:grid-cols-5 gap-6">

        {/* Service History — takes 3 cols */}
        <FadeSection delay={0.1}>
          <div className="md:col-span-3 bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#121212]">
                Service History
              </h2>
              <Link
                href="/user/bookings"
                className="text-xs text-[#E62329] font-semibold flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Timeline */}
            <div className="relative space-y-0">
              {SERVICE_HISTORY.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#E62329] ring-4 ring-[#E62329]/20 flex-shrink-0 mt-1" />
                    {i < SERVICE_HISTORY.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 my-1 min-h-[2rem]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-5 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#121212] leading-tight">{item.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-[#121212]/40" />
                          <p className="text-xs text-[#121212]/50">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-black text-[#121212]">{item.cost}</p>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* Upcoming Booking — takes 2 cols */}
        <FadeSection delay={0.15}>
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Upcoming booking card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 flex-1">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-4">
                Upcoming
              </h2>

              {UPCOMING_BOOKING ? (
                <div className="space-y-4">
                  <div className="carbon-fiber rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#121212]/90 to-[#E62329]/80" />
                    <div className="relative z-10 space-y-2">
                      <StatusBadge status="confirmed" />
                      <p className="text-white font-black text-base mt-2">{UPCOMING_BOOKING.service}</p>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{UPCOMING_BOOKING.date}</span>
                        <span>&middot;</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{UPCOMING_BOOKING.time}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/user/bookings"
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FAFAF9] border border-[#121212]/10 hover:border-[#E62329]/40 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-[#121212]">Manage booking</span>
                    <ChevronRight className="w-4 h-4 text-[#121212]/40 group-hover:text-[#E62329] transition-colors" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <CalendarCheck className="w-12 h-12 text-[#121212]/20" />
                  <p className="text-sm text-[#121212]/50 text-center">No upcoming bookings</p>
                  <Link
                    href="/#booking"
                    className="px-5 py-2 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </FadeSection>
      </div>

      {/* Quick Actions Grid */}
      <FadeSection delay={0.1}>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#121212]/8 hover:border-transparent hover:shadow-lg transition-all duration-200 group"
                style={{
                  background: `linear-gradient(135deg, ${action.color}08, transparent)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <p className="text-sm font-bold text-[#121212] text-center leading-tight">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </FadeSection>

    </div>
  )
}
