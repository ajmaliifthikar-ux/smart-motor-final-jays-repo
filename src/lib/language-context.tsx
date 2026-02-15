'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.gallery': 'Gallery',
        'nav.booking': 'Booking',
        'nav.contact': 'Contact',
        'nav.dashboard': 'Dashboard',

        // Hero
        'hero.badge': 'German Engineering Precision',
        'hero.title.part1': 'Performance',
        'hero.title.part2': 'Evolved',
        'hero.subtitle': 'The UAE\'s premier technical sanctuary for luxury performance vehicles.',
        'hero.cta.book': 'Schedule Protocol',
        'hero.cta.explore': 'Our Specializations',
        'hero.specialist': "Abu Dhabi's #1 Specialist",
        'hero.cta.bookService': 'Book Service',
        'hero.cta.requestCallback': 'Request Callback',
        'hero.title.line1': 'PREMIUM',
        'hero.title.line2': 'SERVICE',
        'hero.title.line3': 'EXCELLENCE',
        'hero.description': 'Elite European car care specialized for Mercedes, BMW, Audi, and Porsche. Precision engineering meets uncompromising service.',
        'hero.stats.yearsValue': '20+',
        'hero.stats.yearsLabel': 'Years Exp.',
        'hero.stats.carsValue': '50k+',
        'hero.stats.carsLabel': 'Cars Served',
        'hero.stats.ratingLabel': '4.9/5 Rating',
        'hero.discover': 'Discover',

        // Booking
        'booking.title': 'Secure Your Slot',
        'booking.subtitle': 'Enter the elite maintenance protocol.',

        // General
        'common.back': 'Back',
        'common.next': 'Next',
        'common.confirm': 'Confirm',
    },
    ar: {
        // Navigation (Emirati Dialect flavoring)
        'nav.home': 'الرئيسية',
        'nav.services': 'خدماتنا',
        'nav.gallery': 'المعرض',
        'nav.booking': 'الحجز',
        'nav.contact': 'تواصل معنا',
        'nav.dashboard': 'لوحة التحكم',

        // Hero
        'hero.badge': 'دقة الهندسة الألمانية',
        'hero.title.part1': 'الأداء',
        'hero.title.part2': 'المتطور',
        'hero.subtitle': 'الوجهة الأولى في الإمارات للعناية الفنية بالسيارات الفاخرة.',
        'hero.cta.book': 'احجز موعداً',
        'hero.cta.explore': 'تخصصاتنا',
        'hero.specialist': 'أبوظبي رقم واحد',
        'hero.cta.bookService': 'احجز الخدمة',
        'hero.cta.requestCallback': 'طلب اتصال مجدد',
        'hero.title.line1': 'فئة مميزة',
        'hero.title.line2': 'خدمة',
        'hero.title.line3': 'التميز',
        'hero.description': 'الرعاية الفنية المتخصصة للسيارات الأوروبية الفاخرة — مرسيدس وبي إم دبليو وأودي وبورشه. الهندسة الدقيقة مع الخدمة المثالية.',
        'hero.stats.yearsValue': '20+',
        'hero.stats.yearsLabel': 'سنوات الخبرة',
        'hero.stats.carsValue': '50k+',
        'hero.stats.carsLabel': 'سيارة تم خدمتها',
        'hero.stats.ratingLabel': 'تقييم 4.9/5',
        'hero.discover': 'اكتشف',

        // Booking
        'booking.title': 'احجز مكانك',
        'booking.subtitle': 'ادخل إلى بروتوكول الصيانة النخبوية.',

        // General
        'common.back': 'رجوع',
        'common.next': 'التالي',
        'common.confirm': 'تأكيد',
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    useEffect(() => {
        const savedLang = localStorage.getItem('smart-motors-lang') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            if (savedLang !== 'en') {
                setLanguage(savedLang)
            }
            document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
            document.documentElement.lang = savedLang
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('smart-motors-lang', lang)
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
    }

    const t = (key: string): string => {
        const langData = translations[language] as Record<string, unknown>

        // 1. Check direct key access (e.g. 'nav.home' exists directly in the object?)
        // Note: Our structure is flat-ish keys inside objects, but let's handle the split properly.
        // Actually, looking at the data, 'nav.home' is a key inside 'translations.en'.
        // Wait, no. The structure is translations = { en: { 'nav.home': 'Home' } }.
        // So `langData['nav.home']` should work!

        if (key in langData) {
            return langData[key] as string
        }

        // 2. Fallback to split logic if needed (though our data uses dotted keys directly)
        const keys = key.split('.')
        let current: unknown = langData
        for (const k of keys) {
            if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
                current = (current as Record<string, unknown>)[k]
            } else {
                return key
            }
        }
        return typeof current === 'string' ? current : key
    }

    const isRTL = language === 'ar'

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-sans'}>
                {children}
            </div>
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
