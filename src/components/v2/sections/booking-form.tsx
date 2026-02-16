'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, Search, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import { getBrandsWithModels, getServices, getAvailableSlots } from '@/app/actions'
import { useLanguage } from '@/lib/language-context'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

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
    const { isRTL } = useLanguage()
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [currentStep, setCurrentStep] = useState(1)
    const [direction, setDirection] = useState(0) // -1 for back, 1 for next

    // Animation controls for shake
    const controls = useAnimation()

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
        if (!brand || !brand.models) return []
        const modelList = typeof brand.models === 'string' ? brand.models.split(',').map((m: string) => m.trim()) : brand.models
        return modelList.filter((m: string) => m.toLowerCase().includes(modelSearch.toLowerCase()))
    }, [selectedBrand, modelSearch, brands])

    const nextStep = async () => {
        const fields = STEPS[currentStep - 1].fields
        const isValid = await trigger(fields)
        if (isValid) {
            setDirection(1)
            setCurrentStep(prev => prev + 1)
        } else {
            // Trigger Shake Animation on Error
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            })
        }
    }

    const prevStep = () => {
        setDirection(-1)
        setCurrentStep(prev => prev - 1)
    }

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true)
        try {
            let recaptchaToken = ''
            if (executeRecaptcha) {
                recaptchaToken = await executeRecaptcha('booking_submit')
            }

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, recaptchaToken })
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
            <section id="booking" className="py-24 bg-gray-50 flex items-center min-h-[600px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#E62329]/5 pointer-events-none" />
                <div className="max-w-3xl mx-auto px-6 w-full relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-[#121212] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/20 blur-[100px] rounded-full pointer-events-none" />

                            <div className="w-24 h-24 bg-[#E62329] rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-[#E62329]/30 animate-in zoom-in duration-500">
                                <Check size={48} className="text-white" strokeWidth={3} />
                            </div>

                            <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">Booking Confirmed</h3>

                            <p className="text-gray-400 text-lg font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                                Your request <span className="text-white font-bold bg-[#E62329]/20 px-2 py-0.5 rounded-md border border-[#E62329]/30">#SM-{(Math.random() * 10000).toFixed(0)}</span> has been successfully registered. You will receive a confirmation shortly.
                            </p>

                            <Button
                                className="bg-white text-[#121212] rounded-full px-12 py-6 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                                onClick={() => { setIsSubmitted(false); setCurrentStep(1); }}
                            >
                                Book Another Service
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <section id="booking" className="py-24 bg-gray-50 overflow-hidden min-h-[800px] relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E62329]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden p-8 md:p-14 relative">

                    {/* Header Area */}
                    <div className="text-center mb-12">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                            Effortless Scheduling
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9] mb-8">
                            Start Your <span className="silver-shine">Engine</span>
                        </h2>

                        {/* Progress Stepper */}
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                {STEPS.map((s) => (
                                    <div key={s.id} className="flex items-center">
                                        <Tooltip content={s.title} position="top">
                                            <div className={cn(
                                                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black transition-all duration-300 border-2",
                                                currentStep >= s.id
                                                    ? "bg-[#121212] text-white border-[#121212] shadow-md"
                                                    : "bg-white text-gray-300 border-gray-100"
                                            )}>
                                                {currentStep > s.id ? <Check size={14} strokeWidth={3} /> : s.icon}
                                            </div>
                                        </Tooltip>
                                        {s.id !== STEPS.length && (
                                            <div className={cn(
                                                "w-8 md:w-16 h-0.5 mx-2 rounded-full transition-all duration-500",
                                                currentStep > s.id ? "bg-[#121212]" : "bg-gray-100"
                                            )} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-6 bg-gray-50 inline-block px-4 py-1.5 rounded-full border border-gray-100">
                            Step {currentStep}: <span className="text-[#121212]">{STEPS[currentStep - 1].title}</span>
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
                                <motion.div animate={controls}>
                                    {/* STEP 1: Details */}
                                    {currentStep === 1 && (
                                        <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
                                            <Input
                                                label="Full Name"
                                                placeholder="e.g. John Doe"
                                                {...register('fullName')}
                                                error={errors.fullName?.message}
                                                inputClassName="bg-gray-50 border-0 rounded-2xl h-14 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all"
                                            />
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                placeholder="john@example.com"
                                                {...register('email')}
                                                error={errors.email?.message}
                                                inputClassName="bg-gray-50 border-0 rounded-2xl h-14 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all"
                                            />
                                            <Input
                                                label="Phone Number"
                                                type="tel"
                                                placeholder="+971 50 123 4567"
                                                {...register('phone')}
                                                error={errors.phone?.message}
                                                inputClassName="bg-gray-50 border-0 rounded-2xl h-14 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all"
                                            />

                                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl mt-4 border border-blue-100">
                                                <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                                                    Your personal updates and booking confirmation will be sent via WhatsApp and Email securely.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Vehicle */}
                                    {currentStep === 2 && (
                                        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
                                            {/* Brand */}
                                            <div>
                                                <div className="flex items-center justify-between mb-6 px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Brand</span>
                                                    <div className="relative group">
                                                        <Search className="absolute left-0 top-2 text-gray-400 group-focus-within:text-[#E62329] transition-colors" size={14} />
                                                        <input
                                                            placeholder="Find Brand..."
                                                            className="bg-transparent border-b-2 border-gray-100 py-1.5 pl-6 text-xs focus:outline-none focus:border-[#E62329] w-32 font-bold uppercase tracking-wide transition-colors"
                                                            value={brandSearch}
                                                            onChange={(e) => setBrandSearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[320px] overflow-y-auto p-2 subtle-scrollbar">
                                                    {filteredBrands.map((b) => (
                                                        <button
                                                            key={b.id}
                                                            type="button"
                                                            onClick={() => { setValue('brand', b.id); setValue('model', ''); setModelSearch('') }}
                                                            className={cn(
                                                                "aspect-square rounded-2xl flex flex-col items-center justify-center bg-gray-50 border-2 transition-all duration-200 gap-3 group relative overflow-hidden p-3",
                                                                selectedBrand === b.id
                                                                    ? "border-[#E62329] bg-white shadow-lg scale-105"
                                                                    : "border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md"
                                                            )}
                                                        >
                                                            {b.logoFile ? (
                                                                <div className="w-10 h-10 flex items-center justify-center relative">
                                                                    <img
                                                                        src={`/brands/${b.logoFile}`}
                                                                        alt={b.name}
                                                                        className={cn(
                                                                            "w-full h-full object-contain transition-all duration-300",
                                                                            selectedBrand === b.id ? "grayscale-0 scale-110" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                                                                        )}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">{b.name.substring(0, 2)}</div>
                                                            )}
                                                            <span className={cn(
                                                                "text-[8px] font-black uppercase tracking-tight text-center transition-colors",
                                                                selectedBrand === b.id ? "text-[#E62329]" : "text-gray-400 group-hover:text-[#121212]"
                                                            )}>{b.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                {errors.brand && <p className="text-center text-[10px] text-[#E62329] mt-3 font-bold bg-[#E62329]/5 py-2 rounded-lg">{errors.brand.message}</p>}
                                            </div>

                                            {/* Model */}
                                            {selectedBrand && (
                                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-gray-100 pt-8">
                                                    <div className="text-center mb-6">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Select Model</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-2 subtle-scrollbar">
                                                        {filteredModels.map((m: string) => (
                                                            <button
                                                                key={m}
                                                                type="button"
                                                                onClick={() => setValue('model', m)}
                                                                className={cn(
                                                                    "px-4 py-4 rounded-2xl flex items-center justify-center text-center border-2 transition-all duration-200 font-bold text-xs uppercase tracking-wide",
                                                                    selectedModel === m
                                                                        ? "border-[#121212] bg-[#121212] text-white shadow-lg"
                                                                        : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#121212]"
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
                                                        "p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group h-full relative overflow-hidden",
                                                        selectedService === s.id
                                                            ? "border-[#E62329] bg-white shadow-xl shadow-[#E62329]/10 ring-4 ring-[#E62329]/5"
                                                            : "border-transparent bg-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-lg"
                                                    )}
                                                >
                                                    {selectedService === s.id && <div className="absolute top-0 right-0 w-20 h-20 bg-[#E62329]/5 rounded-bl-[4rem]" />}

                                                    <div>
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm",
                                                            selectedService === s.id
                                                                ? "bg-[#E62329] text-white rotate-3 scale-110"
                                                                : "bg-white text-gray-400 group-hover:text-[#E62329]"
                                                        )}>
                                                            <CheckCircle2 size={24} strokeWidth={selectedService === s.id ? 2.5 : 2} />
                                                        </div>
                                                        <h4 className="font-black text-[#121212] uppercase tracking-tighter text-sm leading-tight mb-2.5">{s.name}</h4>
                                                        <p className="text-[11px] font-medium text-gray-500 leading-relaxed group-hover:text-gray-600">{s.description}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-100/50 group-hover:border-gray-100 transition-colors">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 group-hover:text-[#E62329] transition-colors uppercase tracking-wider">
                                                            <Clock size={12} />
                                                            <span>{s.duration}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            <div className="col-span-full">
                                                {errors.service && <p className="text-center text-[10px] text-[#E62329] mt-4 font-bold bg-[#E62329]/5 py-2 rounded-lg">{errors.service.message}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: Slot */}
                                    {currentStep === 4 && (
                                        <div className="max-w-3xl mx-auto space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                                {/* Date Picker */}
                                                <div className="bg-gray-50 p-8 rounded-[2rem] border border-transparent shadow-inner group hover:bg-white hover:shadow-lg hover:border-gray-100 transition-all">
                                                    <div className="flex items-center gap-3 mb-6 text-[#E62329]">
                                                        <div className="w-8 h-8 rounded-full bg-[#E62329]/10 flex items-center justify-center">
                                                            <CalendarIcon size={16} />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-[#121212]">Preferred Date</span>
                                                    </div>
                                                    <input
                                                        type="date"
                                                        {...register('date')}
                                                        className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212] focus:border-transparent transition-all shadow-sm cursor-pointer"
                                                    />
                                                    {errors.date && <p className="text-[10px] text-[#E62329] mt-3 font-bold pl-2">{errors.date.message}</p>}
                                                </div>

                                                {/* Time Slots */}
                                                <div className="bg-gray-50 p-8 rounded-[2rem] border border-transparent shadow-inner group hover:bg-white hover:shadow-lg hover:border-gray-100 transition-all">
                                                    <div className="flex items-center gap-3 mb-6 text-[#E62329]">
                                                        <div className="w-8 h-8 rounded-full bg-[#E62329]/10 flex items-center justify-center">
                                                            <Clock size={16} />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-[#121212]">Preferred Time</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto subtle-scrollbar pr-1">
                                                        {!selectedDate && <p className="col-span-3 text-[10px] text-gray-400 text-center py-8 font-medium">Please select a date first</p>}
                                                        {selectedDate && slots.length === 0 && <p className="col-span-3 text-[10px] text-center text-gray-400 py-8 font-medium">No slots available</p>}
                                                        {slots.map(t => (
                                                            <button
                                                                key={t}
                                                                type="button"
                                                                onClick={() => setValue('time', t)}
                                                                className={cn(
                                                                    "py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all duration-200",
                                                                    selectedTime === t
                                                                        ? "bg-[#121212] text-white border-[#121212] shadow-md scale-105"
                                                                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-[#121212]"
                                                                )}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.time && <p className="text-[10px] text-[#E62329] mt-3 font-bold pl-2">{errors.time.message}</p>}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Textarea
                                                    label="Special Requirements (Optional)"
                                                    placeholder="Any specific issues with the vehicle or details we should know?"
                                                    {...register('notes')}
                                                    className="bg-gray-50 border-0 rounded-2xl min-h-[120px] p-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center max-w-lg mx-auto mt-14 px-4 pt-8 border-t border-gray-100">

                            <div className="w-12">
                                {currentStep > 1 && (
                                    <Tooltip content="Go back" position="top">
                                        <Button type="button" variant="ghost" onClick={prevStep} className="rounded-full h-12 w-12 p-0 text-gray-400 hover:text-[#121212] hover:bg-gray-100 transition-colors">
                                            <ChevronLeft size={24} />
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>

                            {currentStep < 4 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-[#121212] text-white rounded-full px-12 h-14 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#E62329] transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 group"
                                >
                                    Next Step
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="bg-[#E62329] text-white rounded-full px-12 h-14 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#121212] transition-colors shadow-xl shadow-[#E62329]/30 hover:shadow-2xl hover:scale-105"
                                >
                                    Confirm Booking
                                </Button>
                            )}

                            <div className="w-12"></div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
