'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, Search, CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, ShieldCheck, Loader2, Car, Wrench, Calendar, Info, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import { getBrandsWithModels, getServices, getAvailableSlots } from '@/app/actions'
import { useLanguage } from '@/lib/language-context'
import { toast } from 'sonner'
import { trackEvent } from '@/components/analytics/GoogleAnalytics'

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
    { id: 1, title: 'Details', icon: <User className="w-4 h-4" />, fields: ['fullName', 'email', 'phone'] as const },
    { id: 2, title: 'Vehicle', icon: <Car className="w-4 h-4" />, fields: ['brand', 'model'] as const },
    { id: 3, title: 'Service', icon: <Wrench className="w-4 h-4" />, fields: ['service'] as const },
    { id: 4, title: 'Schedule', icon: <Calendar className="w-4 h-4" />, fields: ['date', 'time'] as const },
]

export function BookingForm() {
    const { isRTL } = useLanguage()
    const [currentStep, setCurrentStep] = useState(1)
    const [direction, setDirection] = useState(0)
    const controls = useAnimation()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [brandSearch, setBrandSearch] = useState('')
    const [modelSearch, setModelSearch] = useState('')

    const [brands, setBrands] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [slots, setSlots] = useState<string[]>([])

    const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { brand: '', model: '', service: '', date: '', time: '' }
    })

    useEffect(() => {
        async function init() {
            try {
                const [b, s] = await Promise.all([getBrandsWithModels(), getServices()])
                setBrands(b || [])
                setServices(s || [])
            } catch (err) {
                console.error("Failed to load booking data:", err)
                toast.error("Connectivity issue. Please refresh the page.")
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
        if (!selectedDate) return
        async function fetchSlots() {
            try {
                const s = await getAvailableSlots(selectedDate)
                setSlots(s || [])
            } catch (err) {
                console.error("Error fetching slots:", err)
            }
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
            window.scrollTo({ top: document.getElementById('booking')?.offsetTop ? document.getElementById('booking')!.offsetTop - 100 : 0, behavior: 'smooth' })
        } else {
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
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || result.error || 'Booking failed')
            }

            setIsSubmitted(true)
            toast.success("Booking confirmed successfully!")
            trackEvent('booking_submitted', 'Booking', data.service, 1)
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to confirm booking. Please try again.")
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
                        <div className="bg-[#121212] rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl border border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/20 blur-[100px] rounded-full pointer-events-none" />
                            <div className="w-24 h-24 bg-[#E62329] rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-[#E62329]/30">
                                <Check size={48} className="text-white" strokeWidth={3} />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-none italic">Success!</h3>
                            <p className="text-gray-400 text-lg font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                                Your engine is starting! We've received your booking request and our team will contact you shortly to confirm the details.
                            </p>
                            <Button
                                className="bg-white text-[#121212] rounded-full px-12 py-7 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
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
        <section id="booking" className="py-24 bg-[#FAFAF9] overflow-hidden min-h-[900px] relative technical-grid">
            <div className="absolute inset-0 micro-noise opacity-5" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
                        Seamless Performance
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic">
                        BOOK YOUR <br />
                        <span className="silver-shine leading-none">SERVICE</span>
                    </h2>
                </div>

                {/* Stepper Integration */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="flex justify-between items-center relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-10" />
                        {STEPS.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <motion.div 
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg relative overflow-hidden",
                                        currentStep >= s.id ? "bg-[#121212] text-white scale-110" : "bg-white text-gray-300 border border-gray-100"
                                    )}
                                    animate={currentStep === s.id ? { y: -5 } : { y: 0 }}
                                >
                                    {currentStep > s.id ? <Check size={18} strokeWidth={3} className="text-[#E62329]" /> : s.icon}
                                    {currentStep === s.id && <div className="absolute inset-0 bg-gradient-to-tr from-[#E62329]/20 to-transparent pointer-events-none" />}
                                </motion.div>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    currentStep >= s.id ? "text-[#121212]" : "text-gray-300"
                                )}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-[3.5rem] shadow-precision border border-gray-100/50 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-bl-[10rem] -z-10" />
                    
                    {isLoadingData ? (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-[#E62329] animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Fleet Data...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-[450px]">
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
                                        {/* STEP 1: Personal Details */}
                                        {currentStep === 1 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                                <div className="space-y-8">
                                                    <Input
                                                        label="Owner Name"
                                                        placeholder="Enter your full name"
                                                        {...register('fullName')}
                                                        error={errors.fullName?.message}
                                                        inputClassName="bg-gray-50/50 border-0 rounded-2xl h-16 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all field-depth"
                                                    />
                                                    <Input
                                                        label="Contact Number"
                                                        type="tel"
                                                        placeholder="+971 50 000 0000"
                                                        {...register('phone')}
                                                        error={errors.phone?.message}
                                                        inputClassName="bg-gray-50/50 border-0 rounded-2xl h-16 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all field-depth"
                                                    />
                                                    <Input
                                                        label="Email Address"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        {...register('email')}
                                                        error={errors.email?.message}
                                                        inputClassName="bg-gray-50/50 border-0 rounded-2xl h-16 pl-6 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all field-depth"
                                                    />
                                                </div>
                                                <div className="bg-[#121212] rounded-[2.5rem] p-10 text-white italic relative overflow-hidden shadow-2xl flex flex-col justify-center carbon-fiber">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl opacity-50" />
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E62329]">
                                                            <ShieldCheck size={24} fill="currentColor" />
                                                        </div>
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-white">Privacy First</h3>
                                                    </div>
                                                    <p className="text-white/70 font-medium leading-relaxed text-sm">
                                                        Your contact details are encrypted and used only for service updates via WhatsApp and Email. No spam, just elite service.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 2: Vehicle Selection - Premium Picker */}
                                        {currentStep === 2 && (
                                            <div className="space-y-12">
                                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                                    {/* Brands Grid */}
                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-center justify-between mb-8 px-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E62329]">01</span>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Select Brand</span>
                                                            </div>
                                                            <div className="relative group">
                                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                                <input
                                                                    placeholder="Search..."
                                                                    className="bg-gray-50/50 border-0 rounded-full py-3 pl-10 pr-6 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#121212] w-48 font-bold transition-all"
                                                                    value={brandSearch}
                                                                    onChange={(e) => setBrandSearch(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2 subtle-scrollbar">
                                                            {filteredBrands.length > 0 ? (
                                                                filteredBrands.map((b) => (
                                                                    <button
                                                                        key={b.id}
                                                                        type="button"
                                                                        onClick={() => { setValue('brand', b.id); setValue('model', ''); setModelSearch('') }}
                                                                        className={cn(
                                                                            "relative group aspect-[4/3] rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/50 border-2 transition-all duration-500 overflow-hidden",
                                                                            selectedBrand === b.id
                                                                                ? "border-[#121212] bg-white shadow-precision scale-105 z-10"
                                                                                : "border-transparent hover:border-gray-200 hover:bg-white"
                                                                        )}
                                                                    >
                                                                        <div className="w-12 h-12 flex items-center justify-center mb-3">
                                                                            <img
                                                                                src={b.logoUrl || (b.logoFile ? `/brands-carousel/${b.logoFile}` : '/branding/logo.png')}
                                                                                alt={b.name}
                                                                                className={cn(
                                                                                    "w-full h-full object-contain transition-all duration-700",
                                                                                    selectedBrand === b.id ? "grayscale-0 scale-110" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <span className={cn(
                                                                            "text-[9px] font-black uppercase tracking-tight transition-colors px-4 text-center",
                                                                            selectedBrand === b.id ? "text-[#E62329]" : "text-gray-400 group-hover:text-[#121212]"
                                                                        )}>{b.name}</span>
                                                                        {selectedBrand === b.id && <div className="absolute top-2 right-2 w-2 h-2 bg-[#E62329] rounded-full" />}
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-full py-20 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">No brands found</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Models Selection */}
                                                    <div className="w-full md:w-[350px] shrink-0">
                                                        <div className="flex items-center gap-3 mb-8 px-2">
                                                            <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E62329]">02</span>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Select Model</span>
                                                        </div>
                                                        
                                                        {selectedBrand ? (
                                                            <div className="bg-gray-50/50 rounded-[2.5rem] p-6 border border-gray-100 min-h-[400px]">
                                                                <div className="relative mb-6">
                                                                    <input
                                                                        placeholder="Filter Models..."
                                                                        className="w-full bg-white border-0 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none shadow-sm"
                                                                        value={modelSearch}
                                                                        onChange={(e) => setModelSearch(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] subtle-scrollbar pr-2">
                                                                    {filteredModels.length > 0 ? (
                                                                        filteredModels.map((m: string) => (
                                                                            <button
                                                                                key={m}
                                                                                type="button"
                                                                                onClick={() => setValue('model', m)}
                                                                                className={cn(
                                                                                    "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                                    selectedModel === m
                                                                                        ? "bg-[#121212] text-white shadow-lg shadow-black/20"
                                                                                        : "bg-white text-gray-400 hover:text-[#121212] hover:shadow-md"
                                                                                )}
                                                                            >
                                                                                {m}
                                                                            </button>
                                                                        ))
                                                                    ) : (
                                                                        <div className="w-full py-10 text-center text-gray-300 text-[9px] font-bold uppercase">No matching models</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-gray-50/30 rounded-[2.5rem] p-10 border border-dashed border-gray-200 h-[400px] flex flex-col items-center justify-center text-center gap-4">
                                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                                    <Car size={32} />
                                                                </div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Choose a Brand First</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {(errors.brand || errors.model) && (
                                                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 py-3 rounded-2xl border border-red-100">
                                                        <Info size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{errors.brand?.message || errors.model?.message}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* STEP 3: Service Selection */}
                                        {currentStep === 3 && (
                                            <div className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                                    {services.map((s) => (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() => setValue('service', s.id)}
                                                            className={cn(
                                                                "relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 group flex flex-col justify-between h-full overflow-hidden shadow-sm hover:shadow-xl",
                                                                selectedService === s.id
                                                                    ? "border-[#121212] bg-white scale-[1.02]"
                                                                    : "border-transparent bg-gray-50/50 hover:bg-white"
                                                            )}
                                                        >
                                                            {selectedService === s.id && <div className="absolute top-0 right-0 w-24 h-24 bg-[#E62329]/5 rounded-bl-[5rem] -z-10 animate-in zoom-in duration-500" />}
                                                            
                                                            <div>
                                                                <div className={cn(
                                                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 shadow-md",
                                                                    selectedService === s.id
                                                                        ? "bg-[#E62329] text-white rotate-6 scale-110"
                                                                        : "bg-white text-gray-400 group-hover:text-[#E62329] group-hover:rotate-3"
                                                                )}>
                                                                    <CheckCircle2 size={28} strokeWidth={selectedService === s.id ? 2.5 : 2} />
                                                                </div>
                                                                <h4 className="font-black text-[#121212] uppercase tracking-tighter text-lg leading-none mb-4 italic">{s.name}</h4>
                                                                <p className="text-[11px] font-medium text-gray-500 leading-relaxed group-hover:text-gray-600 line-clamp-3 mb-8">{s.description}</p>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 group-hover:text-[#E62329] transition-colors uppercase tracking-[0.2em]">
                                                                    <Clock size={14} />
                                                                    <span>{s.duration}</span>
                                                                </div>
                                                                {selectedService === s.id && <Check size={16} className="text-[#E62329]" strokeWidth={4} />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {errors.service && (
                                                    <div className="text-center text-[10px] text-[#E62329] font-black uppercase tracking-widest bg-red-50 py-3 rounded-2xl">
                                                        {errors.service.message}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* STEP 4: Date & Time */}
                                        {currentStep === 4 && (
                                            <div className="max-w-4xl mx-auto space-y-12">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                    {/* Calendar Area */}
                                                    <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100/50 group hover:bg-white hover:shadow-precision transition-all duration-500">
                                                        <div className="flex items-center gap-4 mb-10 text-[#E62329]">
                                                            <div className="w-12 h-12 rounded-2xl bg-[#E62329] text-white flex items-center justify-center shadow-lg shadow-[#E62329]/20">
                                                                <CalendarIcon size={24} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Appointment</span>
                                                                <span className="text-xs font-medium text-gray-400">Select Date</span>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="date"
                                                            {...register('date')}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full bg-white border-0 rounded-2xl px-8 py-6 text-sm font-bold text-[#121212] focus:ring-2 focus:ring-[#121212] transition-all shadow-sm cursor-pointer h-20"
                                                        />
                                                        {errors.date && <p className="text-[10px] text-[#E62329] mt-4 font-black uppercase tracking-widest pl-2">{errors.date.message}</p>}
                                                    </div>

                                                    {/* Slots Area */}
                                                    <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100/50 group hover:bg-white hover:shadow-precision transition-all duration-500">
                                                        <div className="flex items-center gap-4 mb-10 text-[#121212]">
                                                            <div className="w-12 h-12 rounded-2xl bg-[#121212] text-white flex items-center justify-center shadow-lg">
                                                                <Clock size={24} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Arrival Time</span>
                                                                <span className="text-xs font-medium text-gray-400">Choose Slot</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {!selectedDate ? (
                                                            <div className="h-20 flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest border border-dashed border-gray-200 rounded-2xl">
                                                                Waiting for date...
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto subtle-scrollbar pr-2">
                                                                {slots.length > 0 ? (
                                                                    slots.map(t => (
                                                                        <button
                                                                            key={t}
                                                                            type="button"
                                                                            onClick={() => setValue('time', t)}
                                                                            className={cn(
                                                                                "py-5 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                                                                selectedTime === t
                                                                                    ? "bg-[#121212] text-white border-[#121212] shadow-xl scale-[1.02]"
                                                                                    : "bg-white text-gray-400 border-transparent hover:border-gray-200 hover:text-[#121212]"
                                                                            )}
                                                                        >
                                                                            {t}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="col-span-2 py-10 text-center text-gray-400 text-[9px] font-bold uppercase italic">Full Capacity / No Slots</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {errors.time && <p className="text-[10px] text-[#E62329] mt-4 font-black uppercase tracking-widest pl-2">{errors.time.message}</p>}
                                                    </div>
                                                </div>

                                                <div className="pt-4">
                                                    <Textarea
                                                        label="Service Requirements / Notes"
                                                        placeholder="Any specific noise, issue, or request we should prepare for?"
                                                        {...register('notes')}
                                                        className="bg-gray-50/50 border-0 rounded-[2.5rem] min-h-[150px] p-10 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#121212] transition-all resize-none shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Controls */}
                            <div className="flex justify-between items-center max-w-xl mx-auto mt-20 px-4 pt-10 border-t border-gray-50">
                                <div className="w-16">
                                    {currentStep > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={prevStep} 
                                            className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#121212] hover:text-white transition-all shadow-sm active:scale-95 group"
                                        >
                                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>

                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-[#121212] text-white rounded-3xl px-14 h-16 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#E62329] transition-all shadow-2xl active:scale-95 flex items-center gap-4 group italic"
                                    >
                                        Proceed to {STEPS[currentStep].title}
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#E62329] text-white rounded-3xl px-16 h-16 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#121212] transition-all shadow-2xl shadow-[#E62329]/30 active:scale-95 flex items-center gap-4 italic"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing
                                            </>
                                        ) : (
                                            <>
                                                Confirm Booking
                                                <CheckCircle2 size={18} />
                                            </>
                                        )}
                                    </button>
                                )}

                                <div className="w-16 flex justify-end">
                                    <Tooltip content="Live assistance" position="left">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                                            <Wrench size={16} />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                
                {/* Visual Trust Indicators */}
                <div className="mt-12 flex flex-wrap justify-center gap-12 opacity-30 grayscale filter">
                    <img src="/brands-carousel/porsche-logo.png" className="h-8 w-auto object-contain" alt="Porsche" />
                    <img src="/brands-carousel/bmw-logo.png" className="h-8 w-auto object-contain" alt="BMW" />
                    <img src="/brands-carousel/mercedes-logo.png" className="h-8 w-auto object-contain" alt="Mercedes" />
                    <img src="/brands-carousel/audi-logo-150x150-1.png" className="h-8 w-auto object-contain" alt="Audi" />
                    <img src="/brands-carousel/land-rover-logo.png" className="h-8 w-auto object-contain" alt="Range Rover" />
                </div>
            </div>
        </section>
    )
}
