'use client'

import { useState, useCallback } from 'react'
import { Calculator, Plus, Trash2, Copy, Download, RefreshCw, ChevronDown, Tag } from 'lucide-react'
import { toast } from 'sonner'

// ─── preset service items ─────────────────────────────────────────────────────
const PRESETS: Record<string, { name: string; price: number; taxable: boolean }[]> = {
    'Oil Service': [
        { name: 'Engine Oil (5L synthetic)', price: 180, taxable: true },
        { name: 'Oil Filter', price: 45, taxable: true },
        { name: 'Labour', price: 80, taxable: true },
    ],
    'Brake Service': [
        { name: 'Front Brake Pads (OEM)', price: 320, taxable: true },
        { name: 'Rear Brake Pads (OEM)', price: 280, taxable: true },
        { name: 'Brake Fluid', price: 60, taxable: true },
        { name: 'Labour', price: 250, taxable: true },
    ],
    'AC Regas': [
        { name: 'Refrigerant Gas (R134a)', price: 120, taxable: true },
        { name: 'AC Filter', price: 95, taxable: true },
        { name: 'Labour', price: 150, taxable: true },
    ],
    'Tyre Change (4x)': [
        { name: 'Tyre x4', price: 1200, taxable: true },
        { name: 'Wheel Balancing', price: 120, taxable: true },
        { name: 'Valve Stems', price: 40, taxable: true },
        { name: 'Labour', price: 160, taxable: true },
    ],
    'Full Detail': [
        { name: 'Interior Deep Clean', price: 350, taxable: true },
        { name: 'Exterior Polish', price: 450, taxable: true },
        { name: 'Engine Bay Clean', price: 150, taxable: true },
    ],
}

interface LineItem {
    id: string
    name: string
    qty: number
    price: number
    discount: number   // %
    taxable: boolean
}

const TAX_RATE = 0.05  // UAE VAT 5%

function uid() { return Math.random().toString(36).slice(2, 9) }

function emptyItem(): LineItem {
    return { id: uid(), name: '', qty: 1, price: 0, discount: 0, taxable: true }
}

