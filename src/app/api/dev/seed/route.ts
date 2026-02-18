/**
 * DEV-ONLY SEED ENDPOINT
 * Seeds services and brands into Firestore (smartmotordb)
 * Hit: GET /api/dev/seed?key=sm-seed-2026
 * Remove this file after seeding is complete.
 */

import { NextResponse } from 'next/server'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { initializeApp, getApps } from 'firebase/app'

const SEED_KEY = 'sm-seed-2026'

function getDb() {
  const config = {
    apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').trim(),
    authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '').trim(),
    projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '').trim(),
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').trim(),
    messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '').trim(),
  }
  const apps = getApps()
  const app = apps.length > 0 ? apps[0] : initializeApp(config)
  return getFirestore(app, 'smartmotordb')
}

// ─── SERVICE DATA ───────────────────────────────────────────────────────────

const SERVICES = [
  {
    slug: 'engine-diagnostic',
    name: 'Engine Diagnostic',
    nameAr: 'تشخيص المحرك',
    description: 'Advanced computer diagnostics for engine health and performance',
    descriptionAr: 'تشخيص محوسب متقدم لصحة وأداء المحرك',
    category: 'mechanical',
    basePrice: 250,
    duration: '1-2 hours',
    icon: 'wrench',
    image: '/services/engine-diagnostic.jpg',
    detailedDescription: "Our state-of-the-art diagnostic equipment reads and interprets your vehicle's onboard computer codes to identify current and potential issues.",
    active: true,
  },
  {
    slug: 'transmission-service',
    name: 'Transmission Service',
    nameAr: 'صيانة ناقل الحركة',
    description: 'Complete transmission maintenance and repairs for all drivetrain types',
    descriptionAr: 'صيانة وإصلاح شامل لناقل الحركة من جميع الأنواع',
    category: 'mechanical',
    basePrice: 450,
    duration: '2-4 hours',
    icon: 'gear',
    image: '/services/transmission.jpg',
    detailedDescription: 'Expert transmission care including fluid changes, filter replacements, and complex repairs. We handle manual, automatic, CVT, and dual-clutch transmissions.',
    active: true,
  },
  {
    slug: 'brake-service',
    name: 'Brake Service',
    nameAr: 'صيانة الفرامل',
    description: 'Complete brake system maintenance and high-performance upgrades',
    descriptionAr: 'صيانة شاملة لنظام الفرامل والترقيات عالية الأداء',
    category: 'mechanical',
    basePrice: 300,
    duration: '1-3 hours',
    icon: 'shield',
    image: '/services/brake-service.jpg',
    detailedDescription: 'Comprehensive brake care from standard maintenance to performance upgrades. We service pads, rotors, calipers, and fluid systems.',
    active: true,
  },
  {
    slug: 'ceramic-coating',
    name: 'Ceramic Coating',
    nameAr: 'طلاء السيراميك',
    description: 'Premium nano-ceramic protection for paint and glass surfaces',
    descriptionAr: 'حماية نانو سيراميكية فاخرة لأسطح الطلاء والزجاج',
    category: 'ceramic',
    basePrice: 1500,
    duration: '1-2 days',
    icon: 'shield',
    image: '/services/ceramic-coating.jpg',
    detailedDescription: 'Professional-grade ceramic coating that bonds to your vehicle surface providing long-lasting protection against UV rays, chemicals, and environmental contaminants.',
    active: true,
  },
  {
    slug: 'paint-protection-film',
    name: 'Paint Protection Film (PPF)',
    nameAr: 'فيلم حماية الطلاء',
    description: 'Invisible protection against stone chips, scratches, and road hazards',
    descriptionAr: 'حماية غير مرئية ضد رقائق الحجر والخدوش والأخطار على الطريق',
    category: 'ppf',
    basePrice: 2000,
    duration: '1-3 days',
    icon: 'shield',
    image: '/services/ppf.jpg',
    detailedDescription: 'Transparent protective film application that protects high-impact areas from chips, scratches, and environmental damage while maintaining original appearance.',
    active: true,
  },
  {
    slug: 'window-tinting',
    name: 'Window Tinting',
    nameAr: 'تظليل النوافذ',
    description: 'Professional window tinting for UV protection and privacy',
    descriptionAr: 'تظليل احترافي للنوافذ لحماية الأشعة فوق البنفسجية والخصوصية',
    category: 'tinting',
    basePrice: 600,
    duration: '2-4 hours',
    icon: 'sun',
    image: '/services/window-tinting.jpg',
    detailedDescription: 'Professional window tinting reduces heat, UV rays, and glare while providing privacy and enhancing your vehicle appearance with premium films.',
    active: true,
  },
  {
    slug: 'detailing',
    name: 'Professional Detailing',
    nameAr: 'التفصيل الاحترافي',
    description: 'Complete interior and exterior detailing for showroom-quality finish',
    descriptionAr: 'تفصيل داخلي وخارجي شامل لإنهاء جودة الصالة العرض',
    category: 'detailing',
    basePrice: 800,
    duration: '4-8 hours',
    icon: 'sparkles',
    image: '/services/detailing.jpg',
    detailedDescription: 'Expert detailing service that deep cleans, restores, and protects every aspect of your vehicle inside and out, returning it to like-new condition.',
    active: true,
  },
  {
    slug: 'suspension-service',
    name: 'Suspension Service',
    nameAr: 'صيانة التعليق',
    description: 'Advanced suspension maintenance and performance upgrades',
    descriptionAr: 'صيانة تعليق متقدمة وترقيات الأداء',
    category: 'mechanical',
    basePrice: 500,
    duration: '2-4 hours',
    icon: 'wind',
    image: '/services/suspension.jpg',
    detailedDescription: 'Professional suspension service including alignment, damper replacement, spring service, and performance upgrades for optimal handling and comfort.',
    active: true,
  },
  {
    slug: 'air-conditioning',
    name: 'Air Conditioning Service',
    nameAr: 'صيانة تكييف الهواء',
    description: 'Complete AC system maintenance and refrigerant service',
    descriptionAr: 'صيانة شاملة لنظام تكييف الهواء وخدمة الثلاجة',
    category: 'mechanical',
    basePrice: 400,
    duration: '1-2 hours',
    icon: 'wind',
    image: '/services/ac-service.jpg',
    detailedDescription: 'Professional air conditioning service including refrigerant recharge, compressor inspection, filter replacement, and system diagnostics.',
    active: true,
  },
]

