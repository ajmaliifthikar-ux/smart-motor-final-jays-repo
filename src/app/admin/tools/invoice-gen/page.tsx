'use client'

import { useState, useCallback, useRef, useId } from 'react'
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Download,
  Copy,
  CheckCircle2,
  ChevronDown,
  Car,
  User,
  Phone,
  Mail,
  Hash,
  Calendar,
  ClipboardList,
  Percent,
  Tag,
  X,
  Printer,
  Wrench,
  RotateCcw,
  StickyNote,
  BadgeCheck,
  Send,
  Circle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'draft' | 'sent' | 'paid'

interface LineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  discount: number // percent 0-100
  taxable: boolean
}

interface InvoiceData {
  invoiceNo: string
  date: string
  dueDate: string
  customerName: string
  customerPhone: string
  customerEmail: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  notes: string
  status: InvoiceStatus
  items: LineItem[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VAT_RATE = 0.05 // 5%

const SERVICE_PRESETS: { label: string; description: string; price: number; taxable: boolean }[] = [
  { label: 'Oil Change', description: 'Full synthetic oil change & filter replacement', price: 250, taxable: true },
  { label: 'Brake Service', description: 'Brake pad replacement (front & rear) + rotor inspection', price: 750, taxable: true },
  { label: 'Tyre Rotation', description: 'Tyre rotation & balancing (all 4 wheels)', price: 180, taxable: true },
  { label: 'AC Service', description: 'Air conditioning recharge & system check', price: 450, taxable: true },
  { label: 'Battery Replace', description: 'Battery replacement & charging system test', price: 600, taxable: true },
  { label: 'Full Inspection', description: 'Comprehensive 50-point vehicle inspection', price: 300, taxable: true },
  { label: 'Wheel Alignment', description: '4-wheel computerised alignment', price: 200, taxable: true },
  { label: 'Detailing', description: 'Full interior & exterior premium detailing', price: 850, taxable: true },
  { label: 'Engine Flush', description: 'Engine flush & flush treatment service', price: 150, taxable: false },
  { label: 'Gearbox Service', description: 'Automatic transmission fluid change', price: 550, taxable: true },
]

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  draft: { label: 'Draft', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Circle },
  sent: { label: 'Sent', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Send },
  paid: { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: BadgeCheck },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function dueDateISO(days = 30) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatAED(n: number) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-AE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso + 'T00:00:00'))
}

function defaultItem(): LineItem {
  return { id: uid(), description: '', qty: 1, unitPrice: 0, discount: 0, taxable: true }
}

function calcItem(item: LineItem) {
  const gross = item.qty * item.unitPrice
  const discountAmt = gross * (item.discount / 100)
  const net = gross - discountAmt
  return { gross, discountAmt, net }
}

function calcTotals(items: LineItem[]) {
  let subtotal = 0
  let totalDiscount = 0
  let taxableAmount = 0

  for (const item of items) {
    const { gross, discountAmt, net } = calcItem(item)
    subtotal += gross
    totalDiscount += discountAmt
    if (item.taxable) taxableAmount += net
  }

  const vat = taxableAmount * VAT_RATE
  const total = subtotal - totalDiscount + vat
  return { subtotal, totalDiscount, taxableAmount, vat, total }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
      {children}{required && <span className="text-[#E62329] ml-0.5">*</span>}
    </span>
  )
}

