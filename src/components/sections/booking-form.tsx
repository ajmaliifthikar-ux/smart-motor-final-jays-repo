'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, Search, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getBrandsWithModels, getServices, getAvailableSlots } from '@/app/actions'

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

// Define steps for cleaner logic
const STEPS = [
  { id: 1, title: 'Details', icon: '01', fields: ['fullName', 'email', 'phone'] as const },
  { id: 2, title: 'Vehicle', icon: '02', fields: ['brand', 'model'] as const },
  { id: 3, title: 'Service', icon: '03', fields: ['service'] as const },
  { id: 4, title: 'Slot', icon: '04', fields: ['date', 'time'] as const },
]

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0) // -1 for back, 1 for next

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [brandSearch, setBrandSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')

  // Dynamic Data State
  const [brands, setBrands] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [slots, setSlots] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { brand: '', model: '' }
  })

  // Fetch Initial Data
  useEffect(() => {
    async function init() {
      const [b, s] = await Promise.all([getBrandsWithModels(), getServices()])
      setBrands(b)
      setServices(s)
    }
    init()
  }, [])

  const selectedBrand = watch('brand')
  const selectedModel = watch('model')
  const selectedService = watch('service')
  const selectedDate = watch('date')
  const selectedTime = watch('time')

  // Fetch Slots on Date Change
  useEffect(() => {
    if (!selectedDate) return
    async function fetchSlots() {
      const s = await getAvailableSlots(selectedDate)
      setSlots(s)
    }
    fetchSlots()
  }, [selectedDate])

  const filteredBrands = useMemo(() =>
    brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    , [brandSearch, brands])

  const filteredModels = useMemo(() => {
    const brand = brands.find(b => b.id === selectedBrand)
    if (!brand) return []
    return brand.models.filter((m: string) => m.toLowerCase().includes(modelSearch.toLowerCase()))
  }, [selectedBrand, modelSearch, brands])

  const nextStep = async () => {
    const fields = STEPS[currentStep - 1].fields
    const isValid = await trigger(fields)
    if (isValid) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep(prev => prev - 1)
  }

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          alert(result.message)
        } else {
          throw new Error(result.error || 'Booking failed')
        }
        return
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
      alert("Failed to confirm booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  if (isSubmitted) {
    return (
      <section id="booking" className="py-24 bg-white flex items-center min-h-[600px]">
        <div className="max-w-3xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-black rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl mobile-glass-fix">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/10 blur-[100px] rounded-full" />
              <div className="w-24 h-24 bg-[#E62329] rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-[#E62329]/40">
                <Check size={48} className="text-black" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">Access Granted</h3>
              <p className="text-gray-400 text-lg font-medium mb-12">
                Your booking reference <span className="text-white font-bold">#SM-{(Math.random() * 10000).toFixed(0)}</span> has been registered.
              </p>
              <Button
                className="bg-white text-black rounded-full px-12 py-6 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] hover:text-white transition-all shadow-xl"
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
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-[0.9] mb-4">
            Book <span className="silver-shine">Service</span>
          </h2>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-2 md:gap-4 mt-8">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-300",
                  currentStep >= s.id ? "bg-[#121212] text-white" : "bg-gray-200 text-gray-400"
                )}>
                  {currentStep > s.id ? <Check size={14} /> : s.icon}
                </div>
                {s.id !== STEPS.length && (
                  <div className={cn(
                    "w-6 md:w-12 h-0.5 mx-2 rounded-full transition-all duration-300",
                    currentStep > s.id ? "bg-[#121212]" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E62329] mt-4">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-[400px]">
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              {/* STEP 1: Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
                  <Input label="Full Name" placeholder="Leslie Alexander" {...register('fullName')} error={errors.fullName?.message} />
                  <Input label="Email" type="email" placeholder="name@example.com" {...register('email')} error={errors.email?.message} />
                  <Input label="Phone" type="tel" placeholder="+971 XX XXX XXXX" {...register('phone')} error={errors.phone?.message} />
                </div>
              )}

              {/* STEP 2: Vehicle */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
                  {/* Brand */}
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Brand</span>
                      <div className="relative">
                        <Search className="absolute left-0 top-1.5 text-black" size={14} />
                        <input
                          placeholder="Search..."
                          className="bg-transparent border-b border-gray-200 py-1 pl-6 text-xs focus:outline-none focus:border-black w-32 font-bold"
                          value={brandSearch}
                          onChange={(e) => setBrandSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-2 subtle-scrollbar">
                      {filteredBrands.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { setValue('brand', b.id); setValue('model', ''); setModelSearch('') }}
                          className={cn(
                            "aspect-square rounded-2xl flex flex-col items-center justify-center bg-white border transition-all duration-200 gap-2 group relative overflow-hidden p-2",
                            selectedBrand === b.id ? "border-[#E62329] bg-[#E62329]/5 shadow-md scale-105" : "border-gray-100 hover:border-gray-200 hover:scale-105"
                          )}
                        >
                          {b.logoFile ? (
                            <div className="w-10 h-10 flex items-center justify-center">
                              <img src={`/brands/${b.logoFile}`} alt={b.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">{b.name.substring(0, 2)}</div>
                          )}
                          <span className="text-[8px] font-black uppercase tracking-tight text-center">{b.name}</span>
                        </button>
                      ))}
                    </div>
                    {errors.brand && <p className="text-center text-[10px] text-[#E62329] mt-2 font-bold">{errors.brand.message}</p>}
                  </div>

                  {/* Model */}
                  {selectedBrand && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="text-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Model</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-2 subtle-scrollbar">
                        {filteredModels.map((m: string) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setValue('model', m)}
                            className={cn(
                              "px-4 py-3 rounded-xl flex items-center justify-center text-center bg-white border transition-all duration-200 font-bold text-xs",
                              selectedModel === m ? "border-black bg-black text-white shadow-lg" : "border-gray-100 hover:border-gray-200 text-gray-600"
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {errors.model && <p className="text-center text-[10px] text-[#E62329] mt-2 font-bold">{errors.model.message}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Service */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setValue('service', s.id)}
                      className={cn(
                        "p-6 rounded-2xl bg-white border text-left transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between group",
                        selectedService === s.id ? "border-[#E62329] ring-1 ring-[#E62329] shadow-xl shadow-[#E62329]/10" : "border-gray-100 shadow-sm hover:border-gray-300"
                      )}
                    >
                      <div>
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                          selectedService === s.id ? "bg-[#E62329] text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                        )}>
                          <CheckCircle2 size={24} />
                        </div>
                        <h4 className="font-black text-black uppercase tracking-tighter text-sm leading-tight mb-2">{s.name}</h4>
                        <p className="text-[11px] font-medium text-gray-400 leading-relaxed">{s.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Clock size={12} />
                          <span>{s.duration} mins</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="col-span-full">
                    {errors.service && <p className="text-center text-[10px] text-[#E62329] mt-3 font-bold">{errors.service.message}</p>}
                  </div>
                </div>
              )}

              {/* STEP 4: Slot */}
              {currentStep === 4 && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-[#E62329]">
                        <CalendarIcon size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Select Date</span>
                      </div>
                      <input
                        type="date"
                        {...register('date')}
                        className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                      {errors.date && <p className="text-[10px] text-[#E62329] mt-2 font-bold">{errors.date.message}</p>}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-[#E62329]">
                        <Clock size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Select Time</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto subtle-scrollbar pr-1">
                        {!selectedDate && <p className="col-span-3 text-[10px] text-gray-400 text-center py-4">Please select a date first</p>}
                        {selectedDate && slots.length === 0 && <p className="col-span-3 text-[10px] text-center text-gray-400 py-4">No slots available</p>}
                        {slots.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setValue('time', t)}
                            className={cn(
                              "py-2 rounded-lg border text-[10px] font-black uppercase transition-all",
                              selectedTime === t ? "bg-black text-white border-black shadow-md scale-105" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {errors.time && <p className="text-[10px] text-[#E62329] mt-2 font-bold">{errors.time.message}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Textarea label="Special Requirements (Optional)" placeholder="Any specific issues with the vehicle?" {...register('notes')} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between max-w-md mx-auto mt-12 px-6">
            {currentStep > 1 && (
              <Button type="button" variant="ghost" onClick={prevStep} className="rounded-full h-12 w-12 p-0 border border-gray-200">
                <ChevronLeft size={20} />
              </Button>
            )}

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep} className="ml-auto bg-[#121212] text-white rounded-full px-8 h-12 text-xs font-black uppercase tracking-widest hover:bg-[#E62329] transition-colors shadow-lg flex items-center gap-2">
                Next Step
                <ChevronRight size={14} />
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} className="ml-auto bg-[#E62329] text-white rounded-full px-10 h-12 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-xl shadow-[#E62329]/20">
                Confirm Booking
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
