'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { IconPicker } from './icon-picker'
import { Save, Trash2, Eye, EyeOff, Sparkles, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateService } from '@/lib/firebase-db'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  descriptionAr: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  basePrice: z.number().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  active: z.boolean().default(true),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export function ServiceEditor({ id, initialData }: { id: string | null, initialData?: any }) {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    values: initialData ? {
      name: initialData.name || '',
      nameAr: initialData.nameAr || '',
      description: initialData.description || '',
      descriptionAr: initialData.descriptionAr || '',
      duration: initialData.duration || '',
      basePrice: initialData.basePrice || 0,
      category: initialData.category || '',
      icon: initialData.icon || '',
      active: initialData.active !== false,
    } : {
      name: '',
      duration: '',
      description: '',
      active: true,
    }
  })

  const selectedIcon = watch('icon')
  const isActive = watch('active')

  const onSubmit = async (data: ServiceFormData) => {
    if (!id) return
    try {
      await updateService(id, data as any)
      toast.success('Service updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update service')
    }
  }

  if (!id) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <Sparkles size={40} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">Select an item</h3>
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">to begin editing</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconPicker 
            selectedIcon={selectedIcon} 
            onSelect={(icon) => setValue('icon', icon)} 
          />
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
              {watch('name') || 'New Service'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E62329]">
                ID: {id}
              </span>
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
              )}>
                {isActive ? 'Active' : 'Draft'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setValue('active', !isActive)}
            className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest"
          >
            {isActive ? <><EyeOff size={14} className="mr-2" /> Hide</> : <><Eye size={14} className="mr-2" /> Publish</>}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#121212] text-white hover:bg-[#E62329] rounded-full px-8 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 h-12"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] flex items-center gap-2">
              <Globe size={12} /> Primary Details (EN)
            </h4>
            <Input 
              id="name"
              label="Service Name" 
              placeholder="e.g. Engine Repair" 
              {...register('name')}
              error={errors.name?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                id="duration"
                label="Duration" 
                placeholder="e.g. 2-4 Hours" 
                {...register('duration')}
                error={errors.duration?.message}
              />
              <Input 
                id="basePrice"
                type="number"
                label="Base Price (AED)" 
                placeholder="0.00" 
                {...register('basePrice', { valueAsNumber: true })}
                error={errors.basePrice?.message}
              />
            </div>
            <Textarea 
              id="description"
              label="Description" 
              placeholder="Detailed explanation of the service..." 
              {...register('description')}
              error={errors.description?.message}
              rows={6}
            />
          </div>
        </div>

        <div className="space-y-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
              <Globe size={12} /> Arabic Translation (AR)
            </h4>
            <Input 
              id="nameAr"
              label="Arabic Name" 
              placeholder="اسم الخدمة..." 
              className="text-right font-arabic"
              {...register('nameAr')}
            />
            <Textarea 
              id="descriptionAr"
              label="Arabic Description" 
              placeholder="وصف الخدمة..." 
              className="text-right font-arabic"
              {...register('descriptionAr')}
              rows={6}
            />
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-gray-100 flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="text-red-500 border-red-100 hover:bg-red-50 rounded-full px-6 text-[10px] font-black uppercase tracking-widest"
        >
          <Trash2 size={14} className="mr-2" /> Delete Service
        </Button>
      </div>
    </form>
  )
}
