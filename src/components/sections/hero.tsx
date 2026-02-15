'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CallbackModal } from '@/components/sections/callback-modal'
import { useLanguage } from '@/lib/language-context'
import { useTilt } from '@/lib/hooks/useTilt'
import { StarIcon } from 'lucide-react'

export function Hero() {
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)
  const { t, isRTL } = useLanguage()

  const bookTilt = useTilt({ maxDegrees: 6, perspective: 800 })
  const callbackTilt = useTilt({ maxDegrees: 6, perspective: 800 })

  return (
    <section className="relative flex-1 flex overflow-hidden bg-white">
      {/* Full-width vehicle image — positioned right */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/hero/Hero-Wagon.webp')] bg-cover bg-center md:bg-[center_top_0px]" />
        {/* Background Image managed by CSS class above */}
        {/* Gradient fade from left to ensure text readability */}
        <div className={`absolute inset-0 pointer-events-none ${isRTL
          ? 'bg-gradient-to-l from-transparent via-white/50 to-white/98'
          : 'bg-gradient-to-r from-white/98 via-white/80 to-transparent'
          }`} />
      </div>

      {/* Content centered */}
      <div className={`relative z-[2] w-full max-w-7xl mx-auto flex flex-col justify-center items-center text-center px-8 md:px-20 ${isRTL ? 'ml-auto' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8">
            <div className="absolute inset-0 rounded-full blur-md opacity-40"
              style={{ background: 'linear-gradient(135deg, #E62329, #FFCC00, #E62329)' }} />
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 animate-shimmer"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', backgroundSize: '200% 100%' }} />
            </div>
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2C2C2C 50%, #1a1a1a 100%)' }} />
            <span className="relative z-10 w-2 h-2 bg-[#E62329] rounded-full animate-pulse" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-gray-300">
              {t('hero.specialist')}
            </span>
          </div>

          <h1 className={`text-5xl lg:text-7xl font-black leading-[0.9] mb-8 tracking-tighter text-[#121212] ${isRTL ? 'font-arabic tracking-normal text-4xl lg:text-5xl' : ''}`}>
            {t('hero.title.line1')}<br />
            {t('hero.title.line2')}<br />
            <span className="silver-shine">{t('hero.title.line3')}</span>
          </h1>

          <p className={`text-gray-500 text-lg max-w-2xl leading-relaxed mb-10 font-medium ${isRTL ? 'font-arabic' : ''}`}>
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              style={bookTilt.tiltStyle}
              onMouseMove={bookTilt.tiltHandlers.onMouseMove}
              onMouseLeave={bookTilt.tiltHandlers.onMouseLeave}
              className="bg-[#121212] text-white button-overlay rounded-full px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] transition-all shadow-2xl hover:scale-105"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.cta.bookService')}
            </Button>
            <Button
              style={callbackTilt.tiltStyle}
              onMouseMove={callbackTilt.tiltHandlers.onMouseMove}
              onMouseLeave={callbackTilt.tiltHandlers.onMouseLeave}
              variant="outline"
              className="border-gray-300 text-[#121212] button-overlay rounded-full px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-[#FFCC00] hover:text-[#121212] hover:border-[#FFCC00] transition-all"
              onClick={() => setIsCallbackModalOpen(true)}
            >
              {t('hero.cta.requestCallback')}
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-8 flex items-center gap-6 border-t border-gray-200 pt-5">
            <div>
              <p className="text-xl font-black text-[#121212]">{t('hero.stats.yearsValue')}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('hero.stats.yearsLabel')}</p>
            </div>
            <div className="w-px h-7 bg-gray-200" />
            <div>
              <p className="text-xl font-black text-[#121212]">{t('hero.stats.carsValue')}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('hero.stats.carsLabel')}</p>
            </div>
            <div className="w-px h-7 bg-gray-200" />
            <div className="flex flex-col">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={11} className="fill-[#E62329] text-[#E62329]" />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{t('hero.stats.ratingLabel')}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[2]">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">{t('hero.discover')}</span>
        <div className="w-px h-6 bg-gradient-to-b from-gray-400 to-transparent" />
      </div>

      <CallbackModal isOpen={isCallbackModalOpen} onClose={() => setIsCallbackModalOpen(false)} />
    </section>
  )
}
