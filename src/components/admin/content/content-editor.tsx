'use client'

import { useState, useTransition } from 'react'
import { generateContent } from '@/actions/generate-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContentEditor() {
    const [isPending, startTransition] = useTransition()
    const [content, setContent] = useState('')

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await generateContent(formData)
            if (result.success) {
                setContent(result.content)
            }
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-[#121212]">
                        <Sparkles className="w-5 h-5 text-[#E62329]" />
                        <h2 className="text-lg font-bold tracking-tight">AI Configuration</h2>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="topic" className="text-xs font-black uppercase tracking-widest text-gray-500">
                                Topic
                            </label>
                            <Input
                                id="topic"
                                name="topic"
                                placeholder="e.g. EV Battery Maintenance"
                                required
                                className="bg-white/80 border-gray-200 focus:ring-[#121212]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="keywords" className="text-xs font-black uppercase tracking-widest text-gray-500">
                                Keywords
                            </label>
                            <Input
                                id="keywords"
                                name="keywords"
                                placeholder="Comma separated"
                                className="bg-white/80 border-gray-200 focus:ring-[#121212]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="tone" className="text-xs font-black uppercase tracking-widest text-gray-500">
                                Tone
                            </label>
                            <select
                                id="tone"
                                name="tone"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition-shadow disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Professional">Professional</option>
                                <option value="Casual">Casual</option>
                                <option value="Enthusiastic">Enthusiastic</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                "w-full mt-4 bg-[#121212] hover:bg-black text-white hover:text-[#E62329] rounded-full py-6 font-bold tracking-wide transition-all duration-300",
                                isPending && "opacity-90"
                            )}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Draft
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Editor Panel */}
            <div className="lg:col-span-2">
                <div className="h-full min-h-[500px] rounded-3xl border border-gray-200 bg-white shadow-sm p-1">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="# Your generated content will appear here..."
                        className="w-full h-full min-h-[500px] resize-none border-0 bg-transparent p-6 text-lg leading-relaxed focus:ring-0 placeholder:text-gray-300 font-mono"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                    />
                </div>
            </div>
        </div>
    )
}
