'use client'

import { useState, useTransition } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Layout, Plus, GripVertical, Trash2, Edit3, Globe, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateContentBlock } from '@/actions/cms-actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Block {
    key: string
    value: string
    valueAr: string | null
    type: string
    order: number
}

interface PageManagerProps {
    initialPages: Record<string, Block[]>
}

export function PageManager({ initialPages }: PageManagerProps) {
    const [pages, setPages] = useState(initialPages)
    const [activePage, setActivePage] = useState(Object.keys(initialPages)[0] || 'home')
    const [isPending, startTransition] = useTransition()

    const handleReorder = (newBlocks: Block[]) => {
        const updatedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }))
        setPages({ ...pages, [activePage]: updatedBlocks })

        // Save the new order to DB
        startTransition(async () => {
            for (const block of updatedBlocks) {
                const formData = new FormData()
                formData.append('key', block.key)
                formData.append('value', block.value)
                if (block.valueAr) formData.append('valueAr', block.valueAr)
                formData.append('type', block.type)
                formData.append('order', block.order.toString())
                await updateContentBlock(formData)
            }
            toast.success(`Page layout for ${activePage} updated`)
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar: Page List */}
            <div className="lg:col-span-1 space-y-4">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Site Hierarchy</h3>
                    <div className="space-y-2">
                        {Object.keys(pages).map(p => (
                            <button
                                key={p}
                                onClick={() => setActivePage(p)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all",
                                    activePage === p
                                        ? "bg-[#121212] text-white shadow-lg"
                                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                )}
                            >
                                <Layout size={16} />
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content: Block Reordering */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black text-[#121212] tracking-tighter uppercase">Modular Page Layout</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Surface: {activePage}</p>
                        </div>
                        <Button className="bg-[#E62329] text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px]">
                            <Plus size={16} className="mr-2" />
                            Insert Content Block
                        </Button>
                    </div>

                    <Reorder.Group axis="y" values={pages[activePage] || []} onReorder={handleReorder} className="space-y-4">
                        {(pages[activePage] || []).map((block) => (
                            <Reorder.Item
                                key={block.key}
                                value={block}
                                className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-[#121212] transition-colors cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="text-gray-300 group-hover:text-[#121212] transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#E62329] mb-1">{block.type}</p>
                                        <h4 className="font-black text-[#121212] tracking-tighter uppercase">{block.key.split('_').join(' ')}</h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end gap-1 px-4 border-r border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">EN</span>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", block.value ? "bg-green-500" : "bg-gray-200")} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">AR</span>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", block.valueAr ? "bg-green-500" : "bg-gray-200")} />
                                        </div>
                                    </div>
                                    <button className="p-3 rounded-xl bg-white text-gray-400 hover:text-[#121212] hover:shadow-md transition-all">
                                        <Edit3 size={18} />
                                    </button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {(!pages[activePage] || pages[activePage].length === 0) && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <Layout size={32} />
                            </div>
                            <p className="text-gray-400 font-medium italic">Empty viewport. Start assembling blocks.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