// ─── BRAND DATA ─────────────────────────────────────────────────────────────

const ALL_SERVICE_IDS = SERVICES.map((s) => s.slug)

const BRANDS = [
  { name: 'Mercedes-Benz', nameAr: 'مرسيدس بنز', slug: 'mercedes-benz', logoUrl: 'mercedes-logo.png', description: 'German luxury vehicles with precision engineering. Models: S-Class, E-Class, C-Class, GLE, AMG series.' },
  { name: 'BMW', nameAr: 'بي ام دبليو', slug: 'bmw', logoUrl: 'bmw-logo.png', description: 'Bavarian performance and luxury. Models: 7-Series, 5-Series, 3-Series, X7, M-Performance.' },
  { name: 'Audi', nameAr: 'أودي', slug: 'audi', logoUrl: 'audi-logo-150x150-1.png', description: 'German engineering with advanced technology. Models: A8, A7, A6, Q7, RS series.' },
  { name: 'Porsche', nameAr: 'بورشه', slug: 'porsche', logoUrl: 'porsche-logo.png', description: 'High-performance sports cars. Models: 911, Panamera, Cayenne, Taycan.' },
  { name: 'Range Rover', nameAr: 'رينج روفر', slug: 'range-rover', logoUrl: 'range-rover-logo.png', description: 'British luxury SUVs with off-road capability. Models: Range Rover, Sport, Evoque, Discovery.' },
  { name: 'Bentley', nameAr: 'بنتلي', slug: 'bentley', logoUrl: 'bentley-logo-150x150-1.png', description: 'Ultra-luxury British automobiles. Models: Continental GT, Flying Spur, Bentayga.' },
  { name: 'Lamborghini', nameAr: 'لامبورجيني', slug: 'lamborghini', logoUrl: 'lamborghini-logo.png', description: 'Italian super sports cars. Models: Aventador, Huracán, Urus.' },
  { name: 'Bugatti', nameAr: 'بوغاتي', slug: 'bugatti', logoUrl: 'Bugatti-logo.png', description: 'French hyper-cars and extreme performance. Models: Chiron, Divo.' },
  { name: 'Rolls-Royce', nameAr: 'رولز رويس', slug: 'rolls-royce', logoUrl: 'rolls-royce-logo.png', description: 'British ultimate luxury. Models: Phantom, Ghost, Wraith, Dawn.' },
  { name: 'Ferrari', nameAr: 'فيراري', slug: 'ferrari', logoUrl: 'ferrari-logo.png', description: 'Italian performance legends. Models: F8 Tributo, Roma, SF90, Daytona SP3.' },
  { name: 'Alfa Romeo', nameAr: 'ألفا روميو', slug: 'alfa-romeo', logoUrl: 'alfa-romeo-logo.png', description: 'Italian performance and style. Models: Giulia, Stelvio, 4C.' },
  { name: 'Aston Martin', nameAr: 'استون مارتن', slug: 'aston-martin', logoUrl: 'aston-martin-logo.png', description: 'British grand tourers and sports cars. Models: Vantage, DBX, DB11.' },
  { name: 'Cadillac', nameAr: 'كاديلاك', slug: 'cadillac', logoUrl: 'cadillac.png', description: 'American luxury vehicles. Models: Escalade, CT5, Lyriq.' },
  { name: 'Chevrolet', nameAr: 'شيفروليه', slug: 'chevrolet', logoUrl: 'chevrolet.png', description: 'American performance and reliability. Models: Corvette, Silverado, Equinox.' },
  { name: 'Dodge', nameAr: 'دودج', slug: 'dodge', logoUrl: 'dodge-logo.png', description: 'American muscle and performance. Models: Charger, Challenger, Ram.' },
  { name: 'Ford', nameAr: 'فورد', slug: 'ford', logoUrl: 'ford-logo.png', description: 'American trucks and performance. Models: Mustang, F-150, Ranger.' },
  { name: 'Genesis', nameAr: 'جينيسيس', slug: 'genesis', logoUrl: 'genesis-logo.png', description: 'Korean luxury performance brand. Models: G70, G80, GV70.' },
]

