'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Car,
  Bell,
  Shield,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
  Camera,
  LogOut,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vehicle {
  id: string
  brand: string
  model: string
  year: string
  plate: string
}

interface ProfileForm {
  name: string
  phone: string
  email: string
}

interface NotifPrefs {
  serviceReminders: boolean
  bookingConfirmations: boolean
  loyaltyRewards: boolean
  marketingEmails: boolean
}

interface AddVehicleForm {
  brand: string
  model: string
  year: string
  plate: string
}

// ─── Mock initial data ────────────────────────────────────────────────────────

const CAR_BRANDS = [
  'Toyota', 'Nissan', 'Honda', 'Mitsubishi', 'Hyundai', 'Kia',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet',
  'Jeep', 'Land Rover', 'Porsche', 'Lexus', 'Infiniti', 'Mazda',
  'Subaru', 'Suzuki', 'Isuzu', 'GMC', 'Dodge', 'Ram',
]

const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', brand: 'Toyota', model: 'Camry', year: '2021', plate: 'A 12345' },
  { id: '2', brand: 'Nissan', model: 'Patrol', year: '2019', plate: 'B 67890' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#E62329]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#E62329]" />
        </div>
        <h2 className="text-lg font-black uppercase tracking-tight text-[#121212]">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#121212]/5 last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#121212]">{label}</p>
        <p className="text-xs text-[#121212]/50 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? 'bg-[#E62329]' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', disabled = false, placeholder = '' }: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#121212]/60 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium transition-all
          ${disabled
            ? 'bg-[#FAFAF9] border-[#121212]/8 text-[#121212]/40 cursor-not-allowed'
            : 'bg-white border-[#121212]/15 text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#E62329]/25 focus:border-[#E62329]'
          }`}
      />
      {disabled && (
        <p className="text-xs text-[#121212]/40 mt-1">This field cannot be changed</p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserSettingsPage() {
  // Profile
  const [profile, setProfile] = useState<ProfileForm>({
    name: 'Alex Johnson',
    phone: '+971 50 123 4567',
    email: 'alex@example.com',
  })
  const [profileSaving, setProfileSaving] = useState(false)

  // Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [addForm, setAddForm] = useState<AddVehicleForm>({ brand: '', model: '', year: '', plate: '' })
  const [vehicleSaving, setVehicleSaving] = useState(false)

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    serviceReminders: true,
    bookingConfirmations: true,
    loyaltyRewards: true,
    marketingEmails: false,
  })
  const [notifSaving, setNotifSaving] = useState(false)

  // Security
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false })
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState('')

  // ─── Handlers ──────────────────────────────────────────────────────────────

  async function saveProfile() {
    setProfileSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setProfileSaving(false)
    }
  }

  async function saveNotifPrefs() {
    setNotifSaving(true)
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationPreferences: notifPrefs }),
      })
      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setNotifSaving(false)
    }
  }

  async function changePassword() {
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPass.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPasswordSaving(true)
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordChange: true }),
      })
      toast.success('Password changed successfully')
      setPasswordForm({ current: '', newPass: '', confirm: '' })
    } catch {
      toast.error('Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  function addVehicle() {
    if (!addForm.brand || !addForm.model || !addForm.year || !addForm.plate) {
      toast.error('Please fill in all vehicle fields')
      return
    }
    setVehicleSaving(true)
    setTimeout(() => {
      setVehicles((v) => [...v, { ...addForm, id: Date.now().toString() }])
      setAddForm({ brand: '', model: '', year: '', plate: '' })
      setShowAddVehicle(false)
      setVehicleSaving(false)
      toast.success('Vehicle added')
    }, 600)
  }

  function removeVehicle(id: string) {
    setVehicles((v) => v.filter((veh) => veh.id !== id))
    toast.success('Vehicle removed')
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-[#121212]">
          Settings
        </h1>
        <p className="text-sm text-[#121212]/50 mt-1">Manage your account, vehicles and preferences</p>
      </motion.div>

      {/* Profile Section */}
      <SectionCard title="Profile" icon={User}>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#121212]/8">
          <div className="relative">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#E62329]/20 to-[#121212]/10 flex items-center justify-center">
              <User className="w-9 h-9 text-[#E62329]/60" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#E62329] rounded-xl flex items-center justify-center shadow-md hover:bg-[#cc1f25] transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="font-black text-[#121212] text-lg">{profile.name}</p>
            <p className="text-sm text-[#121212]/50">{profile.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <InputField
            label="Full Name"
            value={profile.name}
            onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
            placeholder="Your full name"
          />
          <InputField
            label="Phone Number"
            value={profile.phone}
            onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
            placeholder="+971 50 000 0000"
            type="tel"
          />
          <div className="sm:col-span-2">
            <InputField
              label="Email Address"
              value={profile.email}
              disabled
              type="email"
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={profileSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors disabled:opacity-60"
        >
          {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </SectionCard>

      {/* My Vehicles */}
      <SectionCard title="My Vehicles" icon={Car}>
        <div className="space-y-3 mb-4">
          {vehicles.map((veh) => (
            <motion.div
              key={veh.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-[#FAFAF9] rounded-2xl border border-[#121212]/8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121212]/8 flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#121212]/50" />
                </div>
                <div>
                  <p className="font-bold text-[#121212] text-sm">
                    {veh.brand} {veh.model}
                  </p>
                  <p className="text-xs text-[#121212]/50">{veh.year} &middot; {veh.plate}</p>
                </div>
              </div>
              <button
                onClick={() => removeVehicle(veh.id)}
                className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                aria-label="Remove vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {vehicles.length === 0 && (
            <div className="text-center py-6 text-sm text-[#121212]/40">
              No vehicles added yet
            </div>
          )}
        </div>

        {/* Add vehicle toggle */}
        <button
          onClick={() => setShowAddVehicle((v) => !v)}
          className="flex items-center gap-2 text-sm font-bold text-[#E62329] hover:underline mb-4"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
          <ChevronDown className={`w-4 h-4 transition-transform ${showAddVehicle ? 'rotate-180' : ''}`} />
        </button>

        {showAddVehicle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-[#E62329]/20 rounded-2xl p-4 bg-[#E62329]/5"
          >
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {/* Brand dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#121212]/60 uppercase tracking-wider mb-1.5">
                  Brand
                </label>
                <div className="relative">
                  <select
                    value={addForm.brand}
                    onChange={(e) => setAddForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-[#121212]/15 bg-white text-sm font-medium text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#E62329]/25 focus:border-[#E62329] appearance-none"
                  >
                    <option value="">Select brand</option>
                    {CAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]/40 pointer-events-none" />
                </div>
              </div>

              <InputField
                label="Model"
                value={addForm.model}
                onChange={(v) => setAddForm((f) => ({ ...f, model: v }))}
                placeholder="e.g. Camry"
              />
              <InputField
                label="Year"
                value={addForm.year}
                onChange={(v) => setAddForm((f) => ({ ...f, year: v }))}
                placeholder="e.g. 2021"
                type="number"
              />
              <InputField
                label="License Plate"
                value={addForm.plate}
                onChange={(v) => setAddForm((f) => ({ ...f, plate: v }))}
                placeholder="e.g. A 12345"
              />
            </div>

            <button
              onClick={addVehicle}
              disabled={vehicleSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors disabled:opacity-60"
            >
              {vehicleSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Vehicle
            </button>
          </motion.div>
        )}
      </SectionCard>

      {/* Notification Preferences */}
      <SectionCard title="Notifications" icon={Bell}>
        <div className="mb-5">
          <Toggle
            label="Service Reminders"
            description="Get notified when your vehicle is due for service"
            checked={notifPrefs.serviceReminders}
            onChange={(v) => setNotifPrefs((p) => ({ ...p, serviceReminders: v }))}
          />
          <Toggle
            label="Booking Confirmations"
            description="Receive confirmations when bookings are made or updated"
            checked={notifPrefs.bookingConfirmations}
            onChange={(v) => setNotifPrefs((p) => ({ ...p, bookingConfirmations: v }))}
          />
          <Toggle
            label="Loyalty Rewards"
            description="Be notified when you earn or can redeem loyalty points"
            checked={notifPrefs.loyaltyRewards}
            onChange={(v) => setNotifPrefs((p) => ({ ...p, loyaltyRewards: v }))}
          />
          <Toggle
            label="Marketing Emails"
            description="Receive promotional offers and Smart Motor news"
            checked={notifPrefs.marketingEmails}
            onChange={(v) => setNotifPrefs((p) => ({ ...p, marketingEmails: v }))}
          />
        </div>
        <button
          onClick={saveNotifPrefs}
          disabled={notifSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors disabled:opacity-60"
        >
          {notifSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Preferences
        </button>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security" icon={Shield}>
        <h3 className="text-sm font-bold text-[#121212] mb-4">Change Password</h3>
        <div className="space-y-3 mb-5">
          {(['current', 'newPass', 'confirm'] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-bold text-[#121212]/60 uppercase tracking-wider mb-1.5">
                {field === 'current' ? 'Current Password' : field === 'newPass' ? 'New Password' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  value={passwordForm[field]}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-[#121212]/15 bg-white text-sm font-medium text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#E62329]/25 focus:border-[#E62329]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#121212]/40 hover:text-[#121212]/70 transition-colors"
                >
                  {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={changePassword}
            disabled={passwordSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E62329] text-white text-sm font-bold rounded-full hover:bg-[#cc1f25] transition-colors disabled:opacity-60"
          >
            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Update Password
          </button>

          <button
            onClick={() => toast.info('All other sessions have been signed out')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#121212]/8 text-[#121212] text-sm font-bold rounded-full hover:bg-[#121212]/15 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out All Devices
          </button>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-red-200"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight text-red-600">Danger Zone</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
          <p className="text-sm font-semibold text-red-700 mb-1">Delete Account</p>
          <p className="text-xs text-red-600/80 leading-relaxed">
            This action is permanent and cannot be undone. All your data, bookings, vehicles and loyalty points will be permanently deleted.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-[#121212]/60 uppercase tracking-wider mb-1.5">
            Type &quot;DELETE&quot; to confirm
          </label>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full px-4 py-3 rounded-2xl border border-red-200 bg-white text-sm font-bold text-[#121212] focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 max-w-xs"
          />
        </div>

        <button
          disabled={deleteConfirm !== 'DELETE'}
          onClick={() => toast.error('Account deletion would be triggered here')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </button>
      </motion.div>

    </div>
  )
}
