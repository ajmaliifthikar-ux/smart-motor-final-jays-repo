'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Eye, EyeOff, Sun, Moon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').or(z.string().length(0)).optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
  isVisible: z.boolean(),
  theme: z.enum(['light', 'dark', 'glass']),
})

export type ContentFormData = z.infer<typeof contentSchema>

interface EditContentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ContentFormData) => Promise<void>
  initialData?: Partial<ContentFormData>
  sectionName: string
}

export function EditContentDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  sectionName
}: EditContentDialogProps) {
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      body: initialData?.body || '',
      imageUrl: initialData?.imageUrl || '',
      ctaLabel: initialData?.ctaLabel || '',
      ctaLink: initialData?.ctaLink || '',
      isVisible: initialData?.isVisible ?? true,
      theme: initialData?.theme || 'light',
    }
  })

  const isVisible = watch('isVisible')
  const currentTheme = watch('theme')

  const onSubmit = async (data: ContentFormData) => {
    try {
      await onSave(data)
      onClose()
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
            Edit <span className="text-[#E62329]">{sectionName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Modify text, media, and call-to-action for this section.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid gap-4">
            <Input 
              id="title"
              label="Main Heading" 
              placeholder="Enter section title..." 
              {...register('title')} 
              error={errors.title?.message}
            />
            
            <Input 
              id="subtitle"
              label="Sub-heading" 
              placeholder="Enter sub-title..." 
              {...register('subtitle')} 
              error={errors.subtitle?.message}
            />

            <Textarea 
              id="body"
              label="Body Content" 
              placeholder="Enter main text content..." 
              {...register('body')} 
              error={errors.body?.message}
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Visibility</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('isVisible', true)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                      isVisible ? "bg-[#121212] text-white border-[#121212] shadow-lg" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <Eye size={14} /> Visible
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('isVisible', false)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                      !isVisible ? "bg-[#E62329] text-white border-[#E62329] shadow-lg" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <EyeOff size={14} /> Hidden
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Theme</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'light', icon: Sun, label: 'Light' },
                    { id: 'dark', icon: Moon, label: 'Dark' },
                    { id: 'glass', icon: Sparkles, label: 'Glass' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setValue('theme', theme.id as any)}
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl border-2 transition-all font-black text-[8px] uppercase tracking-tighter",
                        currentTheme === theme.id 
                          ? "bg-[#121212] text-white border-[#121212] shadow-md" 
                          : "bg-white text-gray-400 border-gray-50 hover:border-gray-200"
                      )}
                    >
                      <theme.icon size={14} />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <Input 
                id="imageUrl"
                label="Media URL (Image/Video)" 
                placeholder="https://..." 
                {...register('imageUrl')} 
                error={errors.imageUrl?.message}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  id="ctaLabel"
                  label="Button Label" 
                  placeholder="e.g. Book Now" 
                  {...register('ctaLabel')} 
                  error={errors.ctaLabel?.message}
                />
                <Input 
                  id="ctaLink"
                  label="Button Link" 
                  placeholder="#booking" 
                  {...register('ctaLink')} 
                  error={errors.ctaLink?.message}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#121212] text-white hover:bg-[#E62329] rounded-full px-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