// ─── HANDLER ─────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  if (key !== SEED_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()
    const results: string[] = []

    // ── Seed Services ──
    const existingServices = await getDocs(query(collection(db, 'services'), where('active', '==', true)))
    if (existingServices.size >= SERVICES.length) {
      results.push(`⏭ Services already seeded (${existingServices.size} found, skipping)`)
    } else {
      for (const svc of SERVICES) {
        const ref = doc(collection(db, 'services'))
        await setDoc(ref, { ...svc, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })
        results.push(`✅ Service: ${svc.name}`)
      }
    }

    // ── Patch Existing Brands with serviceIds + logoUrl ──
    // Always run so existing brand docs get service relationships set
    const existingBrands = await getDocs(collection(db, 'brands'))
    const logoMap: Record<string, string> = {
      'Mercedes-Benz': 'mercedes-logo.png',
      'BMW': 'bmw-logo.png',
      'Audi': 'audi-logo-150x150-1.png',
      'Porsche': 'porsche-logo.png',
      'Range Rover': 'range-rover-logo.png',
      'Bentley': 'bentley-logo-150x150-1.png',
      'Lamborghini': 'lamborghini-logo.png',
      'Bugatti': 'Bugatti-logo.png',
      'Rolls-Royce': 'rolls-royce-logo.png',
      'Ferrari': 'ferrari-logo.png',
      'Alfa Romeo': 'alfa-romeo-logo.png',
      'Aston Martin': 'aston-martin-logo.png',
      'Cadillac': 'cadillac.png',
      'Chevrolet': 'chevrolet.png',
      'Dodge': 'dodge-logo.png',
      'Ford': 'ford-logo.png',
      'Genesis': 'genesis-logo.png',
      'Chrysler': 'chrysler-logo.png',
    }
    let patched = 0
    for (const snap of existingBrands.docs) {
      const data = snap.data()
      const logoUrl = data.logoUrl || logoMap[data.name] || ''
      await updateDoc(snap.ref, {
        serviceIds: ALL_SERVICE_IDS,
        logoUrl,
        updatedAt: Timestamp.now(),
      })
      patched++
    }
    results.push(`✅ Patched ${patched} existing brands with serviceIds + logoUrl`)

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
