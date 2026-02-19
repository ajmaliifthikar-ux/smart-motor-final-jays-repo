'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  Award,
  AlertCircle,
  CalendarCheck,
  Clock,
  ChevronRight,
  Hourglass,
  XCircle,
  Loader2,
  Plus,
  BellOff,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string
  serviceName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  vehicle?: string
  cost?: string
}

interface Notification {
  id: string
  icon: 'bell' | 'check' | 'award' | 'alert'
  title: string
  body: string
  timestamp: string
  read: boolean
}

// ─── Mock notifications (hardcoded) ──────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'check',
    title: 'Booking Confirmed',
    body: 'Your Full Car Service on March 5, 2026 at 10:00 AM has been confirmed.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    icon: 'bell',
    title: 'Service Reminder',
    body: 'Your vehicle is due for an oil change in approximately 2,300 km. Book now to avoid delays.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    icon: 'award',
    title: 'Loyalty Reward Earned',
    body: "You've earned 100 loyalty points from your last service visit. Redeem them for discounts!",
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '4',
    icon: 'alert',
    title: 'AC Service Due',
    body: 'Summer is approaching. Schedule your AC service now to stay cool on the road.',
    timestamp: '5 days ago',
    read: true,
  },
  {
    id: '5',
    icon: 'check',
    title: 'Service Completed',
    body: 'Your Brake Pad Replacement was completed successfully on Nov 8, 2025. Thank you!',
    timestamp: '3 months ago',
    read: true,
  },
]

// ─── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Hourglass },
  confirmed: { label: 'Confirmed', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
}

// ─── Notification icon map ────────────────────────────────────────────────────

const NOTIF_ICONS = {
  bell: { icon: Bell, color: '#3B82F6', bg: 'bg-blue-50' },
  check: { icon: CheckCircle, color: '#10B981', bg: 'bg-emerald-50' },
  award: { icon: Award, color: '#FFD700', bg: 'bg-yellow-50' },
  alert: { icon: AlertCircle, color: '#E62329', bg: 'bg-red-50' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Booking['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-[1.5rem] p-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-black text-[#121212] text-base leading-tight">{booking.serviceName}</h3>
          {booking.vehicle && (
            <p className="text-xs text-[#121212]/50 mt-0.5">{booking.vehicle}</p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-[#121212]/60">
        <span className="flex items-center gap-1.5">
          <CalendarCheck className="w-4 h-4 text-[#E62329]" />
          {booking.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#E62329]" />
          {booking.time}
        </span>
        {booking.cost && (
          <span className="ml-auto font-bold text-[#121212]">{booking.cost}</span>
        )}
      </div>
    </motion.div>
  )
}

function NotificationItem({ notif, index, onMarkRead }: {
  notif: Notification
  index: number
  onMarkRead: (id: string) => void
}) {
  const cfg = NOTIF_ICONS[notif.icon]
  const Icon = cfg.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-4 p-4 rounded-[1.5rem] border transition-colors cursor-pointer
        ${notif.read ? 'bg-white border-black/5' : 'bg-[#E62329]/5 border-[#E62329]/20'}`}
      onClick={() => onMarkRead(notif.id)}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-bold ${notif.read ? 'text-[#121212]/70' : 'text-[#121212]'}`}>
            {notif.title}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-[#E62329] mt-1" />
            )}
          </div>
        </div>
        <p className="text-xs text-[#121212]/50 mt-0.5 leading-relaxed">{notif.body}</p>
        <p className="text-xs text-[#121212]/40 mt-1.5 font-medium">{notif.timestamp}</p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserBookingsPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'notifications'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        const res = await fetch('/api/user/bookings')
        if (!res.ok) throw new Error('Failed to fetch bookings')
        const data = await res.json()
        setBookings(data.bookings ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-[#121212]">
            My Bookings
          </h1>
          <p className="text-sm text-[#121212]/50 mt-1">Track your appointments and notifications</p>
        </div>
        <Link
          href="/#booking"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors shadow-md shadow-[#E62329]/20"
        >
          <Plus className="w-4 h-4" />
          Book New Service
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#121212]/5 p-1 rounded-2xl w-fit">
        {(['bookings', 'notifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-white text-[#121212] shadow-sm'
                : 'text-[#121212]/50 hover:text-[#121212]/80'
            }`}
          >
            {tab === 'notifications' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E62329] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            {tab === 'bookings' ? 'My Bookings' : 'Notifications'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'bookings' ? (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#E62329] animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-white rounded-[2rem] p-8 text-center border border-black/5">
                <AlertCircle className="w-10 h-10 text-[#E62329] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#121212]/60">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-12 text-center border border-black/5 shadow-sm"
              >
                <CalendarCheck className="w-16 h-16 text-[#121212]/15 mx-auto mb-4" />
                <h3 className="text-lg font-black text-[#121212] mb-2">No bookings yet</h3>
                <p className="text-sm text-[#121212]/50 mb-6">
                  Schedule your first service and keep your vehicle in top shape.
                </p>
                <Link
                  href="/#booking"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E62329] text-white font-bold rounded-full hover:bg-[#cc1f25] transition-colors"
                >
                  Book a Service
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, i) => (
                  <BookingCard key={booking.id} booking={booking} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Mark all read */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#121212]/50">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#E62329] hover:underline"
                >
                  <BellOff className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {notifications.map((notif, i) => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                index={i}
                onMarkRead={markRead}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
