'use client'

import { useState, useRef, useCallback } from 'react'
import {
  FileOutput, Plus, Trash2, Download, Eye, EyeOff, ChevronUp, ChevronDown,
  Type, AlignLeft, Minus, Square, Table2, Image as ImageIcon, Code2,
  Heading1, Heading2, Heading3, List, ListOrdered, SeparatorHorizontal,
  Copy, CheckCircle2, Palette, LayoutTemplate, FileText, Sparkles,
  GripVertical, X, RefreshCw, Bold, Italic,
  AlignCenter, AlignRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type BlockType =
  | 'heading1' | 'heading2' | 'heading3'
  | 'paragraph' | 'bold-paragraph'
  | 'bullet-list' | 'ordered-list'
  | 'divider' | 'spacer'
  | 'callout' | 'code'
  | 'stats-row' | 'footer-bar'
  | 'image-placeholder'

interface Block {
  id: string
  type: BlockType
  content: string
  options?: Record<string, string>
}

interface DocMeta {
  title: string
  subtitle: string
  author: string
  company: string
  date: string
  accentColor: string
  headerStyle: 'gradient' | 'solid' | 'minimal' | 'none'
  pageSize: 'A4' | 'Letter'
  footerText: string
}

const TEMPLATES: { id: string; name: string; icon: React.ComponentType<{ className?: string }>; description: string; blocks: Block[]; meta: Partial<DocMeta> }[] = [
  {
    id: 'report',
    name: 'Business Report',
    icon: FileText,
    description: 'Professional report with sections and stats',
    meta: { headerStyle: 'gradient', accentColor: '#E62329', title: 'Business Report', subtitle: 'Q1 2026 Performance' },
    blocks: [
      { id: 'b1', type: 'heading1', content: 'Executive Summary' },
      { id: 'b2', type: 'paragraph', content: 'This report presents key performance metrics and strategic initiatives.' },
      { id: 'b3', type: 'bullet-list', content: 'Revenue grew 23% YoY\nCustomer satisfaction increased\nLaunched premium packages' },
    ],
  },
  {
    id: 'blank',
    name: 'Blank Document',
    icon: FileOutput,
    description: 'Start from scratch',
    meta: { headerStyle: 'minimal', accentColor: '#E62329', title: 'Untitled Document', subtitle: '' },
    blocks: [
      { id: 'b1', type: 'heading1', content: 'Document Title' },
      { id: 'b2', type: 'paragraph', content: 'Start writing here…' },
    ],
  },
]

const BLOCK_PALETTE: { type: BlockType; label: string; icon: React.ComponentType<{ className?: string }>; defaultContent: string }[] = [
  { type: 'heading1',       label: 'Heading 1',       icon: Heading1,          defaultContent: 'Big Heading' },
  { type: 'heading2',       label: 'Heading 2',       icon: Heading2,          defaultContent: 'Section Title' },
  { type: 'heading3',       label: 'Heading 3',       icon: Heading3,          defaultContent: 'Sub-section' },
  { type: 'paragraph',      label: 'Paragraph',       icon: AlignLeft,         defaultContent: 'Your text here…' },
  { type: 'bold-paragraph', label: 'Bold Text',       icon: Bold,              defaultContent: 'Important text…' },
  { type: 'bullet-list',    label: 'Bullet List',     icon: List,              defaultContent: 'First\nSecond\nThird' },
  { type: 'ordered-list',   label: 'Numbered List',   icon: ListOrdered,       defaultContent: 'First\nSecond\nThird' },
  { type: 'stats-row',      label: 'Stats Row',       icon: Square,            defaultContent: 'Label|Value|Label|Value|Label|Value|Label|Value' },
  { type: 'callout',        label: 'Callout Box',     icon: Sparkles,          defaultContent: '✅ Important note here.' },
  { type: 'code',           label: 'Code Block',      icon: Code2,             defaultContent: 'const x = "code"' },
  { type: 'divider',        label: 'Divider',         icon: SeparatorHorizontal, defaultContent: '' },
  { type: 'spacer',         label: 'Spacer',          icon: Minus,             defaultContent: '' },
  { type: 'footer-bar',     label: 'Footer',          icon: AlignCenter,       defaultContent: 'Footer | Company | Confidential' },
]

const ACCENT_COLORS = [
  { name: 'Red',     value: '#E62329' },
  { name: 'Black',   value: '#121212' },
  { name: 'Blue',    value: '#2563EB' },
  { name: 'Green',   value: '#16A34A' },
  { name: 'Purple',  value: '#7C3AED' },
  { name: 'Orange',  value: '#EA580C' },
]

function renderBlock(block: Block, accent: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  switch (block.type) {
    case 'heading1':
      return `<h1 style="font-size:26px;font-weight:900;color:#121212;margin:0 0 10px;">${esc(block.content)}</h1>`
    case 'heading2':
      return `<h2 style="font-size:18px;font-weight:800;color:#121212;margin:18px 0 8px;border-bottom:2px solid ${accent}22;padding-bottom:6px;">${esc(block.content)}</h2>`
    case 'heading3':
      return `<h3 style="font-size:14px;font-weight:700;color:${accent};margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.08em;">${esc(block.content)}</h3>`
    case 'paragraph':
      return `<p style="font-size:13px;color:#444;line-height:1.75;margin:0 0 12px;">${esc(block.content)}</p>`
    case 'bold-paragraph':
      return `<p style="font-size:13px;font-weight:700;color:#121212;line-height:1.75;margin:0 0 12px;">${esc(block.content)}</p>`
    case 'bullet-list': {
      const items = block.content.split('\n').filter(Boolean)
      return `<ul style="margin:0 0 14px;padding-left:0;list-style:none;">${items.map(i => `<li style="font-size:13px;color:#444;line-height:1.7;padding:3px 0 3px 20px;position:relative;"><span style="position:absolute;left:0;color:${accent};">•</span>${esc(i)}</li>`).join('')}</ul>`
    }
    case 'ordered-list': {
      const items = block.content.split('\n').filter(Boolean)
      return `<ol style="margin:0 0 14px;padding-left:0;list-style:none;">${items.map((i, idx) => `<li style="font-size:13px;color:#444;line-height:1.7;padding:3px 0 3px 28px;position:relative;"><span style="position:absolute;left:0;width:20px;height:20px;background:${accent};color:white;border-radius:50%;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;">${idx + 1}</span>${esc(i)}</li>`).join('')}</ol>`
    }
    case 'divider':
      return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />`
    case 'spacer':
      return `<div style="height:20px;"></div>`
    case 'callout': {
      const bg = block.options?.bg || '#FEF3C7'
      const color = block.options?.color || '#92400E'
      return `<div style="background:${bg};border-radius:10px;padding:14px 18px;margin:12px 0;"><p style="font-size:13px;color:${color};font-weight:600;line-height:1.65;margin:0;">${esc(block.content)}</p></div>`
    }
    case 'code':
      return `<pre style="background:#0E0E0E;border-radius:10px;padding:16px;margin:12px 0;"><code style="font-family:monospace;font-size:12px;color:#4ADE80;line-height:1.6;">${esc(block.content)}</code></pre>`
    case 'stats-row': {
      const parts = block.content.split('|')
      const pairs: { label: string; value: string }[] = []
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i + 1]) pairs.push({ label: parts[i].trim(), value: parts[i + 1].trim() })
      }
      return `<div style="display:flex;gap:10px;margin:14px 0;flex-wrap:wrap;">${pairs.map(p => `<div style="flex:1;text-align:center;padding:16px 12px;background:#f8f9fa;border-radius:10px;border:1px solid #e5e7eb;"><p style="font-size:9px;font-weight:900;color:#999;text-transform:uppercase;margin:0 0 4px;">${esc(p.label)}</p><p style="font-size:18px;font-weight:900;color:${accent};margin:0;">${esc(p.value)}</p></div>`).join('')}</div>`
    }
    case 'footer-bar': {
      const parts = block.content.split('|').map(p => esc(p.trim()))
      return `<div style="background:${accent};border-radius:10px;padding:12px 20px;margin:16px 0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">${parts.map(p => `<span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.85);">${p}</span>`).join('')}</div>`
    }
    case 'image-placeholder':
      return `<div style="background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:10px;padding:32px;margin:12px 0;text-align:center;"><p style="font-size:11px;color:#94a3b8;font-weight:600;margin:0;">[Image: ${esc(block.content)}]</p></div>`
    default:
      return `<p>${esc(block.content)}</p>`
  }
}

function buildHtmlDoc(meta: DocMeta, blocks: Block[]): string {
  const accent = meta.accentColor

  const headerHtml = meta.headerStyle === 'none' ? '' :
    meta.headerStyle === 'minimal'
      ? `<div style="border-bottom:3px solid ${accent};padding-bottom:20px;margin-bottom:28px;"><h1 style="font-size:28px;font-weight:900;color:#121212;margin:0 0 4px;">${meta.title}</h1>${meta.subtitle ? `<p style="font-size:13px;color:#666;margin:0;">${meta.subtitle}</p>` : ''}<p style="font-size:11px;color:#aaa;margin:8px 0 0;">${meta.company} · ${meta.date}</p></div>`
      : meta.headerStyle === 'solid'
      ? `<div style="background:${accent};border-radius:12px;padding:28px 32px;margin-bottom:28px;"><p style="font-size:10px;font-weight:900;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.2em;margin:0 0 8px;">${meta.company}</p><h1 style="font-size:28px;font-weight:900;color:white;margin:0 0 6px;">${meta.title}</h1>${meta.subtitle ? `<p style="font-size:13px;color:rgba(255,255,255,0.75);margin:0 0 12px;">${meta.subtitle}</p>` : ''}<p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0;">${meta.author} · ${meta.date}</p></div>`
      : `<div style="background:linear-gradient(135deg, ${accent} 0%, ${accent}99 100%);border-radius:12px;padding:32px 36px;margin-bottom:28px;"><p style="font-size:10px;font-weight:900;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.25em;margin:0 0 10px;">${meta.company}</p><h1 style="font-size:30px;font-weight:900;color:white;margin:0 0 8px;">${meta.title}</h1>${meta.subtitle ? `<p style="font-size:14px;color:rgba(255,255,255,0.8);margin:0 0 14px;">${meta.subtitle}</p>` : ''}<p style="font-size:11px;color:rgba(255,255,255,0.5);margin:0;">${meta.author} · ${meta.date}</p></div>`

  const bodyHtml = blocks.map(b => renderBlock(b, accent)).join('')
  const footerHtml = meta.footerText ? `<div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;"><p style="font-size:10px;color:#aaa;margin:0;">${meta.footerText}</p></div>` : ''

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${meta.title}</title><style>*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;margin:0;background:white;}@media print{body{margin:0;}@page{margin:20mm 18mm;size:${meta.pageSize};}}</style></head><body><div style="max-width:780px;margin:0 auto;padding:40px 40px;">${headerHtml}${bodyHtml}${footerHtml}</div></body></html>`
}

const uid = () => Math.random().toString(36).slice(2, 9)

export default function PdfBuilderPage() {
  const today = new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })

  const [meta, setMeta] = useState<DocMeta>({
    title: 'Untitled Document',
    subtitle: '',
    author: 'Smart Motor Admin',
    company: 'Smart Motor UAE',
    date: today,
    accentColor: '#E62329',
    headerStyle: 'gradient',
    pageSize: 'A4',
    footerText: 'Smart Motor UAE · Confidential · ' + today,
  })

  const [blocks, setBlocks] = useState<Block[]>([
    { id: uid(), type: 'heading1', content: 'Document Title' },
    { id: uid(), type: 'paragraph', content: 'Start writing. Add blocks from the left panel.' },
  ])

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [tab, setTab] = useState<'blocks' | 'design' | 'document'>('blocks')
  const [previewMode, setPreviewMode] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const setMf = (k: keyof DocMeta, v: string) => setMeta(prev => ({ ...prev, [k]: v }))

  const addBlock = useCallback((type: BlockType, defaultContent: string) => {
    const newBlock: Block = { id: uid(), type, content: defaultContent }
    setBlocks(prev => [...prev, newBlock])
    setActiveBlockId(newBlock.id)
  }, [])

  const removeBlock = (id: string) => setBlocks(prev => prev.filter(b => b.id !== id))
  const moveBlock = (id: string, dir: 1 | -1) => setBlocks(prev => {
    const idx = prev.findIndex(b => b.id === id)
    if (idx + dir < 0 || idx + dir >= prev.length) return prev
    const next = [...prev]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    return next
  })
  const updateContent = (id: string, content: string) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b))
  const updateOption = (id: string, key: string, val: string) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, options: { ...b.options, [key]: val } } : b))

  const loadTemplate = (tpl: typeof TEMPLATES[0]) => {
    setBlocks(tpl.blocks.map(b => ({ ...b, id: uid() })))
    setMeta(prev => ({ ...prev, ...tpl.meta }))
    setActiveBlockId(null)
  }

  const buildHtml = () => buildHtmlDoc(meta, blocks)

  const downloadPdf = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 300))
    const win = window.open('', '_blank')
    if (!win) { setGenerating(false); return }
    win.document.write(buildHtml())
    win.document.close()
    setTimeout(() => { win.print(); setGenerating(false) }, 600)
  }

  const downloadHtml = () => {
    const blob = new Blob([buildHtml()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${meta.title.toLowerCase().replace(/\s+/g, '-')}.html`; a.click()
    URL.revokeObjectURL(url)
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(buildHtml())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeBlock = blocks.find(b => b.id === activeBlockId)

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-32px)] -m-4 md:-m-8 overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E62329]/10 flex items-center justify-center">
            <FileOutput className="w-4 h-4 text-[#E62329]" />
          </div>
          <div>
            <input value={meta.title} onChange={e => setMf('title', e.target.value)}
              className="font-black text-sm text-[#121212] bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors"
              placeholder="Document title…" />
            <p className="text-[10px] text-gray-400">{blocks.length} blocks · {meta.pageSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreviewMode(!previewMode)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border',
              previewMode ? 'bg-[#121212] text-white' : 'bg-white border-gray-200 text-gray-600'
            )}>
            {previewMode ? <><EyeOff size={13} />Editor</> : <><Eye size={13} />Preview</>}
          </button>
          <button onClick={copyHtml} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border',
            copied ? 'bg-green-100 text-green-700' : 'bg-white border-gray-200 text-gray-600')}>
            {copied ? <><CheckCircle2 size={13} /></> : <><Copy size={13} /></>}
          </button>
          <button onClick={downloadHtml} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600">
            <Download size={13} /> HTML
          </button>
          <button onClick={downloadPdf} disabled={generating}
            className={cn('flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md',
              generating ? 'bg-gray-100 text-gray-400' : 'bg-[#E62329] text-white hover:bg-[#c91e23]'
            )}>
            {generating ? <><RefreshCw size={13} className="animate-spin" /></> : <><Download size={13} /></>} PDF
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {!previewMode && (
          <div className="w-64 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-hidden">
            <div className="flex border-b border-gray-100">
              {([
                { id: 'blocks', label: 'Blocks', icon: Type },
                { id: 'design', label: 'Design', icon: Palette },
                { id: 'document', label: 'Info', icon: FileText },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn('flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all border-b-2',
                    tab === t.id ? 'text-[#E62329] border-[#E62329]' : 'text-gray-400 border-transparent'
                  )}>
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'blocks' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Templates</p>
                  <div className="space-y-1">
                    {TEMPLATES.map(tpl => (
                      <button key={tpl.id} onClick={() => loadTemplate(tpl)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E62329]/[0.06] transition-all group text-left">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E62329]/10">
                          <tpl.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E62329]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#121212]">{tpl.name}</p>
                          <p className="text-[10px] text-gray-400">{tpl.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Add Block</p>
                  <div className="space-y-0.5">
                    {BLOCK_PALETTE.map(b => (
                      <button key={b.type} onClick={() => addBlock(b.type, b.defaultContent)}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all group text-left">
                        <b.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E62329] flex-shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'design' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1">Accent</p>
                  <div className="grid grid-cols-4 gap-1.5 px-1">
                    {ACCENT_COLORS.map(c => (
                      <button key={c.value} onClick={() => setMf('accentColor', c.value)}
                        className={cn('w-full aspect-square rounded-xl border-2 transition-all', meta.accentColor === c.value ? 'border-[#121212]' : 'border-transparent')}
                        style={{ background: c.value }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1">Header</p>
                  {(['gradient', 'solid', 'minimal', 'none'] as const).map(s => (
                    <button key={s} onClick={() => setMf('headerStyle', s)}
                      className={cn('w-full px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left capitalize',
                        meta.headerStyle === s ? 'bg-[#121212] text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-600'
                      )}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'document' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {([
                  { key: 'title', label: 'Title' },
                  { key: 'subtitle', label: 'Subtitle' },
                  { key: 'author', label: 'Author' },
                  { key: 'company', label: 'Company' },
                  { key: 'date', label: 'Date' },
                  { key: 'footerText', label: 'Footer' },
                ] as const).map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">{f.label}</label>
                    <input value={meta[f.key]} onChange={e => setMf(f.key, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#E62329]/30" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor / Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {previewMode ? (
            <div className="flex-1 bg-gray-100 p-4 overflow-auto flex items-center justify-center">
              <div className="bg-white shadow-xl rounded-lg w-full max-w-[800px] h-[600px] overflow-auto">
                <iframe ref={iframeRef} className="w-full h-full border-none" srcDoc={buildHtml()} />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <div className="max-w-[680px] mx-auto space-y-2">
                  {blocks.map((block, idx) => (
                    <div key={block.id} onClick={() => setActiveBlockId(block.id)}
                      className={cn('group relative bg-white rounded-2xl border transition-all cursor-pointer p-4',
                        activeBlockId === block.id ? 'border-[#E62329]/40 shadow-md' : 'border-gray-100 hover:border-gray-200'
                      )}>
                      <div className={cn('absolute -top-3 right-3 flex items-center gap-1 transition-all', activeBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                        <button onClick={e => { e.stopPropagation(); moveBlock(block.id, -1) }} disabled={idx === 0}
                          className="p-1 rounded-lg bg-white border border-gray-200 text-gray-400 disabled:opacity-30">
                          <ChevronUp size={11} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); moveBlock(block.id, 1) }} disabled={idx === blocks.length - 1}
                          className="p-1 rounded-lg bg-white border border-gray-200 text-gray-400 disabled:opacity-30">
                          <ChevronDown size={11} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); removeBlock(block.id) }}
                          className="p-1 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500">
                          <Trash2 size={11} />
                        </button>
                      </div>

                      <textarea value={block.content} onChange={e => updateContent(block.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        rows={1}
                        style={{ resize: 'none', overflow: 'hidden' }}
                        onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px' }}
                        className={cn('w-full bg-transparent outline-none resize-none placeholder-gray-300',
                          block.type === 'heading1' ? 'text-2xl font-black text-[#121212]' :
                          block.type === 'heading2' ? 'text-lg font-black text-[#121212]' :
                          block.type === 'paragraph' ? 'text-sm text-gray-600' :
                          'text-sm text-gray-600'
                        )} />
                    </div>
                  ))}
                </div>
              </div>

              {activeBlock && (
                <div className="w-56 border-l border-gray-100 bg-white overflow-y-auto p-4 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Block: {activeBlock.type}</p>
                  {['callout'].includes(activeBlock.type) && (
                    <div className="space-y-2">
                      <input type="color" value={activeBlock.options?.bg || '#FEF3C7'} onChange={e => updateOption(activeBlock.id, 'bg', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-200" title="Background" />
                      <input type="color" value={activeBlock.options?.color || '#92400E'} onChange={e => updateOption(activeBlock.id, 'color', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-200" title="Text color" />
                    </div>
                  )}
                  <button onClick={() => { removeBlock(activeBlock.id); setActiveBlockId(null) }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
