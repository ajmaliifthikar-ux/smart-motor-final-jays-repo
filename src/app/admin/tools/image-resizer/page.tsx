'use client'

import { useState, useRef, useCallback } from 'react'
import { ImageIcon, Upload, Download, RefreshCw, Lock, Unlock, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageFile {
  id: string
  file: File
  src: string
  name: string
  originalW: number
  originalH: number
  outputW: number
  outputH: number
  quality: number
  format: 'original' | 'jpeg' | 'png' | 'webp'
  status: 'idle' | 'processing' | 'done'
  resultBlob?: Blob
  resultSize?: number
}

async function resizeImage(img: ImageFile): Promise<Blob> {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = img.outputW
      canvas.height = img.outputH
      canvas.getContext('2d')!.drawImage(image, 0, 0, img.outputW, img.outputH)
      const mime = img.format === 'png'  ? 'image/png'
                 : img.format === 'webp' ? 'image/webp'
                 : img.format === 'jpeg' ? 'image/jpeg'
                 : img.file.type
      canvas.toBlob(blob => resolve(blob!), mime, img.quality / 100)
    }
    image.src = img.src
  })
}

function fmtBytes(b: number) {
  return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB'
}

export default function ImageResizerPage() {
  const [images, setImages]       = useState<ImageFile[]>([])
  const [globalW, setGlobalW]     = useState('1200')
  const [globalH, setGlobalH]     = useState('800')
  const [globalQ, setGlobalQ]     = useState(85)
  const [globalFmt, setGlobalFmt] = useState<ImageFile['format']>('jpeg')
  const [lockAspect, setLockAspect] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [done, setDone]           = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
    arr.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          setImages(prev => [...prev, {
            id: Math.random().toString(36).slice(2),
            file, src: e.target!.result as string, name: file.name,
            originalW: img.width, originalH: img.height,
            outputW: img.width, outputH: img.height,
            quality: globalQ, format: globalFmt, status: 'idle',
          }])
        }
        img.src = e.target!.result as string
      }
      reader.readAsDataURL(file)
    })
  }, [globalQ, globalFmt])

  const applyGlobal = () => {
    setImages(prev => prev.map(img => {
      const w = parseInt(globalW) || img.outputW
      const h = lockAspect ? Math.round(w * img.originalH / img.originalW) : parseInt(globalH) || img.outputH
      return { ...img, outputW: w, outputH: h, quality: globalQ, format: globalFmt }
    }))
  }

  const processAll = async () => {
    setProcessing(true); setDone(false)
    const updated = [...images]
    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: 'processing' }
      setImages([...updated])
      const result = await resizeImage(updated[i])
      updated[i] = { ...updated[i], status: 'done', resultBlob: result, resultSize: result.size }
      setImages([...updated])
    }
    setProcessing(false); setDone(true)
  }

  const dlOne = (img: ImageFile) => {
    if (!img.resultBlob) return
    const url = URL.createObjectURL(img.resultBlob)
    const a   = document.createElement('a')
    const ext = img.format === 'original' ? img.name.split('.').pop() : img.format
    a.href = url; a.download = img.name.replace(/\.[^.]+$/, '') + '-resized.' + ext; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => images.forEach(dlOne)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#121212] flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-[#E62329]" />
          Image Resizer
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Resize, compress and convert images in bulk. Runs entirely in your browser — files are never uploaded.
        </p>
      </div>

      {/* Global controls */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Batch Settings</p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-[120px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Width (px)</label>
            <input type="number" value={globalW} onChange={e => setGlobalW(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20" />
          </div>
          <button
            onClick={() => setLockAspect(!lockAspect)}
            title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
            className={cn('p-2 rounded-xl border transition-all self-end mb-0', lockAspect ? 'bg-[#E62329]/10 border-[#E62329]/30 text-[#E62329]' : 'bg-gray-50 border-gray-200 text-gray-400')}
          >
            {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          <div className="space-y-1.5 flex-1 min-w-[120px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Height (px)</label>
            <input type="number" value={globalH} onChange={e => setGlobalH(e.target.value)}
              disabled={lockAspect}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E62329]/20 disabled:opacity-40" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[140px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Quality ({globalQ}%)</label>
            <input type="range" min={10} max={100} value={globalQ} onChange={e => setGlobalQ(Number(e.target.value))}
              className="w-full accent-[#E62329]" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[100px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Output Format</label>
            <select value={globalFmt} onChange={e => setGlobalFmt(e.target.value as ImageFile['format'])}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none">
              <option value="original">Original</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <button onClick={applyGlobal}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all">
            Apply to All
          </button>
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
          <p className="text-sm font-bold text-gray-600">Drop images here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Supports JPG · PNG · WebP · GIF — up to 20 files</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600">
                {images.length} Image{images.length !== 1 ? 's' : ''} Queued
              </h3>
              <button onClick={() => setImages([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {images.map(img => (
                <div key={img.id} className="flex items-center gap-4 px-5 py-3">
                  <img src={img.src} alt={img.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#121212] truncate">{img.name}</p>
                    <p className="text-xs text-gray-400">{img.originalW} × {img.originalH}px · {fmtBytes(img.file.size)}</p>
                  </div>
                  <div className="text-xs text-gray-500 text-right min-w-[100px]">
                    <p className="font-semibold">{img.outputW} × {img.outputH}px</p>
                    {img.resultSize && <p className="text-green-600">{fmtBytes(img.resultSize)}</p>}
                  </div>
                  <div className="w-20 flex items-center justify-center">
                    {img.status === 'processing' && <RefreshCw size={16} className="animate-spin text-[#E62329]" />}
                    {img.status === 'done' && img.resultBlob && (
                      <button onClick={() => dlOne(img)} className="flex items-center gap-1 text-xs font-bold text-[#E62329] hover:underline">
                        <Download size={13} /> Save
                      </button>
                    )}
                    {img.status === 'idle' && (
                      <button onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={processAll}
              disabled={processing}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md',
                processing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E62329] text-white hover:bg-[#c91e23] shadow-red-200'
              )}
            >
              {processing
                ? <><RefreshCw size={15} className="animate-spin" />Processing…</>
                : <><ImageIcon size={15} />Resize All</>}
            </button>
            {done && (
              <button onClick={downloadAll}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider bg-[#121212] text-white hover:bg-gray-800 transition-all shadow-md">
                <Download size={15} /> Download All
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
