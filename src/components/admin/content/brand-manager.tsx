'use client'

import { addBrand, deleteBrand } from '@/actions/cms-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface Brand {
    id: string
    name: string
    nameAr: string | null
    logoUrl: string | null
}

export function BrandManager({ brands }: { brands: Brand[] }) {
    const [isPending, startTransition] = useTransition()

    const handleAdd = (formData: FormData) => {
        startTransition(async () => {
            await addBrand(formData)
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm("Delete this brand?")) return
        startTransition(async () => {
            await deleteBrand(id)
        })
    }

    return (
        <div className="space-y-8">
            {/* Add New Brand */}
            <div className="p-8 rounded-[2.5rem] border border-gray-200 bg-white shadow-xl max-w-2xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <Plus size={16} className="text-[#E62329]" />
                    Register New Heritage Brand
                </h3>
                <form action={handleAdd} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">English Name</label>
                            <Input
                                name="name"
                                placeholder="e.g. Mercedes-Benz"
                                required
                                className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold"
                            />
                        </div>
                        <div className="space-y-2" dir="rtl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">الاسم بالعربية</label>
                            <Input
                                name="nameAr"
                                placeholder="مثال: مرسيدس-بنز"
                                className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-right font-cairo"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#E62329] transition-all"
                    >
                        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Brand Addition"}
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <div key={brand.id} className="relative group p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-black text-[#121212] tracking-tighter uppercase">{brand.name}</span>
                            <span className="text-sm font-bold text-gray-400 font-cairo" dir="rtl">{brand.nameAr || '---'}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(brand.id)}
                            disabled={isPending}
                            className="absolute top-4 right-4 p-2 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {brands.length === 0 && <p className="col-span-full text-gray-400 font-medium italic">Establishing brand relationships...</p>}
            </div>
        </div>
    )
}
