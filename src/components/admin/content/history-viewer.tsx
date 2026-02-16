'use client'

import { useState, useEffect } from 'react'
import { getContentHistory } from '@/app/actions'
import { restoreContentVersion } from '@/actions/cms-actions'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { History, RotateCcw, Clock, User, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function HistoryViewer() {
    const [history, setHistory] = useState<{ audit: any[], snapshots: any[] }>({ audit: [], snapshots: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [expandedSnapshot, setExpandedSnapshot] = useState<string | null>(null)

    const fetchHistory = async () => {
        setIsLoading(true)
        try {
            const data = await getContentHistory()
            setHistory(data)
        } catch (err) {
            toast.error("Failed to load history")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const handleRestore = async (id: string) => {
        if (!confirm("Are you sure you want to restore this version? Current content will be saved as a new snapshot.")) return
        
        try {
            const res = await restoreContentVersion(id)
            if (res.success) {
                toast.success("Content restored successfully")
                fetchHistory()
            }
        } catch (err) {
            toast.error("Restoration failed")
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <Clock className="animate-spin text-gray-200" size={48} />
        </div>
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Audit Logs */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#121212] text-white rounded-2xl">
                        <History size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#121212] tracking-tighter uppercase">Activity Logs</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Field-level change tracking</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 subtle-scrollbar">
                    {history.audit.map((log) => (
                        <div key={log.id} className="p-6 rounded-[1.5rem] border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#E62329] bg-[#E62329]/5 px-3 py-1 rounded-full">
                                    {log.entityType}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {new Date(log.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <h4 className="text-sm font-black text-[#121212] uppercase tracking-tighter mb-2">{log.key}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                <User size={12} />
                                <span>Updated by {log.updatedBy}</span>
                            </div>
                        </div>
                    ))}
                    {history.audit.length === 0 && <p className="text-gray-400 italic">No activity logs recorded yet.</p>}
                </div>
            </div>

            {/* Snapshots */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#E62329] text-white rounded-2xl">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#121212] tracking-tighter uppercase">State Snapshots</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full version history</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 subtle-scrollbar">
                    {history.snapshots.map((snap) => (
                        <div key={snap.id} className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-300" />
                                    <span className="text-xs font-bold text-[#121212]">{new Date(snap.createdAt).toLocaleString()}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleRestore(snap.id)}
                                    className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-[#E62329] hover:bg-[#E62329] hover:text-white"
                                >
                                    <RotateCcw size={12} className="mr-2" />
                                    Restore
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{snap.entityType}</p>
                                    <p className="text-sm font-bold text-[#121212] uppercase tracking-tighter">{snap.key}</p>
                                </div>
                                <button 
                                    onClick={() => setExpandedSnapshot(expandedSnapshot === snap.id ? null : snap.id)}
                                    className="p-2 text-gray-300 hover:text-[#121212] transition-colors"
                                >
                                    {expandedSnapshot === snap.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {expandedSnapshot === snap.id && (
                                <motion.pre 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-6 p-4 bg-gray-50 rounded-xl text-[10px] text-gray-600 overflow-x-auto"
                                >
                                    {JSON.stringify(JSON.parse(snap.snapshot), null, 2)}
                                </motion.pre>
                            )}
                        </div>
                    ))}
                    {history.snapshots.length === 0 && <p className="text-gray-400 italic">No snapshots available for restoration.</p>}
                </div>
            </div>
        </div>
    )
}