export default function CalculatorPage() {
    const [items, setItems] = useState<LineItem[]>([emptyItem()])
    const [showPresets, setShowPresets] = useState(false)
    const [vatEnabled, setVatEnabled] = useState(true)
    const [globalDiscount, setGlobalDiscount] = useState(0)

    // ── calculations ──────────────────────────────────────────────────────────
    const subtotal = items.reduce((sum, it) => {
        const lineNet = it.qty * it.price * (1 - it.discount / 100)
        return sum + lineNet
    }, 0)

    const afterGlobalDiscount = subtotal * (1 - globalDiscount / 100)

    const taxableBase = vatEnabled
        ? items.reduce((sum, it) => {
            if (!it.taxable) return sum
            return sum + it.qty * it.price * (1 - it.discount / 100)
        }, 0) * (1 - globalDiscount / 100)
        : 0

    const vat = taxableBase * TAX_RATE
    const total = afterGlobalDiscount + vat

    // ── item mutations ────────────────────────────────────────────────────────
    const updateItem = useCallback((id: string, field: keyof LineItem, value: any) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it))
    }, [])

    const addItem = () => setItems(prev => [...prev, emptyItem()])
    const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id))

    const applyPreset = (key: string) => {
        const preset = PRESETS[key]
        setItems(preset.map(p => ({ id: uid(), qty: 1, discount: 0, ...p })))
        setShowPresets(false)
        toast.success(`Loaded "${key}" preset`)
    }

    const clearAll = () => { setItems([emptyItem()]); setGlobalDiscount(0) }

    const copyTotal = () => {
        navigator.clipboard.writeText(`AED ${total.toFixed(2)}`)
        toast.success('Total copied to clipboard')
    }

    const downloadQuote = () => {
        const lines = [
            'SMART MOTOR AUTO CARE',
            'Quote Summary',
            '─────────────────────────────',
            ...items.filter(it => it.name).map(it => {
                const net = it.qty * it.price * (1 - it.discount / 100)
                return `${it.name.padEnd(28)} ${it.qty} x AED${it.price.toFixed(2)}${it.discount ? ` (-${it.discount}%)` : ''} = AED${net.toFixed(2)}`
            }),
            '─────────────────────────────',
            `Subtotal:                    AED ${subtotal.toFixed(2)}`,
            globalDiscount > 0 ? `Discount (${globalDiscount}%):           -AED ${(subtotal - afterGlobalDiscount).toFixed(2)}` : '',
            vatEnabled ? `VAT (5%):                    AED ${vat.toFixed(2)}` : '',
            `TOTAL:                       AED ${total.toFixed(2)}`,
        ].filter(Boolean).join('\n')

        const blob = new Blob([lines], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'smart-motor-quote.txt'; a.click()
        URL.revokeObjectURL(url)
        toast.success('Quote downloaded')
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E62329]/10 rounded-xl flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-[#E62329]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#121212] uppercase tracking-tight">Service Calculator</h1>
                        <p className="text-xs text-gray-400 font-medium">Build quotes & estimates</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Preset picker */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPresets(v => !v)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#121212] transition-colors"
                        >
                            <Tag size={13} /> Presets <ChevronDown size={13} className={showPresets ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </button>
                        {showPresets && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 min-w-[200px] overflow-hidden">
                                {Object.keys(PRESETS).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => applyPreset(key)}
                                        className="w-full text-left px-5 py-3 text-xs font-bold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-red-300 hover:text-red-500 transition-colors">
                        <RefreshCw size={13} /> Clear
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Line items ─────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Column headers */}
                    <div className="grid grid-cols-12 gap-2 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <div className="col-span-4">Item</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-center">Price (AED)</div>
                        <div className="col-span-2 text-center">Disc %</div>
                        <div className="col-span-1 text-center">VAT</div>
                        <div className="col-span-1" />
                    </div>

                    {items.map((item, idx) => {
                        const lineTotal = item.qty * item.price * (1 - item.discount / 100)
                        return (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-gray-200 transition-colors">
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    {/* Name */}
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            placeholder={`Item ${idx + 1}`}
                                            value={item.name}
                                            onChange={e => updateItem(item.id, 'name', e.target.value)}
                                            className="w-full text-sm font-bold text-[#121212] placeholder:text-gray-300 bg-transparent border-b border-transparent focus:border-[#E62329] outline-none transition-colors py-1"
                                        />
                                    </div>
                                    {/* Qty */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0.1" step="0.1"
                                            value={item.qty}
                                            onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                            className="w-full text-center text-sm font-bold text-[#121212] bg-gray-50 rounded-lg px-2 py-1.5 border border-transparent focus:border-[#E62329] outline-none"
                                        />
                                    </div>
                                    {/* Price */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0" step="0.01"
                                            value={item.price}
                                            onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full text-center text-sm font-bold text-[#121212] bg-gray-50 rounded-lg px-2 py-1.5 border border-transparent focus:border-[#E62329] outline-none"
                                        />
                                    </div>
                                    {/* Discount */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0" max="100" step="1"
                                            value={item.discount}
                                            onChange={e => updateItem(item.id, 'discount', Math.min(100, parseFloat(e.target.value) || 0))}
                                            className="w-full text-center text-sm font-bold text-[#121212] bg-gray-50 rounded-lg px-2 py-1.5 border border-transparent focus:border-[#E62329] outline-none"
                                        />
                                    </div>
                                    {/* VAT toggle */}
                                    <div className="col-span-1 flex justify-center">
                                        <button
                                            onClick={() => updateItem(item.id, 'taxable', !item.taxable)}
                                            className={`w-8 h-4 rounded-full transition-colors relative ${item.taxable ? 'bg-[#E62329]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${item.taxable ? 'left-[18px]' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                    {/* Delete */}
                                    <div className="col-span-1 flex justify-center">
                                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {/* Line total */}
                                {(item.name || item.price > 0) && (
                                    <div className="mt-2 pt-2 border-t border-gray-50 text-right text-xs font-black text-[#121212]">
                                        AED {lineTotal.toFixed(2)}
                                        {item.discount > 0 && (
                                            <span className="ml-2 text-[10px] text-green-500 font-bold">
                                                saved AED {(item.qty * item.price * item.discount / 100).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <button
                        onClick={addItem}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:border-[#E62329] hover:text-[#E62329] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> Add Line Item
                    </button>
                </div>

                {/* ── Summary panel ──────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="bg-[#121212] rounded-3xl p-6 text-white space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Quote Summary</p>

                        <div className="space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60 font-medium">Subtotal</span>
                                <span className="font-black">AED {subtotal.toFixed(2)}</span>
                            </div>

                            {/* Global discount */}
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm font-medium">Discount</span>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min="0" max="100"
                                        value={globalDiscount}
                                        onChange={e => setGlobalDiscount(Math.min(100, parseFloat(e.target.value) || 0))}
                                        className="w-16 text-right text-sm font-black bg-white/10 rounded-lg px-2 py-1 text-white border border-transparent focus:border-white/30 outline-none"
                                    />
                                    <span className="text-white/50 text-xs">%</span>
                                </div>
                            </div>

                            {globalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-400">
                                    <span>Saving</span>
                                    <span className="font-black">-AED {(subtotal - afterGlobalDiscount).toFixed(2)}</span>
                                </div>
                            )}

                            {/* VAT toggle */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="text-white/60 text-sm font-medium">VAT 5%</span>
                                    <button
                                        onClick={() => setVatEnabled(v => !v)}
                                        className={`w-9 h-5 rounded-full transition-colors relative ${vatEnabled ? 'bg-[#E62329]' : 'bg-white/20'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${vatEnabled ? 'left-[20px]' : 'left-0.5'}`} />
                                    </button>
                                </div>
                                <span className={`text-sm font-black ${vatEnabled ? 'text-white' : 'text-white/30'}`}>
                                    AED {vat.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Total</span>
                                <span className="text-3xl font-black tracking-tighter">AED {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <button onClick={copyTotal} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                                <Copy size={13} /> Copy
                            </button>
                            <button onClick={downloadQuote} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E62329] hover:bg-[#c41f25] rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                                <Download size={13} /> Export
                            </button>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Breakdown</p>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Line items</span>
                                <span className="font-black text-[#121212]">{items.filter(i => i.name).length}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Parts total</span>
                                <span className="font-black text-[#121212]">AED {items.filter(i => i.name && !i.name.toLowerCase().includes('labour')).reduce((s, i) => s + i.qty * i.price * (1 - i.discount / 100), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Labour total</span>
                                <span className="font-black text-[#121212]">AED {items.filter(i => i.name.toLowerCase().includes('labour')).reduce((s, i) => s + i.qty * i.price * (1 - i.discount / 100), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-1.5 border-t border-gray-50">
                                <span className="text-gray-400">Margin (est. 30%)</span>
                                <span className="font-black text-green-600">AED {(subtotal * 0.3).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
