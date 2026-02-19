'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Palette,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  Code2,
  Layers,
  Droplets,
  Sliders,
} from 'lucide-react'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CustomColor {
  id: string
  name: string
  hex: string
}

type Tab = 'brand' | 'custom' | 'combos' | 'tints' | 'css'

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Parse a 6-char hex string into [r, g, b] */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

/** Convert [r, g, b] to CSS hex */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
      .join('')
  )
}

/** Convert [r, g, b] to HSL string */
function rgbToHsl(r: number, g: number, b: number): string {
  const r1 = r / 255
  const g1 = g / 255
  const b1 = b / 255
  const max = Math.max(r1, g1, b1)
  const min = Math.min(r1, g1, b1)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break
      case g1: h = ((b1 - r1) / d + 2) / 6; break
      case b1: h = ((r1 - g1) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

/** WCAG relative luminance */
function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** Contrast ratio between two hex colours */
function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1)
  const [r2, g2, b2] = hexToRgb(hex2)
  const l1 = luminance(r1, g1, b1)
  const l2 = luminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG label */
function wcagLabel(ratio: number): { label: string; color: string } {
  if (ratio >= 7) return { label: 'AAA', color: '#16a34a' }
  if (ratio >= 4.5) return { label: 'AA', color: '#ca8a04' }
  if (ratio >= 3) return { label: 'AA Large', color: '#ea580c' }
  return { label: 'Fail', color: '#dc2626' }
}

/** Mix a hex colour with white (positive pct) or black (negative pct) */
function mixWithWhite(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    r + (255 - r) * pct,
    g + (255 - g) * pct,
    b + (255 - b) * pct,
  )
}

function mixWithBlack(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - pct), g * (1 - pct), b * (1 - pct))
}

/** Copy text to clipboard */
async function copyToClipboard(text: string, label?: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(label ? `${label} copied!` : 'Copied!')
  } catch {
    toast.error('Copy failed — try manually')
  }
}

// ---------------------------------------------------------------------------
// Brand palette data
// ---------------------------------------------------------------------------
const BRAND_COLORS = [
  { name: 'Smart Motor Red', hex: '#E62329', role: 'Primary' },
  { name: 'Dark', hex: '#121212', role: 'Text / BG' },
  { name: 'Light BG', hex: '#FAFAF9', role: 'Background' },
  { name: 'White', hex: '#FFFFFF', role: 'Surface' },
  { name: 'Accent Gold', hex: '#C4962A', role: 'Accent' },
]

