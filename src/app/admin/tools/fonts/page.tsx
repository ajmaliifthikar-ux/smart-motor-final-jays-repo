'use client'

import { useState, useEffect } from 'react'
import { Type, RefreshCw, Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── curated pairings ─────────────────────────────────────────────────────────
interface Pairing {
  id: string
  name: string
  category: string
  heading: string
  body: string
  headingUrl: string
  bodyUrl: string
  headingWeight: string
  bodyWeight: string
  description: string
  mood: string[]
  preview: { heading: string; body: string }
}

const PAIRINGS: Pairing[] = [
  {
    id: 'p1', name: 'Classic Editorial', category: 'Serif + Sans',
    heading: 'Playfair Display', body: 'Source Sans 3',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap',
    headingWeight: '700', bodyWeight: '400',
    description: 'Timeless elegance. Great for luxury brands, editorial content, and premium services.',
    mood: ['Luxury', 'Elegant', 'Classic'],
    preview: { heading: 'Premium Automotive Excellence', body: 'We deliver world-class service with meticulous attention to detail and decades of technical expertise.' },
  },
  {
    id: 'p2', name: 'Modern Tech', category: 'Sans + Sans',
    heading: 'Inter', body: 'DM Sans',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap',
    headingWeight: '800', bodyWeight: '400',
    description: 'Clean and contemporary. Ideal for tech-forward, minimalist, or startup brands.',
    mood: ['Modern', 'Clean', 'Tech'],
    preview: { heading: 'Smart Motor Dashboard', body: 'Real-time analytics, AI-powered insights, and seamless booking management in one platform.' },
  },
  {
    id: 'p3', name: 'Bold Impact', category: 'Display + Sans',
    heading: 'Montserrat', body: 'Open Sans',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap',
    headingWeight: '900', bodyWeight: '400',
    description: 'High-energy and confident. Perfect for sports, automotive, and performance brands.',
    mood: ['Bold', 'Energetic', 'Sport'],
    preview: { heading: 'ENGINEERED FOR PERFORMANCE', body: 'Every service we perform is backed by expert technicians and genuine parts, guaranteed.' },
  },
  {
    id: 'p4', name: 'Refined Corporate', category: 'Serif + Serif',
    heading: 'Cormorant Garamond', body: 'EB Garamond',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
    headingWeight: '600', bodyWeight: '400',
    description: 'Sophisticated and literary. Suits high-end consultancies and heritage brands.',
    mood: ['Heritage', 'Refined', 'Premium'],
    preview: { heading: 'The Art of Fine Automotive Care', body: 'Since our founding, we have upheld a tradition of excellence that our clients have trusted for generations.' },
  },
  {
    id: 'p5', name: 'Geometric Modern', category: 'Geometric + Sans',
    heading: 'Raleway', body: 'Nunito',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@800&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap',
    headingWeight: '800', bodyWeight: '400',
    description: 'Geometric and approachable. Great for modern services and friendly brands.',
    mood: ['Friendly', 'Modern', 'Approachable'],
    preview: { heading: 'Your Car, Our Passion', body: 'We make car care easy, transparent, and reliable — for every driver in the UAE.' },
  },
  {
    id: 'p6', name: 'Urban Performance', category: 'Display + Mono',
    heading: 'Bebas Neue', body: 'Space Grotesk',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&display=swap',
    headingWeight: '400', bodyWeight: '400',
    description: 'Bold and urban. Perfect for performance automotive, streetwear-influenced brands.',
    mood: ['Bold', 'Urban', 'Performance'],
    preview: { heading: 'PERFORMANCE REDEFINED', body: 'Pushing boundaries with precision engineering and cutting-edge diagnostics.' },
  },
  {
    id: 'p7', name: 'Elegant Contrast', category: 'Display + Sans',
    heading: 'Josefin Sans', body: 'Lato',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
    headingWeight: '700', bodyWeight: '400',
    description: 'Elegant and versatile. Works beautifully for automotive, hospitality and lifestyle.',
    mood: ['Versatile', 'Elegant', 'Balanced'],
    preview: { heading: 'Precision in Every Detail', body: 'Our certified technicians deliver exceptional results using the latest tools and techniques.' },
  },
  {
    id: 'p8', name: 'Humanist Warmth', category: 'Slab + Sans',
    heading: 'Zilla Slab', body: 'Work Sans',
    headingUrl: 'https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@700&display=swap',
    bodyUrl:    'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500&display=swap',
    headingWeight: '700', bodyWeight: '400',
    description: 'Warm and trustworthy. Great for family-run businesses and community-focused brands.',
    mood: ['Trustworthy', 'Warm', 'Reliable'],
    preview: { heading: 'Trusted by UAE Families', body: 'Four generations of families have relied on us for honest, high-quality vehicle care.' },
  },
]

const CATEGORIES = ['All', 'Serif + Sans', 'Sans + Sans', 'Display + Sans', 'Geometric + Sans', 'Serif + Serif', 'Slab + Sans', 'Display + Mono']
const MOODS      = ['All', 'Luxury', 'Modern', 'Bold', 'Elegant', 'Urban', 'Friendly', 'Tech', 'Trustworthy']

export default function FontPairingPage() {
  const [filter, setFilter]   = useState('All')
  const [mood, setMood]       = useState('All')
  const [selected, setSelected] = useState<Pairing | null>(null)
  const [preview, setPreview]   = useState('')
  const [headingSize, setHeadingSize] = useState(36)
  const [bodySize, setBodySize]       = useState(16)
  const [copied, setCopied]   = useState(false)
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  const filtered = PAIRINGS.filter(p => {
    const catOk  = filter === 'All' || p.category === filter
    const moodOk = mood   === 'All' || p.mood.includes(mood)
    return catOk && moodOk
  })

  // Load Google Fonts dynamically
  const loadFont = (url: string) => {
    if (loadedFonts.has(url)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'; link.href = url
    document.head.appendChild(link)
    setLoadedFonts(prev => new Set([...prev, url]))
  }

  const selectPairing = (p: Pairing) => {
    setSelected(p)
    loadFont(p.headingUrl)
    loadFont(p.bodyUrl)
    if (!preview) setPreview(p.preview.body)
  }

  const copyCode = () => {
    if (!selected) return
    const code = `/* Font Pairing: ${selected.name} */
@import url('${selected.headingUrl}');
@import url('${selected.bodyUrl}');

h1, h2, h3, h4, h5, h6 {
  font-family: '${selected.heading}', serif;
  font-weight: ${selected.headingWeight};
}

body, p {
  font-family: '${selected.body}', sans-serif;
  font-weight: ${selected.bodyWeight};
}`.trim()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#121212] flex items-center gap-2">
          <Type className="w-6 h-6 text-[#E62329]" />
          Font Pairing
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Discover harmonious font combinations for your brand — preview them live and export CSS.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Style Category</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                  filter === c ? 'bg-[#121212] text-white border-transparent' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                )}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Brand Mood</p>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                  mood === m ? 'bg-[#E62329] text-white border-transparent' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                )}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pairing cards */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-gray-400">{filtered.length} Pairings</p>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => selectPairing(p)}
              className={cn(
                'rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md',
                selected?.id === p.id
                  ? 'border-[#E62329]/40 bg-[#E62329]/[0.02] shadow-md ring-1 ring-[#E62329]/20'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-[#121212]">{p.name}</h3>
                  <span className="text-[10px] text-gray-400 font-medium">{p.category}</span>
                </div>
                <div className="flex gap-1">
                  {p.mood.map(m => (
                    <span key={m} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{m}</span>
                  ))}
                </div>
              </div>

              {/* Mini preview — load fonts when selected */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <p style={{
                  fontFamily: `'${p.heading}', serif`,
                  fontWeight: p.headingWeight,
                  fontSize: 20,
                  lineHeight: 1.2,
                  color: '#121212',
                }}>
                  {p.preview.heading}
                </p>
                <p style={{
                  fontFamily: `'${p.body}', sans-serif`,
                  fontWeight: p.bodyWeight,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: '#666',
                }}>
                  {p.preview.body}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#E62329] uppercase tracking-wider">H:</span>
                  <span className="text-[11px] font-semibold text-gray-600">{p.heading}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">B:</span>
                  <span className="text-[11px] font-semibold text-gray-600">{p.body}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live preview panel */}
        {selected ? (
          <div className="space-y-4 sticky top-4 self-start">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#121212]">{selected.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selected.description}</p>
                </div>
                <button
                  onClick={copyCode}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                    copied ? 'bg-green-100 text-green-600' : 'bg-[#E62329] text-white hover:bg-[#c91e23]'
                  )}
                >
                  {copied ? <><CheckCircle2 size={12} />Copied!</> : <><Copy size={12} />Copy CSS</>}
                </button>
              </div>

              {/* Size controls */}
              <div className="px-5 py-3 border-b border-gray-50 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Heading</span>
                  <input type="range" min={18} max={64} value={headingSize}
                    onChange={e => setHeadingSize(Number(e.target.value))}
                    className="w-24 accent-[#E62329]" />
                  <span className="text-xs font-mono text-gray-500">{headingSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Body</span>
                  <input type="range" min={12} max={24} value={bodySize}
                    onChange={e => setBodySize(Number(e.target.value))}
                    className="w-24 accent-[#E62329]" />
                  <span className="text-xs font-mono text-gray-500">{bodySize}px</span>
                </div>
              </div>

              {/* Live preview */}
              <div className="p-6 min-h-[200px]">
                <p style={{
                  fontFamily: `'${selected.heading}', serif`,
                  fontWeight: selected.headingWeight,
                  fontSize: headingSize,
                  lineHeight: 1.2,
                  color: '#121212',
                  marginBottom: 12,
                }}>
                  {selected.preview.heading}
                </p>
                <textarea
                  value={preview || selected.preview.body}
                  onChange={e => setPreview(e.target.value)}
                  rows={4}
                  style={{
                    fontFamily: `'${selected.body}', sans-serif`,
                    fontWeight: selected.bodyWeight,
                    fontSize: bodySize,
                    lineHeight: 1.7,
                    color: '#555',
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Font details */}
              <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/30 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#E62329] mb-1">Heading Font</p>
                  <p className="text-sm font-bold text-[#121212]">{selected.heading}</p>
                  <p className="text-[10px] text-gray-400">Weight: {selected.headingWeight}</p>
                  <a href={`https://fonts.google.com/specimen/${selected.heading.replace(/ /g, '+')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-[#E62329] hover:underline mt-1 font-bold">
                    Google Fonts <ExternalLink size={9} />
                  </a>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">Body Font</p>
                  <p className="text-sm font-bold text-[#121212]">{selected.body}</p>
                  <p className="text-[10px] text-gray-400">Weight: {selected.bodyWeight}</p>
                  <a href={`https://fonts.google.com/specimen/${selected.body.replace(/ /g, '+')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-[#E62329] hover:underline mt-1 font-bold">
                    Google Fonts <ExternalLink size={9} />
                  </a>
                </div>
              </div>

              {/* CSS snippet */}
              <div className="px-5 pb-5">
                <pre className="bg-[#0E0E0E] text-green-400 text-[11px] font-mono rounded-xl p-4 overflow-x-auto leading-relaxed">{
`@import url('${selected.headingUrl}');
@import url('${selected.bodyUrl}');

h1, h2, h3 {
  font-family: '${selected.heading}';
  font-weight: ${selected.headingWeight};
}
body {
  font-family: '${selected.body}';
  font-weight: ${selected.bodyWeight};
}`}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 flex flex-col items-center justify-center p-12 text-center sticky top-4 self-start min-h-[300px]">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Type className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400">Select a pairing to see the live preview</p>
            <p className="text-xs text-gray-300 mt-1">Adjust sizes and edit the preview text</p>
          </div>
        )}
      </div>
    </div>
  )
}
