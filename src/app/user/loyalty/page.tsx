'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import {
  Star,
  Gift,
  TrendingUp,
  Users,
  MessageSquare,
  Wrench,
  Droplets,
  SprayCanIcon,
  CalendarCheck,
  ChevronRight,
  Award,
} from 'lucide-react'
import Link from 'next/link'

// ─── Tier config ─────────────────────────────────────────────────────────────

const TIERS = [
  { name: 'Bronze', min: 0, max: 999, color: '#CD7F32', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { name: 'Silver', min: 1000, max: 2499, color: '#C0C0C0', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  { name: 'Gold', min: 2500, max: 4999, color: '#FFD700', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  { name: 'Platinum', min: 5000, max: Infinity, color: '#E5E4E2', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const USER_POINTS = 1250

const POINTS_HISTORY = [
  { date: 'Feb 12, 2026', action: 'Full Service Visit', points: +100, type: 'earn' },
  { date: 'Jan 20, 2026', action: 'Wrote a Review', points: +50, type: 'earn' },
  { date: 'Jan 5, 2026', action: 'Referred a Friend', points: +500, type: 'earn' },
  { date: 'Dec 15, 2025', action: 'Free Car Wash Redeemed', points: -200, type: 'spend' },
  { date: 'Nov 8, 2025', action: 'Brake Pad Service Visit', points: +100, type: 'earn' },
  { date: 'Oct 3, 2025', action: 'Wrote a Review', points: +50, type: 'earn' },
  { date: 'Sep 1, 2025', action: 'Welcome Bonus', points: +650, type: 'earn' },
]

const REWARDS = [
  {
    name: 'Free Oil Change',
    cost: 500,
    icon: Droplets,
    color: '#3B82F6',
    description: 'Full synthetic oil change for your vehicle',
    available: true,
  },
  {
    name: '20% Off Next Service',
    cost: 800,
    icon: Wrench,
    color: '#10B981',
    description: 'Get 20% discount on any single service',
    available: true,
  },
  {
    name: 'Free Car Wash',
    cost: 200,
    icon: SprayCanIcon,
    color: '#8B5CF6',
    description: 'Premium interior & exterior wash',
    available: true,
  },
  {
    name: 'Priority Booking',
    cost: 300,
    icon: CalendarCheck,
    color: '#E62329',
    description: 'Skip the queue — guaranteed next-day slot',
    available: true,
  },
]

const HOW_TO_EARN = [
  { icon: Wrench, label: 'Service Visit', points: 100, color: '#E62329', bg: 'bg-red-50' },
  { icon: Users, label: 'Refer a Friend', points: 500, color: '#10B981', bg: 'bg-emerald-50' },
  { icon: MessageSquare, label: 'Leave a Review', points: 50, color: '#3B82F6', bg: 'bg-blue-50' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentTier(points: number) {
  return TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0]
}

function getNextTier(points: number) {
  const idx = TIERS.findIndex((t) => points >= t.min && points <= t.max)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

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

export default function UserLoyaltyPage() {
  const currentTier = getCurrentTier(USER_POINTS)
  const nextTier = getNextTier(USER_POINTS)
  const tierProgress = nextTier
    ? (USER_POINTS - currentTier.min) / (nextTier.min - currentTier.min)
    : 1

  return (
    <div className="space-y-8 pb-12">

      {/* Page header */}
      <FadeSection>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-[#121212]">
          Loyalty Program
        </h1>
        <p className="text-sm text-[#121212]/50 mt-1">Earn points on every visit and redeem exclusive rewards</p>
      </FadeSection>

      {/* Points Hero */}
      <FadeSection delay={0.05}>
        <div className="carbon-fiber rounded-[2rem] relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#121212]/92 to-[#1a1a1a]/95" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Big points display */}
            <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">Your Balance</p>
              <div className="flex items-end gap-3">
                <span className="text-6xl md:text-7xl font-black text-white leading-none">
                  {USER_POINTS.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-white/60 mb-2">pts</span>
              </div>
            </div>

            {/* Tier badge */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center"
                style={{ backgroundColor: `${currentTier.color}25`, border: `2px solid ${currentTier.color}60` }}
              >
                <Award className="w-10 h-10" style={{ color: currentTier.color }} />
              </div>
              <span
                className="px-4 py-1 rounded-full text-sm font-black"
                style={{
                  backgroundColor: `${currentTier.color}20`,
                  color: currentTier.color,
                  border: `1px solid ${currentTier.color}50`,
                }}
              >
                {currentTier.name}
              </span>
            </div>
          </div>

          {/* Ambient glow */}
          <div
            className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `${currentTier.color}20` }}
          />
        </div>
      </FadeSection>

      {/* Tier Progress */}
      <FadeSection delay={0.1}>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-5">
            Tier Progress
          </h2>

          {/* Tier milestones */}
          <div className="relative mb-6">
            <div className="absolute top-4 left-0 right-0 h-2 bg-gray-100 rounded-full" />
            <div
              className="absolute top-4 left-0 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${tierProgress * 100}%`,
                backgroundColor: currentTier.color,
              }}
            />

            <div className="relative flex justify-between">
              {TIERS.map((tier, i) => {
                const reached = USER_POINTS >= tier.min
                return (
                  <div key={tier.name} className="flex flex-col items-center gap-2" style={{ width: '25%', alignItems: i === 0 ? 'flex-start' : i === TIERS.length - 1 ? 'flex-end' : 'center' }}>
                    <div
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 relative"
                      style={{
                        backgroundColor: reached ? tier.color : '#e5e7eb',
                        borderColor: reached ? tier.color : '#d1d5db',
                      }}
                    >
                      <Star className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: reached ? tier.color : '#9ca3af' }}>
                      {tier.name}
                    </span>
                    <span className="text-[10px] text-[#121212]/40 font-medium">
                      {tier.min.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {nextTier ? (
            <div className="flex items-center justify-between bg-[#FAFAF9] rounded-2xl p-4">
              <div>
                <p className="text-sm font-semibold text-[#121212]">
                  {(nextTier.min - USER_POINTS).toLocaleString()} pts to{' '}
                  <span style={{ color: nextTier.color }}>{nextTier.name}</span>
                </p>
                <p className="text-xs text-[#121212]/50 mt-0.5">Keep earning to unlock exclusive perks</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#121212]/30" />
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm font-bold text-[#121212]">Maximum tier reached — Platinum status!</p>
              <p className="text-xs text-[#121212]/50 mt-1">Enjoy all exclusive Smart Motor benefits</p>
            </div>
          )}
        </div>
      </FadeSection>

      {/* Rewards Catalog */}
      <FadeSection delay={0.1}>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black uppercase tracking-tight text-[#121212]">
              Rewards Catalog
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-[#121212]/50">
              <Star className="w-4 h-4 text-[#FFD700]" />
              <span className="font-bold text-[#121212]">{USER_POINTS.toLocaleString()}</span> pts available
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {REWARDS.map((reward, i) => {
              const canRedeem = USER_POINTS >= reward.cost
              return (
                <motion.div
                  key={reward.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`border rounded-[1.5rem] p-5 transition-all duration-200 ${
                    canRedeem
                      ? 'border-black/8 hover:border-[#E62329]/30 hover:shadow-md cursor-pointer'
                      : 'border-black/5 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${reward.color}15` }}
                    >
                      <reward.icon className="w-5 h-5" style={{ color: reward.color }} />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-black text-[#121212]">
                      <Star className="w-3.5 h-3.5 text-[#FFD700]" />
                      {reward.cost.toLocaleString()} pts
                    </div>
                  </div>
                  <h3 className="font-black text-[#121212] text-sm">{reward.name}</h3>
                  <p className="text-xs text-[#121212]/50 mt-1 mb-3">{reward.description}</p>
                  <button
                    disabled={!canRedeem}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      canRedeem
                        ? 'bg-[#E62329] text-white hover:bg-[#cc1f25]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {canRedeem ? 'Redeem Now' : `Need ${(reward.cost - USER_POINTS).toLocaleString()} more pts`}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </FadeSection>

      {/* Points History */}
      <FadeSection delay={0.1}>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-5">
            Points History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#121212]/8">
                  <th className="text-left text-xs font-bold text-[#121212]/50 uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-bold text-[#121212]/50 uppercase tracking-wider pb-3">Action</th>
                  <th className="text-right text-xs font-bold text-[#121212]/50 uppercase tracking-wider pb-3">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121212]/5">
                {POINTS_HISTORY.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-3 text-xs text-[#121212]/50 font-medium whitespace-nowrap pr-4">{item.date}</td>
                    <td className="py-3 text-sm text-[#121212] font-semibold pr-4">{item.action}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-sm font-black ${
                          item.type === 'earn' ? 'text-emerald-600' : 'text-[#E62329]'
                        }`}
                      >
                        {item.type === 'earn' ? '+' : ''}{item.points.toLocaleString()} pts
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeSection>

      {/* How to Earn */}
      <FadeSection delay={0.1}>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#121212] mb-5">
            How to Earn Points
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {HOW_TO_EARN.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-3 p-5 rounded-[1.5rem] border border-black/5"
                style={{ background: `linear-gradient(135deg, ${item.color}08, transparent)` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}
                >
                  <item.icon className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="font-black text-[#121212] text-sm">{item.label}</p>
                  <p className="text-2xl font-black mt-1" style={{ color: item.color }}>
                    +{item.points}
                    <span className="text-sm font-bold text-[#121212]/50 ml-1">pts</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-[#E62329]/5 border border-[#E62329]/15 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#E62329] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#121212]">
                Start earning today — book your next service
              </p>
            </div>
            <Link
              href="/#booking"
              className="flex items-center gap-1 text-sm font-bold text-[#E62329] hover:underline flex-shrink-0"
            >
              Book Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
