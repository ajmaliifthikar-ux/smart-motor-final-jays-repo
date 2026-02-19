'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save, Trash2, Car, Sparkles, Globe, History } from 'lucide-react'
import { updateBrand } from '@/lib/firebase-db'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  heritage: z.string().optional(),
  models: z.string().optional(), // Comma separated
})

type BrandFormData = z.infer<typeof brandSchema>

export function BrandEditor({ id, initialData }: { id: string | null, initialData?: any }) {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    values: initialData ? {
      name: initialData.name || '',
      nameAr: initialData.nameAr || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
      heritage: initialData.heritage || '',
      models: initialData.models || '',
    } : {
      name: '',
    }
  })

  const logoSrc = initialData?.logoUrl || initialData?.logoFile ? 
    (initialData.logoUrl?.startsWith('http') ? initialData.logoUrl : `/brands-carousel/${initialData.logoFile || initialData.logoUrl?.replace(/^\//, '')}`) 
    : undefined

  const onSubmit = async (data: BrandFormData) => {
    if (!id) return
    try {
      await updateBrand(id, data as any)
      toast.success('Brand updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update brand')
    }
  }

  if (!id) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <Car size={40} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">Select a brand</h3>
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">to begin editing profile</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-center relative group overflow-hidden">
            {logoSrc ? (
              <img src={logoSrc} alt={watch('name')} className="w-full h-full object-contain" />
            ) : (
              <Car className="text-gray-300" size={32} />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <span className="text-[8px] font-black uppercase text-white">Change</span>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">
              {watch('name') || 'New Brand'}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E62329]">
              {id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#121212] text-white hover:bg-[#E62329] rounded-full px-8 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 h-12"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] flex items-center gap-2">
              <Globe size={12} /> Identity & SEO
            </h4>
            <Input 
              id="name"
              label="Brand Name" 
              {...register('name')}
            />
            <Input 
              id="slug"
              label="URL Slug" 
              {...register('slug')}
            />
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Serviced Models (Comma Separated)</label>
              <Textarea 
                id="models"
                placeholder="e.g. 911 GT3 RS, Cayenne, Taycan..." 
                {...register('models')}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
              <History size={12} /> Brand Story
            </h4>
            <Textarea 
              id="heritage"
              label="Brand Heritage" 
              placeholder="The history and legacy of this brand..." 
              {...register('heritage')}
              rows={6}
            />
            <Textarea 
              id="description"
              label="SEO Description" 
              placeholder="Short meta description for search engines..." 
              {...register('description')}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-8 bg-[#121212] p-10 rounded-[3rem] text-white">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] flex items-center gap-2">
              <Sparkles size={12} /> Premium Content (AR)
            </h4>
            <Input 
              id="nameAr"
              label="Arabic Name" 
              className="bg-white/5 border-white/10 text-white text-right font-arabic"
              {...register('nameAr')}
            />
            <Textarea 
              id="heritageAr"
              label="Heritage (Arabic)" 
              className="bg-white/5 border-white/10 text-white text-right font-arabic"
              placeholder="قصة العلامة التجارية..."
              rows={10}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
