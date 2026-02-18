'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, Search, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getBrandsWithModels, getServices, getAvailableSlots } from '@/app/actions'
import { toast } from 'sonner'

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  brand: z.string().min(1, 'Please select a brand'),
  model: z.string().min(1, 'Please select a model'),
  service: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const STEPS = [
  { id: 1, title: 'Details', icon: '01', fields: ['fullName', 'email', 'phone'] as const },
  { id: 2, title: 'Vehicle', icon: '02', fields: ['brand', 'model'] as const },
  { id: 3, title: 'Service', icon: '03', fields: ['service'] as const },
  { id: 4, title: 'Slot', icon: '04', fields: ['date', 'time'] as const },
]

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [brandSearch, setBrandSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')

  const [brands, setBrands] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [slots, setSlots] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { 
      fullName: '', 
      email: '', 
      phone: '', 
      brand: '', 
      model: '', 
      service: '', 
      date: '', 
      time: '', 
      notes: '' 
    }
  })

  useEffect(() => {
    async function init() {
      try {
        const [b, s] = await Promise.all([getBrandsWithModels(), getServices()])
        setBrands(b)
        setServices(s)
      } catch (err) {
        console.error("Failed to fetch booking data:", err)
      } finally {
        setIsLoadingData(false)
      }
    }
    init()
  }, [])

  const selectedBrand = watch('brand')
  const selectedModel = watch('model')
  const selectedService = watch('service')
  const selectedDate = watch('date')
  const selectedTime = watch('time')

  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }
    async function fetchSlots() {
      try {
        const s = await getAvailableSlots(selectedDate)
        setSlots(s)
      } catch (err) {
        console.error("Failed to fetch slots:", err)
      }
    }
    fetchSlots()
  }, [selectedDate])

  const filteredBrands = useMemo(() =>
    brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    , [brandSearch, brands])

  const filteredModels = useMemo(() => {
    const brand = brands.find(b => b.id === selectedBrand || b.name === selectedBrand)
    if (!brand || !brand.models) return []
    return brand.models.filter((m: string) => m.toLowerCase().includes(modelSearch.toLowerCase()))
  }, [selectedBrand, modelSearch, brands])

  const nextStep = async () => {
    const fields = STEPS[currentStep - 1].fields
    const isValid = await trigger(fields)
    if (isValid) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    } else {
      toast.error(`Please complete the ${STEPS[currentStep - 1].title} section correctly.`)
    }
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep(prev => prev - 1)
  }

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      // Map 'service' to 'serviceId' for the API
      const apiData = {
        ...data,
        serviceId: data.service
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.message || result.error || result.details?.fieldErrors ? Object.values(result.details.fieldErrors).flat().join(', ') : 'Booking failed'
        throw new Error(errorMessage)
      }

      // Success - show confirmation screen
      setIsSubmitted(true)
      toast.success('Booking confirmed! Your appointment has been scheduled.')
    } catch (error: any) {
      console.error(error)
      const errorMsg = error.message || "Failed to confirm booking. Please try again."
      toast.error(errorMsg)
      // Don't reset form on error - let user fix and retry
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="booking" className="py-24 bg-white flex items-center min-h-[600px]">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#121212] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/10 blur-[100px] rounded-full" />
              <div className="w-24 h-24 bg-[#E62329] rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-[#E62329]/40">
                <Check size={48} className="text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-none italic">Access Granted</h3>
              <p className="text-gray-400 text-lg font-medium mb-12">
                Your luxury service is being prepared. Reference <span className="text-white font-bold">#SM-{(Math.random() * 10000).toFixed(0)}</span>
              </p>
              <Button
                variant="secondary"
                className="rounded-full px-12 py-6 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] hover:text-white transition-all shadow-xl"
                onClick={() => { setIsSubmitted(false); setCurrentStep(1); }}
              >
                Book Another Car
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="py-24 bg-[#FAFAF9] overflow-hidden min-h-[800px]">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] mb-6 italic">
            Secure your <span className="text-[#E62329]">Slot</span>
          </h2>

          <div className="flex justify-center items-center gap-2 md:gap-4 mt-12">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black transition-all duration-500 border-2",
                  currentStep >= s.id ? "bg-[#121212] text-white border-[#121212]" : "bg-transparent text-gray-300 border-gray-200"
                )}>
                  {currentStep > s.id ? <Check size={18} /> : s.icon}
                </div>
                {s.id !== STEPS.length && (
                  <div className={cn(
                    "w-8 md:w-16 h-[2px] mx-1 rounded-full transition-all duration-500",
                    currentStep > s.id ? "bg-[#121212]" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] mt-6">
            Phase {currentStep}: {STEPS[currentStep - 1].title}
          </p>
        </div>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#E62329]" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Initializing Database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={{
                  enter: (d) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d) => ({ x: d < 0 ? 100 : -100, opacity: 0 })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full"
              >
                {/* STEP 1: Details */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-white/50 shadow-sm">
                    <Input label="Owner Name" placeholder="e.g. John Doe" {...register('fullName')} error={errors.fullName?.message} />
                    <Input label="Secure Email" type="email" placeholder="owner@domain.com" {...register('email')} error={errors.email?.message} />
                    <Input label="Phone Contact" type="tel" placeholder="+971 XX XXX XXXX" {...register('phone')} error={errors.phone?.message} />
                  </div>
                )}

                {/* STEP 2: Vehicle */}
                {currentStep === 2 && (
                  <div className="space-y-12">
                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/50 shadow-sm">
                      <div className="flex items-center justify-between mb-8 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]">1. Select Brand</span>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            placeholder="Find Brand..."
                            className="bg-gray-100/50 rounded-full py-2 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#E62329] w-48 transition-all"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[500px] overflow-y-auto p-4 subtle-scrollbar">
                        {filteredBrands.length > 0 ? (
                          filteredBrands.map((b) => (
                            <div key={b.id} className="relative group">
                              <button
                                type="button"
                                onClick={() => { setValue('brand', b.name); setValue('model', ''); setModelSearch('') }}
                                className={cn(
                                  "w-full aspect-square rounded-[2rem] flex items-center justify-center bg-white border-2 transition-all duration-500 relative overflow-hidden p-6 shadow-sm",
                                  selectedBrand === b.name
                                    ? "border-[#E62329] bg-white ring-4 ring-[#E62329]/10 shadow-xl scale-[1.02]"
                                    : "border-transparent hover:border-gray-200 hover:shadow-lg hover:scale-[1.02]"
                                )}
                                title={b.name}
                              >
                                <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                                  <img
                                    src={b.logoFile ? `/brands-carousel/${b.logoFile}` : `/bg-placeholder.jpg`}
                                    alt={b.name}
                                    className={cn(
                                      "w-[80%] h-[80%] object-contain transition-all duration-500",
                                      selectedBrand === b.name ? "opacity-100 scale-110" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                                    )}
                                    onError={(e) => {
                                      e.currentTarget.src = `/bg-placeholder.jpg`
                                    }}
                                  />
                                </div>
                                {selectedBrand === b.name && (
                                  <motion.div
                                    layoutId="activeBrand"
                                    className="absolute inset-0 bg-[#E62329]/5 pointer-events-none rounded-[2rem]"
                                  />
                                )}
                              </button>
                              {/* Tooltip - only show on hover */}
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                                {b.name}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-12 text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 italic">No brands matching your search</p>
                          </div>
                        )}
                      </div>
                      {errors.brand && <p className="text-center text-[10px] text-[#E62329] mt-4 font-black uppercase">{errors.brand.message}</p>}
                    </div>

                    {selectedBrand && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/50 shadow-sm">
                        <div className="text-center mb-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]">2. Select Model</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[250px] overflow-y-auto p-2 subtle-scrollbar">
                          {filteredModels.map((m: string) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setValue('model', m)}
                              className={cn(
                                "px-6 py-4 rounded-2xl flex items-center justify-center text-center bg-white border-2 transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
                                selectedModel === m ? "border-[#121212] bg-[#121212] text-white shadow-xl scale-105" : "border-transparent shadow-sm hover:border-gray-200 text-gray-500 hover:text-[#121212]"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                        {errors.model && <p className="text-center text-[10px] text-[#E62329] mt-4 font-black uppercase">{errors.model.message}</p>}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 3: Service */}
                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setValue('service', s.id)}
                        className={cn(
                          "p-8 rounded-[2.5rem] bg-white border-2 text-left transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between group relative overflow-hidden",
                          selectedService === s.id ? "border-[#E62329] shadow-2xl shadow-[#E62329]/10" : "border-transparent shadow-sm hover:border-gray-200"
                        )}
                      >
                        <div>
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                            selectedService === s.id ? "bg-[#E62329] text-white rotate-12" : "bg-gray-50 text-gray-400 group-hover:bg-[#121212] group-hover:text-white"
                          )}>
                            <CheckCircle2 size={28} />
                          </div>
                          <h4 className="font-black text-[#121212] uppercase tracking-tighter text-lg leading-none mb-3 italic">{s.name}</h4>
                          <p className="text-[11px] font-semibold text-gray-400 leading-relaxed uppercase tracking-wider">{s.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-50">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E62329]">
                            <Clock size={14} />
                            <span>{s.duration}</span>
                          </div>
                        </div>
                        {selectedService === s.id && (
                          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#E62329] rotate-45" />
                        )}
                      </button>
                    ))}
                    <div className="col-span-full">
                      {errors.service && <p className="text-center text-[10px] text-[#E62329] mt-6 font-black uppercase tracking-widest">{errors.service.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 4: Slot */}
                {currentStep === 4 && (
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="flex items-center gap-3 mb-8 text-[#E62329]">
                          <CalendarIcon size={20} />
                          <span className="text-xs font-black uppercase tracking-[0.2em]">Deployment Date</span>
                        </div>
                        <input
                          type="date"
                          {...register('date')}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-[#121212] focus:outline-none focus:border-[#E62329] focus:bg-white transition-all uppercase tracking-widest"
                        />
                        {errors.date && <p className="text-[10px] text-[#E62329] mt-4 font-black uppercase">{errors.date.message}</p>}
                      </div>

                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8 text-[#E62329]">
                          <Clock size={20} />
                          <span className="text-xs font-black uppercase tracking-[0.2em]">Select Window</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto subtle-scrollbar pr-2">
                          {!selectedDate && <p className="col-span-3 text-[10px] font-black uppercase tracking-widest text-gray-300 text-center py-8 italic">Choose date first</p>}
                          {selectedDate && slots.length === 0 && <p className="col-span-3 text-[10px] font-black uppercase tracking-widest text-gray-300 text-center py-8 italic">No slots found</p>}
                          {slots.map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setValue('time', t)}
                              className={cn(
                                "py-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                selectedTime === t ? "bg-[#121212] text-white border-[#121212] shadow-lg scale-105" : "bg-transparent text-gray-400 border-gray-50 hover:border-gray-200"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        {errors.time && <p className="text-[10px] text-[#E62329] mt-4 font-black uppercase">{errors.time.message}</p>}
                      </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                      <Textarea 
                        label="Special Technical Instructions (Optional)" 
                        placeholder="Detail any specific vehicle performance issues..." 
                        {...register('notes')} 
                        className="bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between max-w-md mx-auto mt-20 px-6">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={prevStep} 
                  className="rounded-full h-14 w-14 p-0 border-2 border-gray-100 hover:bg-[#121212] hover:text-white transition-all duration-500"
                >
                  <ChevronLeft size={24} />
                </Button>
              )}

              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="ml-auto bg-[#121212] text-white rounded-full px-12 h-14 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#E62329] transition-all duration-500 shadow-2xl flex items-center gap-3 group"
                >
                  Advance
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  className="ml-auto bg-[#E62329] text-white rounded-full px-14 h-14 text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all duration-500 shadow-2xl shadow-[#E62329]/20 italic"
                >
                  Finalize Booking
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
