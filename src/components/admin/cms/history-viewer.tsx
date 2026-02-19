'use client'

import React, { useEffect, useState } from 'react'
import { 
  getContentHistory, 
  ContentHistory, 
  restoreContentFromHistory 
} from '@/lib/firebase-cms'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { History, RotateCcw, Clock, User, Check, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { useRouter } from 'next/navigation'

interface HistoryViewerProps {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  sectionName: string
}

export function HistoryViewer({
  isOpen,
  onClose,
  sectionId,
  sectionName
}: HistoryViewerProps) {
  const [history, setHistory] = useState<ContentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRestoring, setIsRestoring] = useState<string | null>(null)
  const { user } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen, sectionId])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const data = await getContentHistory(sectionId)
      setHistory(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
      toast.error('Failed to load version history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (historyId: string) => {
    if (!user) return
    
    setIsRestoring(historyId)
    try {
      await restoreContentFromHistory(historyId, user.email || user.uid)
      toast.success('Version restored successfully!')
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Restore error:', error)
      toast.error('Failed to restore version')
    } finally {
      setIsRestoring(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-[2rem] border-none shadow-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <History className="text-[#E62329]" size={24} />
            Version <span className="text-[#E62329]">History</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Archive for {sectionName} — Restore any previous state.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-gray-300" size={32} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                No historical versions found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((version) => (
                <div 
                  key={version.id}
                  className="group relative p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#E62329]/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#121212]">
                        <Clock size={12} className="text-[#E62329]" />
                        {version.updatedAt?.toDate ? format(version.updatedAt.toDate(), 'MMM d, yyyy • HH:mm') : 'Unknown Date'}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <User size={10} />
                        {version.updatedBy}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleRestore(version.id)}
                      disabled={!!isRestoring}
                      className="rounded-full h-8 px-4 bg-[#121212] text-white hover:bg-[#E62329] text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      {isRestoring === version.id ? (
                        <Check className="animate-bounce" size={12} />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <RotateCcw size={12} />
                          Restore
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Tiny Preview of snapshot */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 line-clamp-2 italic font-medium">
                      {JSON.parse(version.snapshot).title || 'No title data'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
