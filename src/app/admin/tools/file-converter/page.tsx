'use client'

import { useState, useRef, useCallback } from 'react'
import { FileCheck, Upload, Download, RefreshCw, X, ArrowRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConvType = 'img-jpeg' | 'img-png' | 'img-webp' | 'csv-json' | 'json-csv'

interface ConvFile {
  id: string
  file: File
  name: string
  size: number
  convType: ConvType
  status: 'idle' | 'converting' | 'done' | 'error'
  resultBlob?: Blob
  resultName?: string
  error?: string
}

const CONVERSIONS = [
  { label: 'Image → JPEG',  value: 'img-jpeg' as ConvType, from: 'Image', to: 'JPEG', accept: 'image/*' },
  { label: 'Image → PNG',   value: 'img-png'  as ConvType, from: 'Image', to: 'PNG',  accept: 'image/*' },
  { label: 'Image → WebP',  value: 'img-webp' as ConvType, from: 'Image', to: 'WebP', accept: 'image/*' },
  { label: 'CSV → JSON',    value: 'csv-json' as ConvType, from: 'CSV',   to: 'JSON', accept: '.csv,text/csv' },
  { label: 'JSON → CSV',    value: 'json-csv' as ConvType, from: 'JSON',  to: 'CSV',  accept: '.json,application/json' },
]

function fmtBytes(b: number) {
  return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'
}

async function convertFile(cf: ConvFile): Promise<ConvFile> {
  try {
    if (cf.convType.startsWith('img-')) {
      const mime = cf.convType === 'img-png' ? 'image/png' : cf.convType === 'img-webp' ? 'image/webp' : 'image/jpeg'
      const ext  = cf.convType.split('-')[1]
      const blob = await new Promise<Blob>((res, rej) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width; canvas.height = img.height
          canvas.getContext('2d')!.drawImage(img, 0, 0)
          canvas.toBlob(b => b ? res(b) : rej('Failed'), mime, 0.92)
        }
        img.onerror = rej
        img.src = URL.createObjectURL(cf.file)
      })
      return { ...cf, status: 'done', resultBlob: blob, resultName: cf.name.replace(/\.[^.]+$/, '') + '.' + ext }
    }
    if (cf.convType === 'csv-json') {
      const text    = await cf.file.text()
      const lines   = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
      const data    = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
      })
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      return { ...cf, status: 'done', resultBlob: blob, resultName: cf.name.replace(/\.csv$/i, '') + '.json' }
    }
    if (cf.convType === 'json-csv') {
      const text = await cf.file.text()
      const data = JSON.parse(text) as Record<string, unknown>[]
      if (!Array.isArray(data) || !data.length) throw new Error('JSON must be an array of objects')
      const headers = Object.keys(data[0])
      const rows    = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
      const csv     = [headers.join(','), ...rows].join('\n')
      const blob    = new Blob([csv], { type: 'text/csv' })
      return { ...cf, status: 'done', resultBlob: blob, resultName: cf.name.replace(/\.json$/i, '') + '.csv' }
    }
    return { ...cf, status: 'error', error: 'Unsupported conversion' }
  } catch (e) {
    return { ...cf, status: 'error', error: String(e) }
  }
}

export default function FileConverterPage() {
  const [files, setFiles]           = useState<ConvFile[]>([])
  const [convType, setConvType]     = useState<ConvType>('img-jpeg')
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = CONVERSIONS.find(c => c.value === convType)!

  const addFiles = useCallback((fileList: FileList | File[]) => {
    Array.from(fileList).forEach(file => {
      setFiles(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        file, name: file.name, size: file.size,
        convType, status: 'idle',
      }])
    })
  }, [convType])

  const runAll = async () => {
    setProcessing(true)
    const updated = [...files]
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue
      updated[i] = { ...updated[i], status: 'converting' }
      setFiles([...updated])
      updated[i] = await convertFile(updated[i])
      setFiles([...updated])
    }
    setProcessing(false)
  }

  const download = (cf: ConvFile) => {
    if (!cf.resultBlob || !cf.resultName) return
    const url = URL.createObjectURL(cf.resultBlob)
    const a   = document.createElement('a')
    a.href = url; a.download = cf.resultName; a.click()
    URL.revokeObjectURL(url)
  }

  const doneCnt = files.filter(f => f.status === 'done').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#121212] flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-[#E62329]" />
          File Converter
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Convert images and data files between formats — entirely in your browser, nothing is uploaded.
        </p>
      </div>

      {/* Type selector */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Conversion Type</p>
        <div className="flex flex-wrap gap-2">
          {CONVERSIONS.map(c => (
            <button
              key={c.value}
              onClick={() => setConvType(c.value)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                convType === c.value
                  ? 'bg-[#121212] text-white border-transparent shadow-md'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              )}
            >
              <span className="font-mono text-[10px] bg-gray-200/60 px-1.5 py-0.5 rounded uppercase text-gray-600">{c.from}</span>
              <ArrowRight size={10} />
              <span className="font-mono text-[10px] bg-[#E62329]/10 px-1.5 py-0.5 rounded uppercase text-[#E62329]">{c.to}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
          <Info size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
          <span>
            Selected: <strong className="text-gray-700">{selected.label}</strong> — upload{' '}
            <strong className="text-gray-700">{selected.from}</strong> files to convert them to{' '}
            <strong className="text-gray-700">{selected.to}</strong>.
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#E62329]/40 hover:bg-[#E62329]/[0.02] transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Upload className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-600">Drop {selected.from} files here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Accepts {selected.accept}</p>
        </div>
        <input ref={inputRef} type="file" accept={selected.accept} multiple className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600">
                {files.length} File{files.length !== 1 ? 's' : ''} · {doneCnt} Converted
              </h3>
              <button onClick={() => setFiles([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {files.map(cf => (
                <div key={cf.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileCheck size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#121212] truncate">{cf.name}</p>
                    <p className="text-xs text-gray-400">{fmtBytes(cf.size)}</p>
                  </div>
                  {cf.status === 'error' && (
                    <span className="text-xs text-red-500 font-medium truncate max-w-[200px]">{cf.error}</span>
                  )}
                  <div className="flex items-center gap-2">
                    {cf.status === 'converting' && <RefreshCw size={15} className="animate-spin text-[#E62329]" />}
                    {cf.status === 'done' && cf.resultBlob && (
                      <button onClick={() => download(cf)} className="flex items-center gap-1 text-xs font-bold text-[#E62329] hover:underline whitespace-nowrap">
                        <Download size={13} /> {cf.resultName}
                      </button>
                    )}
                    {(cf.status === 'idle' || cf.status === 'error') && (
                      <button onClick={() => setFiles(prev => prev.filter(f => f.id !== cf.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={runAll}
              disabled={processing}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md',
                processing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E62329] text-white hover:bg-[#c91e23] shadow-red-200'
              )}
            >
              {processing
                ? <><RefreshCw size={15} className="animate-spin" />Converting…</>
                : <><FileCheck size={15} />Convert All</>}
            </button>
            {doneCnt > 1 && (
              <button onClick={() => files.forEach(f => f.status === 'done' && download(f))}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider bg-[#121212] text-white hover:bg-gray-800 transition-all shadow-md">
                <Download size={15} /> Download All ({doneCnt})
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