// Pre-built colour combos
const COLOR_COMBOS = [
  { name: 'Red on Dark', fg: '#E62329', bg: '#121212' },
  { name: 'White on Red', fg: '#FFFFFF', bg: '#E62329' },
  { name: 'Dark on Light', fg: '#121212', bg: '#FAFAF9' },
  { name: 'White on Dark', fg: '#FFFFFF', bg: '#121212' },
  { name: 'Gold on Dark', fg: '#C4962A', bg: '#121212' },
  { name: 'Dark on White', fg: '#121212', bg: '#FFFFFF' },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A single colour swatch with copy buttons */
function ColorSwatch({
  hex,
  name,
  role,
  size = 'md',
}: {
  hex: string
  name: string
  role?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [r, g, b] = hexToRgb(hex)
  const isLight = luminance(r, g, b) > 0.35
  const textCls = isLight ? 'text-[#121212]' : 'text-white'

  const formats: { key: string; label: string; value: string }[] = [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { key: 'hsl', label: 'HSL', value: rgbToHsl(r, g, b) },
  ]

  const handleCopy = async (key: string, value: string) => {
    await copyToClipboard(value, key.toUpperCase())
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1800)
  }

  const swatchH =
    size === 'sm' ? 'h-16' : size === 'lg' ? 'h-40' : 'h-28'

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      {/* Colour block */}
      <div
        className={`${swatchH} flex flex-col justify-end p-3 relative`}
        style={{ backgroundColor: hex }}
      >
        {role && (
          <span
            className={`text-[9px] font-black uppercase tracking-widest opacity-70 ${textCls}`}
          >
            {role}
          </span>
        )}
        <span className={`text-sm font-black leading-tight ${textCls}`}>
          {name}
        </span>
      </div>

      {/* Info + copy buttons */}
      <div className="p-3 space-y-2">
        {formats.map(({ key, label, value }) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                {label}
              </span>
              <p className="text-[11px] text-gray-700 font-mono leading-tight">
                {value}
              </p>
            </div>
            <button
              onClick={() => handleCopy(key, value)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#E62329]"
              title={`Copy ${label}`}
            >
              {copiedKey === key ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Contrast combo card */
function ComboCard({ fg, bg, name }: { fg: string; bg: string; name: string }) {
  const ratio = contrastRatio(fg, bg)
  const { label, color } = wcagLabel(ratio)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Preview */}
      <div
        className="h-24 flex items-center justify-center px-4"
        style={{ backgroundColor: bg }}
      >
        <span
          className="text-lg font-black uppercase tracking-tighter"
          style={{ color: fg }}
        >
          Smart Motor
        </span>
      </div>

      {/* Details */}
      <div className="bg-white p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#121212]">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-3.5 h-3.5 rounded-full border border-gray-200"
              style={{ backgroundColor: fg }}
              title={`FG: ${fg}`}
            />
            <div
              className="w-3.5 h-3.5 rounded-full border border-gray-200"
              style={{ backgroundColor: bg }}
              title={`BG: ${bg}`}
            />
            <span className="text-[10px] text-gray-400 font-mono">
              {fg} / {bg}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className="text-[10px] font-black uppercase px-2 py-1 rounded-full"
            style={{ backgroundColor: color + '20', color }}
          >
            {label}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">{ratio.toFixed(2)}:1</p>
        </div>
      </div>
    </div>
  )
}

/** Tint/shade chip */
function TintChip({
  hex,
  label,
  base,
}: {
  hex: string
  label: string
  base?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [r, g, b] = hexToRgb(hex)
  const isLight = luminance(r, g, b) > 0.35
  const textCls = isLight ? 'text-[#121212]/70' : 'text-white/80'

  const handleCopy = async () => {
    await copyToClipboard(hex.toUpperCase())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      title={`${hex.toUpperCase()} — click to copy`}
      className={`relative flex flex-col items-center justify-end h-20 rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-lg ${
        base ? 'ring-2 ring-offset-2 ring-[#121212]' : ''
      }`}
      style={{ backgroundColor: hex }}
    >
      <span className={`text-[9px] font-black mb-1 ${textCls}`}>{label}</span>
      {copied && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check size={14} className={isLight ? 'text-[#121212]' : 'text-white'} />
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function ColorPalettePage() {
  const [activeTab, setActiveTab] = useState<Tab>('brand')
  const [customColors, setCustomColors] = useState<CustomColor[]>([
    { id: '1', name: 'Sky Blue', hex: '#3B82F6' },
    { id: '2', name: 'Success Green', hex: '#22C55E' },
  ])
  const [newColorHex, setNewColorHex] = useState('#6366F1')
  const [newColorName, setNewColorName] = useState('')

  // Tint generator
  const [tintBase, setTintBase] = useState('#E62329')
  const [cssCopied, setCssCopied] = useState(false)

  // Tints & shades derived from tintBase
  const tints = useMemo(
    () =>
      [10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => ({
        label: `${pct}%`,
        hex: mixWithWhite(tintBase, pct / 100),
      })),
    [tintBase],
  )

  const shades = useMemo(
    () =>
      [10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => ({
        label: `${pct}%`,
        hex: mixWithBlack(tintBase, pct / 100),
      })),
    [tintBase],
  )

  // CSS export block
  const cssBlock = useMemo(() => {
    const lines: string[] = [':root {']
    BRAND_COLORS.forEach(({ name, hex }) => {
      const varName = '--color-' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      lines.push(`  ${varName}: ${hex.toUpperCase()};`)
    })
    if (customColors.length) {
      lines.push('')
      customColors.forEach(({ name, hex }) => {
        const varName = '--color-custom-' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        lines.push(`  ${varName}: ${hex.toUpperCase()};`)
      })
    }
    lines.push('}')
    return lines.join('\n')
  }, [customColors])

  // Add custom colour
  const handleAddColor = useCallback(() => {
    const name = newColorName.trim() || 'Custom ' + (customColors.length + 1)
    setCustomColors((prev) => [
      ...prev,
      { id: Date.now().toString(), name, hex: newColorHex },
    ])
    setNewColorName('')
    toast.success(`"${name}" added to custom palette`)
  }, [newColorHex, newColorName, customColors.length])

  // Delete custom colour
  const handleDeleteColor = useCallback((id: string) => {
    setCustomColors((prev) => prev.filter((c) => c.id !== id))
    toast.success('Color removed')
  }, [])

  // Export custom palette as JSON
  const handleExportJSON = useCallback(() => {
    const data = customColors.map(({ name, hex }) => ({ name, hex }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'smartmotor-custom-palette.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('JSON exported!')
  }, [customColors])

  // Export custom palette as CSS
  const handleExportCSS = useCallback(() => {
    const lines = [':root {']
    customColors.forEach(({ name, hex }) => {
      const varName = '--color-' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      lines.push(`  ${varName}: ${hex.toUpperCase()};`)
    })
    lines.push('}')
    const blob = new Blob([lines.join('\n')], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'smartmotor-custom-palette.css'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSS exported!')
  }, [customColors])

  // Copy full CSS block
  const handleCopyCSS = useCallback(async () => {
    await copyToClipboard(cssBlock, 'CSS variables')
    setCssCopied(true)
    setTimeout(() => setCssCopied(false), 2000)
  }, [cssBlock])

  // ---------------------------------------------------------------------------
  // Tabs config
  // ---------------------------------------------------------------------------
  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'brand', label: 'Brand Palette', icon: Palette },
    { id: 'custom', label: 'Custom Colors', icon: Droplets },
    { id: 'combos', label: 'Color Combos', icon: Layers },
    { id: 'tints', label: 'Tints & Shades', icon: Sliders },
    { id: 'css', label: 'CSS Export', icon: Code2 },
  ]

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#121212] italic">
            Color Palette Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Brand colors, custom palettes, contrast checker, tint &amp; shade generator
          </p>
        </div>
        {/* Quick brand strip */}
        <div className="flex items-center gap-1.5">
          {BRAND_COLORS.map(({ hex, name }) => (
            <button
              key={hex}
              title={name}
              onClick={() => copyToClipboard(hex.toUpperCase(), name)}
              className="w-7 h-7 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Brand Colors', value: BRAND_COLORS.length, bg: 'from-rose-50 to-red-100 border-red-200 text-red-900' },
          { label: 'Custom Colors', value: customColors.length, bg: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900' },
          { label: 'Color Combos', value: COLOR_COMBOS.length, bg: 'from-amber-50 to-amber-100 border-amber-200 text-amber-900' },
          {
            label: 'AA+ Combos',
            value: COLOR_COMBOS.filter((c) => contrastRatio(c.fg, c.bg) >= 4.5).length,
            bg: 'from-green-50 to-green-100 border-green-200 text-green-900',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br rounded-2xl p-5 border ${stat.bg}`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
              {stat.label}
            </p>
            <p className="text-4xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-gray-100/80 rounded-2xl p-1 overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
              activeTab === id
                ? 'bg-white shadow text-[#121212]'
                : 'text-gray-500 hover:text-[#121212]'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}

      {/* Brand Palette */}
      {activeTab === 'brand' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-5">
              Smart Motor Brand Colors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {BRAND_COLORS.map((c) => (
                <ColorSwatch key={c.hex} {...c} size="lg" />
              ))}
            </div>
          </div>

          {/* Horizontal preview strip */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-5">
              Palette Preview Strip
            </h2>
            <div className="flex rounded-2xl overflow-hidden h-24 shadow-md">
              {BRAND_COLORS.map(({ hex, name }) => (
                <div
                  key={hex}
                  className="flex-1 flex items-end p-3"
                  style={{ backgroundColor: hex }}
                  title={name}
                />
              ))}
            </div>
            <div className="flex mt-2">
              {BRAND_COLORS.map(({ hex, name }) => (
                <div key={hex} className="flex-1 text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-500 truncate px-1">
                    {name}
                  </p>
                  <p className="text-[9px] font-mono text-gray-400">{hex.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Colors */}
      {activeTab === 'custom' && (
        <section className="space-y-6">
          {/* Add color form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-5">
              Add Custom Color
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Color picker */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Pick Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer p-0.5"
                    style={{ backgroundColor: newColorHex }}
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => {
                      const v = e.target.value
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setNewColorHex(v)
                    }}
                    className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Color Name
                </label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                  placeholder="e.g. Ocean Blue"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                />
              </div>

              <button
                onClick={handleAddColor}
                className="flex items-center gap-2 bg-[#E62329] hover:bg-[#c41e24] text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg whitespace-nowrap"
              >
                <Plus size={14} />
                Add Color
              </button>
            </div>
          </div>

          {/* Custom palette grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">
                Custom Palette ({customColors.length})
              </h2>
              {customColors.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-600 hover:border-[#121212] transition-all"
                  >
                    <Download size={12} /> JSON
                  </button>
                  <button
                    onClick={handleExportCSS}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-600 hover:border-[#121212] transition-all"
                  >
                    <Download size={12} /> CSS
                  </button>
                </div>
              )}
            </div>

            {customColors.length === 0 ? (
              <div className="text-center py-16 text-gray-300">
                <Droplets size={40} className="mx-auto mb-4 opacity-40" />
                <p className="font-black uppercase tracking-widest text-sm">No custom colors yet</p>
                <p className="text-xs mt-1">Add your first color above</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {customColors.map((c) => (
                  <div key={c.id} className="relative group">
                    <ColorSwatch hex={c.hex} name={c.name} />
                    <button
                      onClick={() => handleDeleteColor(c.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow"
                      title="Remove"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Color Combos */}
      {activeTab === 'combos' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-2">
              Color Combination Contrast Checker
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              WCAG 2.1 contrast ratios — AA requires 4.5:1 (normal text), AAA requires 7:1.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLOR_COMBOS.map((combo) => (
                <ComboCard key={combo.name} {...combo} />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-4">
              WCAG Levels Explained
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { level: 'AAA', ratio: '≥ 7:1', note: 'Enhanced — ideal for body text', color: '#16a34a' },
                { level: 'AA', ratio: '≥ 4.5:1', note: 'Standard — required for normal text', color: '#ca8a04' },
                { level: 'AA Large', ratio: '≥ 3:1', note: 'Large text (18px+ or 14px bold)', color: '#ea580c' },
                { level: 'Fail', ratio: '< 3:1', note: 'Insufficient contrast', color: '#dc2626' },
              ].map((item) => (
                <div
                  key={item.level}
                  className="rounded-xl p-4 border"
                  style={{ borderColor: item.color + '40', backgroundColor: item.color + '10' }}
                >
                  <span
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color: item.color }}
                  >
                    {item.level}
                  </span>
                  <p className="text-sm font-black text-[#121212] mt-1">{item.ratio}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tints & Shades */}
      {activeTab === 'tints' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-5">
              Tint &amp; Shade Generator
            </h2>

            {/* Base color picker */}
            <div className="flex items-end gap-4 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Base Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tintBase}
                    onChange={(e) => setTintBase(e.target.value)}
                    className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tintBase}
                    onChange={(e) => {
                      const v = e.target.value
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setTintBase(v)
                    }}
                    className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
                    maxLength={7}
                  />
                </div>
              </div>
              {/* Quick presets */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Brand Presets
                </label>
                <div className="flex gap-2">
                  {BRAND_COLORS.map(({ hex, name }) => (
                    <button
                      key={hex}
                      title={name}
                      onClick={() => setTintBase(hex)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        tintBase.toLowerCase() === hex.toLowerCase()
                          ? 'border-[#121212] shadow-lg scale-110'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tints */}
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Tints — mixed with white (click any chip to copy hex)
              </p>
              <div className="grid grid-cols-9 gap-2">
                {tints.map(({ hex, label }) => (
                  <TintChip key={label} hex={hex} label={label} />
                ))}
              </div>
            </div>

            {/* Base */}
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Base
              </p>
              <div className="grid grid-cols-9 gap-2">
                <TintChip hex={tintBase} label="Base" base />
                <div className="col-span-8" />
              </div>
            </div>

            {/* Shades */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Shades — mixed with black (click any chip to copy hex)
              </p>
              <div className="grid grid-cols-9 gap-2">
                {shades.map(({ hex, label }) => (
                  <TintChip key={label} hex={hex} label={label} />
                ))}
              </div>
            </div>
          </div>

          {/* Generated hex list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-4">
              All Generated Values
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Type', 'Step', 'HEX', 'RGB', 'HSL'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[9px] font-black uppercase tracking-widest text-gray-400 pb-2 pr-6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...tints.map((t, i) => ({ type: 'Tint', ...t, step: i + 1 })),
                    { type: 'Base', hex: tintBase, label: '—', step: 0 },
                    ...shades.map((s, i) => ({ type: 'Shade', ...s, step: i + 1 })),
                  ].map((row, idx) => {
                    const [r, g, b] = hexToRgb(row.hex)
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-1.5 pr-6">
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              row.type === 'Tint'
                                ? 'bg-blue-50 text-blue-600'
                                : row.type === 'Base'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-[#121212]/10 text-[#121212]'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-1.5 pr-6 text-gray-500">{row.label}</td>
                        <td className="py-1.5 pr-6">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: row.hex }}
                            />
                            <span
                              className="font-mono cursor-pointer hover:text-[#E62329] transition-colors"
                              onClick={() => copyToClipboard(row.hex.toUpperCase())}
                            >
                              {row.hex.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-1.5 pr-6 font-mono text-gray-500">
                          rgb({r}, {g}, {b})
                        </td>
                        <td className="py-1.5 font-mono text-gray-500">{rgbToHsl(r, g, b)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* CSS Export */}
      {activeTab === 'css' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">
                  CSS Custom Properties
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Ready-to-use CSS variables for all brand and custom colors
                </p>
              </div>
              <button
                onClick={handleCopyCSS}
                className="flex items-center gap-2 bg-[#121212] hover:bg-[#E62329] text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg"
              >
                {cssCopied ? <Check size={14} /> : <Copy size={14} />}
                {cssCopied ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <pre className="bg-[#121212] text-[#FAFAF9] rounded-2xl p-6 text-xs font-mono leading-relaxed overflow-x-auto">
              {cssBlock.split('\n').map((line, i) => {
                if (line === ':root {' || line === '}') {
                  return (
                    <span key={i} className="text-[#C4962A] block">
                      {line}
                      {'\n'}
                    </span>
                  )
                }
                if (line === '') {
                  return <span key={i} className="block">{'\n'}</span>
                }
                const match = line.match(/^(\s*)(--[\w-]+)(\s*:\s*)(.+)(;)$/)
                if (match) {
                  return (
                    <span key={i} className="block">
                      <span>{match[1]}</span>
                      <span className="text-[#E62329]">{match[2]}</span>
                      <span className="text-gray-400">{match[3]}</span>
                      <span className="text-[#FAFAF9]">{match[4]}</span>
                      <span className="text-gray-500">{match[5]}</span>
                      {'\n'}
                    </span>
                  )
                }
                return (
                  <span key={i} className="block">
                    {line}
                    {'\n'}
                  </span>
                )
              })}
            </pre>
          </div>

          {/* Usage examples */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-5">
              Usage Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Tailwind Config Extension',
                  code: `// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'sm-red':   'var(--color-smart-motor-red)',
      'sm-dark':  'var(--color-dark)',
      'sm-light': 'var(--color-light-bg)',
      'sm-gold':  'var(--color-accent-gold)',
    }
  }
}`,
                },
                {
                  title: 'CSS Usage',
                  code: `.button-primary {
  background-color: var(--color-smart-motor-red);
  color: var(--color-white);
}

.hero {
  background: var(--color-dark);
  color: var(--color-light-bg);
}`,
                },
              ].map(({ title, code }) => (
                <div key={title}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    {title}
                  </p>
                  <pre className="bg-[#121212] text-[#FAFAF9] rounded-xl p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
                    {code}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Download buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-4">
              Download
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: 'Download CSS Variables',
                  icon: Download,
                  action: () => {
                    const blob = new Blob([cssBlock], { type: 'text/css' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'smartmotor-colors.css'
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('CSS file downloaded!')
                  },
                },
                {
                  label: 'Download JSON Palette',
                  icon: Download,
                  action: () => {
                    const all = [
                      ...BRAND_COLORS.map(({ name, hex }) => ({ name, hex, type: 'brand' })),
                      ...customColors.map(({ name, hex }) => ({ name, hex, type: 'custom' })),
                    ]
                    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'smartmotor-palette.json'
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('JSON palette downloaded!')
                  },
                },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-[#121212] hover:text-white hover:border-[#121212] transition-all"
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dark summary footer bar ── */}
      <div className="bg-[#121212] rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Palette size={16} className="text-[#C4962A]" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            Smart Motor Color System
          </span>
          <span className="text-[10px] text-gray-500">
            {BRAND_COLORS.length} brand · {customColors.length} custom · {COLOR_COMBOS.length} combos
          </span>
        </div>
        <div className="flex items-center gap-2">
          {BRAND_COLORS.map(({ hex, name }) => (
            <div
              key={hex}
              title={`${name} ${hex.toUpperCase()}`}
              className="w-5 h-5 rounded-md border border-white/10"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