function Input({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="relative">
      {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input
        {...props}
        className={cn(
          'w-full py-2.5 rounded-xl border border-gray-200 text-sm text-[#121212] placeholder:text-gray-400 focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] outline-none transition-all bg-white',
          Icon ? 'pl-8 pr-3' : 'px-3',
          props.className,
        )}
      />
    </div>
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#121212] placeholder:text-gray-400 focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] outline-none transition-all bg-white resize-none"
    />
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#E62329]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-[#E62329]" />
        </div>
        <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-700">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ─── Print Modal ──────────────────────────────────────────────────────────────

function PrintModal({ invoice, totals, onClose }: {
  invoice: InvoiceData
  totals: ReturnType<typeof calcTotals>
  onClose: () => void
}) {
  const handlePrint = () => {
    window.print()
  }

  const statusCfg = STATUS_CONFIG[invoice.status]

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:block print:overflow-visible">

      {/* Print-only full-page styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-modal-overlay { display: block !important; background: white !important; padding: 0 !important; }
          .print-modal-controls { display: none !important; }
          .print-modal-card { box-shadow: none !important; border: none !important; max-width: 100% !important; border-radius: 0 !important; }
        }
      `}</style>

      <div className="print-modal-overlay w-full flex flex-col items-center">

        {/* Controls bar — hidden on print */}
        <div className="print-modal-controls sticky top-4 z-10 flex items-center gap-3 mb-6 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-gray-100 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#E62329] text-white rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all"
          >
            <Printer size={13} /> Download / Print PDF
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-400 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all"
          >
            <X size={13} /> Close
          </button>
        </div>

        {/* Invoice card */}
        <div className="print-modal-card bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:rounded-none print:border-0">

          {/* Header stripe */}
          <div className="bg-[#121212] px-10 py-8 flex items-start justify-between gap-6">
            {/* Brand */}
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[#E62329] font-black text-2xl tracking-tighter italic uppercase">Smart</span>
                <span className="text-white font-black text-2xl tracking-tighter italic uppercase">Motor</span>
              </div>
              <p className="text-white/50 text-[11px] font-medium">M9 Musaffah, Abu Dhabi, UAE</p>
              <p className="text-white/50 text-[11px]">800 76278  ·  info@smartmotor.ae</p>
              <p className="text-white/50 text-[11px]">www.smartmotor.ae</p>
            </div>

            {/* Invoice meta */}
            <div className="text-right">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Invoice</p>
              <p className="text-white font-black text-xl tracking-tight">#{invoice.invoiceNo || '—'}</p>
              <div className={cn('inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest', statusCfg.bg, statusCfg.color)}>
                <statusCfg.icon size={9} />
                {statusCfg.label}
              </div>
            </div>
          </div>

          {/* Dates & customer row */}
          <div className="px-10 py-6 grid grid-cols-2 gap-8 border-b border-gray-100 bg-gray-50/60">
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Issue Date</p>
                <p className="text-sm font-bold text-[#121212]">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Due Date</p>
                <p className="text-sm font-bold text-[#121212]">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Bill To</p>
              <p className="font-black text-[#121212] text-base">{invoice.customerName || '—'}</p>
              {invoice.customerPhone && <p className="text-sm text-gray-500 mt-0.5">{invoice.customerPhone}</p>}
              {invoice.customerEmail && <p className="text-sm text-gray-500">{invoice.customerEmail}</p>}
              {(invoice.vehicleMake || invoice.vehiclePlate) && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-[#E62329]/8 text-[#E62329] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  <Car size={11} />
                  {[invoice.vehicleYear, invoice.vehicleMake, invoice.vehicleModel].filter(Boolean).join(' ')}
                  {invoice.vehiclePlate && ` · ${invoice.vehiclePlate}`}
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="px-10 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#121212]/10">
                  <th className="text-left pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[44%]">Description</th>
                  <th className="text-center pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[8%]">Qty</th>
                  <th className="text-right pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[15%]">Unit Price</th>
                  <th className="text-right pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[10%]">Disc%</th>
                  <th className="text-right pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[8%]">VAT</th>
                  <th className="text-right pb-3 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[15%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.filter(i => i.description || i.unitPrice).map((item, idx) => {
                  const { net } = calcItem(item)
                  return (
                    <tr key={item.id} className={cn('border-b border-gray-50', idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-[#121212] leading-snug">{item.description || <span className="text-gray-300 italic">—</span>}</p>
                      </td>
                      <td className="py-3 text-center text-gray-600">{item.qty}</td>
                      <td className="py-3 text-right text-gray-600">AED {formatAED(item.unitPrice)}</td>
                      <td className="py-3 text-right text-gray-400">{item.discount > 0 ? `${item.discount}%` : '—'}</td>
                      <td className="py-3 text-right">
                        {item.taxable
                          ? <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Yes</span>
                          : <span className="text-[9px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider">No</span>}
                      </td>
                      <td className="py-3 text-right font-bold text-[#121212]">AED {formatAED(net)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Totals block */}
            <div className="mt-6 flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-medium">Subtotal</span>
                  <span>AED {formatAED(totals.subtotal)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-[#E62329]">
                    <span className="font-medium">Discount</span>
                    <span>− AED {formatAED(totals.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-medium">VAT (5%)</span>
                  <span>AED {formatAED(totals.vat)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#121212]">
                  <span className="text-base font-black text-[#121212] uppercase tracking-wide">Total</span>
                  <span className="text-xl font-black text-[#121212]">AED {formatAED(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mx-10 mb-6 bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="bg-[#121212]/5 border-t border-gray-100 px-10 py-5 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-medium">Thank you for choosing Smart Motor — Built for Performance.</p>
            <p className="text-[10px] text-gray-400">TRN: 100XXXXXXXXX00003</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InvoiceGenPage() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNo: `SM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    date: todayISO(),
    dueDate: dueDateISO(30),
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    notes: '',
    status: 'draft',
    items: [defaultItem()],
  })

  const [showPreview, setShowPreview] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [copiedTotal, setCopiedTotal] = useState(false)

  // ── Derived totals ──────────────────────────────────────────
  const totals = calcTotals(invoice.items)

  // ── Invoice field updater ───────────────────────────────────
  const setField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Line item updaters ──────────────────────────────────────
  const setItemField = useCallback(<K extends keyof LineItem>(id: string, key: K, value: LineItem[K]) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [key]: value } : item),
    }))
  }, [])

  const addItem = useCallback(() => {
    setInvoice(prev => ({ ...prev, items: [...prev.items, defaultItem()] }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setInvoice(prev => {
      if (prev.items.length <= 1) return prev
      return { ...prev, items: prev.items.filter(i => i.id !== id) }
    })
  }, [])

  const addPreset = useCallback((preset: typeof SERVICE_PRESETS[number]) => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items.filter(i => i.description || i.unitPrice), {
        id: uid(),
        description: preset.description,
        qty: 1,
        unitPrice: preset.price,
        discount: 0,
        taxable: preset.taxable,
      }],
    }))
    toast.success(`"${preset.label}" added to invoice`)
    setShowPresets(false)
  }, [])

  const resetInvoice = useCallback(() => {
    setInvoice({
      invoiceNo: `SM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      date: todayISO(),
      dueDate: dueDateISO(30),
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      notes: '',
      status: 'draft',
      items: [defaultItem()],
    })
    toast.success('Invoice cleared')
  }, [])

  const copyTotal = useCallback(() => {
    navigator.clipboard.writeText(`AED ${formatAED(totals.total)}`).then(() => {
      setCopiedTotal(true)
      toast.success('Total copied to clipboard')
      setTimeout(() => setCopiedTotal(false), 2500)
    })
  }, [totals.total])

  const statusCfg = STATUS_CONFIG[invoice.status]

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-8">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#121212] italic leading-none">
              Invoice Generator
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">Build, preview and download professional Smart Motor invoices</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={resetInvoice}
              className="flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#121212] rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 bg-[#E62329] hover:bg-[#c41e24] text-white rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#E62329]/20"
            >
              <Eye size={13} /> Preview Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
          {/* ── Left column ─────────────────────────────────── */}
          <div className="space-y-6">

            {/* Invoice Meta */}
            <SectionCard title="Invoice Details" icon={FileText}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label required>Invoice #</Label>
                  <Input
                    icon={Hash}
                    value={invoice.invoiceNo}
                    onChange={e => setField('invoiceNo', e.target.value)}
                    placeholder="SM-2026-0001"
                  />
                </div>
                <div>
                  <Label required>Date</Label>
                  <Input
                    type="date"
                    icon={Calendar}
                    value={invoice.date}
                    onChange={e => setField('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    icon={Calendar}
                    value={invoice.dueDate}
                    onChange={e => setField('dueDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Status selector */}
              <div className="mt-5">
                <Label>Invoice Status</Label>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {(Object.keys(STATUS_CONFIG) as InvoiceStatus[]).map(s => {
                    const cfg = STATUS_CONFIG[s]
                    const active = invoice.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => setField('status', s)}
                        className={cn(
                          'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all',
                          active ? cn(cfg.bg, cfg.color, 'ring-2 ring-offset-1', s === 'draft' ? 'ring-amber-300' : s === 'sent' ? 'ring-blue-300' : 'ring-emerald-300') : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300',
                        )}
                      >
                        <cfg.icon size={10} />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </SectionCard>

            {/* Customer Info */}
            <SectionCard title="Customer Information" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <Label required>Customer Name</Label>
                  <Input
                    icon={User}
                    value={invoice.customerName}
                    onChange={e => setField('customerName', e.target.value)}
                    placeholder="Ahmed Al Mansouri"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    icon={Phone}
                    value={invoice.customerPhone}
                    onChange={e => setField('customerPhone', e.target.value)}
                    placeholder="+971 50 000 0000"
                    type="tel"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Email</Label>
                  <Input
                    icon={Mail}
                    value={invoice.customerEmail}
                    onChange={e => setField('customerEmail', e.target.value)}
                    placeholder="ahmed@example.com"
                    type="email"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Vehicle Info */}
            <SectionCard title="Vehicle Details" icon={Car}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Make</Label>
                  <Input
                    value={invoice.vehicleMake}
                    onChange={e => setField('vehicleMake', e.target.value)}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={invoice.vehicleModel}
                    onChange={e => setField('vehicleModel', e.target.value)}
                    placeholder="Camry"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={invoice.vehicleYear}
                    onChange={e => setField('vehicleYear', e.target.value)}
                    placeholder="2023"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label>Plate</Label>
                  <Input
                    value={invoice.vehiclePlate}
                    onChange={e => setField('vehiclePlate', e.target.value)}
                    placeholder="AD 12345"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Line Items */}
            <SectionCard title="Line Items" icon={ClipboardList}>
              {/* Preset picker */}
              <div className="mb-5">
                <button
                  onClick={() => setShowPresets(v => !v)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E62329] hover:text-[#c41e24] transition-colors"
                >
                  <Tag size={12} />
                  Add from service presets
                  <ChevronDown size={12} className={cn('transition-transform', showPresets && 'rotate-180')} />
                </button>

                {showPresets && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {SERVICE_PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => addPreset(preset)}
                        className="group relative text-left bg-gray-50 hover:bg-[#E62329]/5 border border-gray-200 hover:border-[#E62329]/30 rounded-xl px-3 py-2.5 transition-all"
                      >
                        <p className="text-[10px] font-black text-[#121212] group-hover:text-[#E62329] transition-colors uppercase tracking-wide leading-tight">{preset.label}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 font-medium">AED {formatAED(preset.price)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_70px_110px_80px_60px_36px] gap-2 mb-2 px-1">
                {['Description', 'Qty', 'Unit Price', 'Disc%', 'VAT', ''].map(h => (
                  <span key={h} className="text-[9px] font-black uppercase tracking-widest text-gray-400">{h}</span>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_70px_110px_80px_60px_36px] gap-2 items-center bg-gray-50/70 rounded-xl p-2 border border-gray-100 hover:border-gray-200 transition-all"
                  >
                    {/* Description */}
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => setItemField(item.id, 'description', e.target.value)}
                      placeholder={`Service or part description…`}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#121212] placeholder:text-gray-300 focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329] outline-none bg-white transition-all"
                    />
                    {/* Qty */}
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={item.qty}
                      onChange={e => setItemField(item.id, 'qty', Math.max(0.5, parseFloat(e.target.value) || 1))}
                      className="w-full px-2 py-2 rounded-lg border border-gray-200 text-sm text-center text-[#121212] focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329] outline-none bg-white transition-all"
                    />
                    {/* Unit Price */}
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">AED</span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={item.unitPrice}
                        onChange={e => setItemField(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full pl-9 pr-2 py-2 rounded-lg border border-gray-200 text-sm text-right text-[#121212] focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329] outline-none bg-white transition-all"
                      />
                    </div>
                    {/* Discount */}
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={item.discount}
                        onChange={e => setItemField(item.id, 'discount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-full pl-2 pr-6 py-2 rounded-lg border border-gray-200 text-sm text-right text-[#121212] focus:ring-2 focus:ring-[#E62329]/20 focus:border-[#E62329] outline-none bg-white transition-all"
                      />
                      <Percent size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Taxable toggle */}
                    <button
                      type="button"
                      onClick={() => setItemField(item.id, 'taxable', !item.taxable)}
                      className={cn(
                        'flex items-center justify-center gap-1 py-2 rounded-lg border text-[9px] font-black uppercase tracking-wide transition-all w-full',
                        item.taxable
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-gray-100 border-gray-200 text-gray-400',
                      )}
                      title={item.taxable ? 'VAT applied' : 'VAT exempt — click to toggle'}
                    >
                      {item.taxable ? <BadgeCheck size={10} /> : <X size={10} />}
                      {item.taxable ? 'VAT' : 'Excl'}
                    </button>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={invoice.items.length === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-transparent text-gray-300 hover:text-[#E62329] hover:border-[#E62329]/20 hover:bg-[#E62329]/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Remove line item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add row */}
              <button
                onClick={addItem}
                className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#121212] transition-colors px-1"
              >
                <Plus size={13} /> Add line item
              </button>
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Notes & Terms" icon={StickyNote}>
              <Textarea
                value={invoice.notes}
                onChange={e => setField('notes', e.target.value)}
                placeholder="e.g. Payment is due within 30 days. Warranty: 3 months on parts and labour. Thank you for your business!"
                rows={4}
              />
            </SectionCard>
          </div>

          {/* ── Right sidebar: Summary ──────────────────────── */}
          <div className="xl:sticky xl:top-8 space-y-4">

            {/* Summary card — dark */}
            <div className="bg-[#121212] rounded-2xl p-6 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-5">Invoice Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Subtotal</span>
                  <span className="text-sm font-bold">AED {formatAED(totals.subtotal)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#E62329]/80">Discount</span>
                    <span className="text-sm font-bold text-[#E62329]">− AED {formatAED(totals.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">VAT (5%)</span>
                  <span className="text-sm font-bold">AED {formatAED(totals.vat)}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-base font-black uppercase tracking-wide">Total</span>
                  <span className="text-2xl font-black text-white">AED {formatAED(totals.total)}</span>
                </div>
              </div>

              {/* Item count */}
              <div className="mt-5 flex items-center gap-2">
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-center">
                  <p className="text-xl font-black text-white">{invoice.items.length}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Line Items</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-center">
                  <p className="text-xl font-black text-white">{invoice.items.filter(i => i.taxable).length}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-0.5">Taxable</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-center">
                  <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase', statusCfg.bg, statusCfg.color)}>
                    <statusCfg.icon size={8} />
                    {statusCfg.label}
                  </div>
                  <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Status</p>
                </div>
              </div>
            </div>

            {/* Actions card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Actions</h3>

              <button
                onClick={() => setShowPreview(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#E62329] hover:bg-[#c41e24] text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#E62329]/20"
              >
                <Eye size={13} /> Preview Invoice
              </button>

              <button
                onClick={copyTotal}
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all border',
                  copiedTotal
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400 hover:text-[#121212]',
                )}
              >
                {copiedTotal ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                {copiedTotal ? 'Copied!' : 'Copy Total'}
              </button>

              <button
                onClick={addItem}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:border-[#121212] hover:text-[#121212] rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Plus size={13} /> Add Line Item
              </button>
            </div>

            {/* Company info card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Bill From</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[#E62329] font-black text-lg tracking-tighter italic">Smart</span>
                <span className="text-[#121212] font-black text-lg tracking-tighter italic">Motor</span>
              </div>
              <div className="text-[11px] text-gray-500 space-y-0.5 font-medium">
                <p>M9 Musaffah, Abu Dhabi</p>
                <p>United Arab Emirates</p>
                <p className="mt-1.5">📞 800 76278</p>
                <p>✉️ info@smartmotor.ae</p>
                <p>🌐 www.smartmotor.ae</p>
              </div>
            </div>

            {/* Quick tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-3">Tips</p>
              <ul className="text-[11px] text-blue-700/80 space-y-1.5 font-medium leading-snug">
                <li>• Use presets to quickly add common services</li>
                <li>• Toggle VAT per line item as needed</li>
                <li>• Preview → Print saves as PDF via browser</li>
                <li>• Discount applies per-line before VAT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Print Preview Modal ────────────────────────────────── */}
      {showPreview && (
        <PrintModal
          invoice={invoice}
          totals={totals}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
