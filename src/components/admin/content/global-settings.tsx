'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateContentBlock } from "@/actions/cms-actions"
import { toast } from "sonner"
import { Save, Image as ImageIcon, Type, Phone, Globe, Loader2 } from "lucide-react"

// Types of settings we manage
const SETTINGS = [
    { key: "hero_title", label: "Hero Title", icon: Type, type: "text", placeholder: "Experience the Future of Driving" },
    { key: "hero_subtitle", label: "Hero Subtitle", icon: Type, type: "text", placeholder: "Premium electric vehicles..." },
    { key: "hero_bg", label: "Hero Background Image", icon: ImageIcon, type: "image", placeholder: "https://example.com/image.jpg" },
    { key: "contact_phone", label: "Contact Phone", icon: Phone, type: "text", placeholder: "+971 50 123 4567" },
    { key: "site_name", label: "Site Name", icon: Globe, type: "text", placeholder: "Smart Motors" },
]

interface GlobalSettingsProps {
    initialData?: Record<string, { value: string, valueAr: string | null }>
}

export function GlobalSettings({ initialData = {} }: GlobalSettingsProps) {
    const [isPending, startTransition] = useTransition()

    const processSave = async (formData: FormData, status: "DRAFT" | "PUBLISHED") => {
        startTransition(async () => {
            let successCount = 0

            for (const setting of SETTINGS) {
                const value = formData.get(`${setting.key}_en`) as string
                const valueAr = formData.get(`${setting.key}_ar`) as string

                const form = new FormData()
                form.append("key", setting.key)
                form.append("value", value)
                form.append("valueAr", valueAr)
                form.append("type", setting.type)
                form.append("status", status)

                const res = await updateContentBlock(form)
                if (res.success) successCount++
            }

            if (successCount > 0) {
                toast.success(status === "DRAFT" ? "Saved drafts" : "Published changes live")
            } else {
                toast.info("No changes made")
            }
        })
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#121212] rounded-2xl flex items-center justify-center text-white">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#121212] tracking-tighter uppercase">Platform Localization</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global English & Arabic Settings</p>
                        </div>
                    </div>
                </div>

                <form className="space-y-12">
                    {SETTINGS.map((setting) => (
                        <div key={setting.key} className="group transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg text-[#E62329]">
                                    <setting.icon size={16} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">{setting.label}</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* English Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#E62329]/60 px-2 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#E62329]" />
                                        English Value
                                    </label>
                                    <div className="flex gap-4">
                                        <Input
                                            name={`${setting.key}_en`}
                                            placeholder={setting.placeholder}
                                            defaultValue={initialData[setting.key]?.value || ""}
                                            className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold focus:ring-2 focus:ring-[#121212] transition-all"
                                        />
                                        {setting.type === 'image' && (
                                            <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                                {initialData[setting.key]?.value ? (
                                                    <img src={initialData[setting.key].value} alt="preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-300" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Arabic Input */}
                                <div className="space-y-2" dir="rtl">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#E62329]/60 px-2 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#E62329]" />
                                        القيمة بالعربية
                                    </label>
                                    <Input
                                        name={`${setting.key}_ar`}
                                        placeholder="القيمة المقابلة باللغة العربية"
                                        defaultValue={initialData[setting.key]?.valueAr || ""}
                                        className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-right font-cairo focus:ring-2 focus:ring-[#121212] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end gap-4 pt-10 mt-10 border-t border-gray-50">
                        <Button
                            formAction={(fd) => processSave(fd, "DRAFT")}
                            variant="ghost"
                            disabled={isPending}
                            className="h-14 px-8 font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-[#121212]"
                        >
                            Save Draft Workspace
                        </Button>
                        <Button
                            formAction={(fd) => processSave(fd, "PUBLISHED")}
                            disabled={isPending}
                            className="h-14 px-10 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#E62329] transition-all shadow-xl hover:shadow-[#E62329]/20 flex items-center gap-3"
                        >
                            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
                            Commit Changes Live
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
