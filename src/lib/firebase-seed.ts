import {
  createService,
  createContent,
  batchWrite,
} from '@/lib/firebase-db'
import { Timestamp } from 'firebase/firestore'

/**
 * FIREBASE DATABASE SEED SCRIPT
 * Populate Firestore with essential Smart Motor data
 * Run this once during initial setup
 */

export async function seedFirebaseDatabase() {
  console.log('🌱 Starting Firebase database seed...')

  try {
    // ─── SEED SERVICES ───
    await seedServices()

    // ─── SEED CONTENT ───
    await seedContent()

    console.log('✅ Firebase database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

async function seedServices() {
  console.log('🔧 Seeding services...')

  const services = [
    {
      slug: 'engine-oil-change',
      name: 'Engine Oil Change',
      nameAr: 'تغيير زيت المحرك',
      description: 'Professional engine oil and filter replacement',
      descriptionAr: 'استبدال احترافي لزيت المحرك والمرشح',
      detailedDescription:
        'Complete oil change service including premium oil, filter replacement, and system flush. Suitable for all European vehicle models.',
      category: 'Maintenance',
      basePrice: 150,
      duration: '1 hour',
      active: true,
    },
    {
      slug: 'brake-service',
      name: 'Brake Service',
      nameAr: 'خدمة الفرامل',
      description: 'Brake pad replacement and system inspection',
      descriptionAr: 'استبدال وسادات الفرامل وفحص النظام',
      detailedDescription:
        'Complete brake service including pad replacement, rotor inspection, fluid check, and system bleeding. Safety certified.',
      category: 'Safety',
      basePrice: 300,
      duration: '2 hours',
      active: true,
    },
    {
      slug: 'tire-replacement',
      name: 'Tire Replacement',
      nameAr: 'استبدال الإطارات',
      description: 'Tire replacement and balancing',
      descriptionAr: 'استبدال والموازنة',
      detailedDescription:
        'Professional tire replacement with balancing and alignment check. Premium tire brands available.',
      category: 'Maintenance',
      basePrice: 250,
      duration: '1.5 hours',
      active: true,
    },
    {
      slug: 'ppf-installation',
      name: 'Paint Protection Film (PPF)',
      nameAr: 'فيلم حماية الطلاء',
      description: 'Full body PPF installation',
      descriptionAr: 'تثبيت فيلم الحماية الكامل',
      detailedDescription:
        'Professional PPF application for complete vehicle protection against scratches, chips, and environmental damage.',
      category: 'Protection',
      basePrice: 2000,
      duration: '4 hours',
      active: true,
    },
    {
      slug: 'ceramic-coating',
      name: 'Ceramic Coating',
      nameAr: 'طلاء سيراميك',
      description: 'Professional ceramic coating application',
      descriptionAr: 'تطبيق طلاء السيراميك الاحترافي',
      detailedDescription:
        'High-end ceramic coating for long-lasting paint protection, hydrophobic properties, and enhanced shine.',
      category: 'Enhancement',
      basePrice: 1500,
      duration: '3 hours',
      active: true,
    },
    {
      slug: 'window-tinting',
      name: 'Window Tinting',
      nameAr: 'تلوين النوافذ',
      description: 'Professional window tint installation',
      descriptionAr: 'تثبيت تلوين النوافذ الاحترافي',
      detailedDescription:
        'Premium window tinting service with UV protection and enhanced privacy. Legal compliant films.',
      category: 'Customization',
      basePrice: 600,
      duration: '2 hours',
      active: true,
    },
    {
      slug: 'detailing-package',
      name: 'Full Detailing Package',
      nameAr: 'حزمة التفاصيل الكاملة',
      description: 'Comprehensive interior and exterior detailing',
      descriptionAr: 'تفاصيل شاملة داخلية وخارجية',
      detailedDescription:
        'Complete professional detailing including exterior wash, wax, interior cleaning, and protection treatments.',
      category: 'Detailing',
      basePrice: 800,
      duration: '3 hours',
      active: true,
    },
  ]

  for (const service of services) {
    try {
      const serviceData = {
        slug: service.slug,
        name: service.name,
        nameAr: service.nameAr,
        description: service.description,
        descriptionAr: service.descriptionAr,
        detailedDescription: service.detailedDescription,
        category: service.category,
        basePrice: service.basePrice,
        duration: service.duration,
        active: true,
      }
      const serviceId = await createService(serviceData)
      console.log(`  ✓ Created service: ${service.name} (${serviceId})`)
    } catch (error) {
      console.error(`  ✗ Error creating service ${service.name}:`, error)
    }
  }
}

async function seedContent() {
  console.log('📝 Seeding content...')

  const contentItems = [
    {
      type: 'FAQ' as const,
      title: 'What brands do you service?',
      titleAr: 'ما العلامات التجارية التي تخدمها؟',
      slug: 'brands-serviced',
      content:
        'We specialize in premium European brands including Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and Bentley.',
      contentAr: 'نحن متخصصون في العلامات التجارية الأوروبية المميزة بما في ذلك مرسيدس وبي إم دبليو وأودي وبورشه ورينج روفر وبنتلي.',
      published: true,
    },
    {
      type: 'FAQ' as const,
      title: 'Do you provide warranty on service?',
      titleAr: 'هل تقدمون ضمانة على الخدمة؟',
      slug: 'warranty-policy',
      content:
        'Yes, all our services come with a 12-month parts warranty and 6-month labor warranty. Terms apply.',
      contentAr: 'نعم، تأتي جميع خدماتنا مع ضمان قطع الغيار لمدة 12 شهرًا وضمان العمل لمدة 6 أشهر.',
      published: true,
    },
    {
      type: 'FAQ' as const,
      title: 'What is your booking process?',
      titleAr: 'ما هي عملية الحجز لديك؟',
      slug: 'booking-process',
      content:
        'Simply select your service, choose an available date and time slot, provide your vehicle details, and confirm. You will receive a confirmation email.',
      contentAr: 'ما عليك سوى تحديد الخدمة واختيار الوقت المتاح وتقديم تفاصيل السيارة والتأكيد. ستتلقى بريد تأكيد.',
      published: true,
    },
    {
      type: 'PAGE' as const,
      title: 'About Smart Motor',
      titleAr: 'حول سمارت موتور',
      slug: 'about-us',
      content: `Smart Motor is Abu Dhabi's premier service center for luxury European vehicles. With 20+ years of excellence,
we have earned the trust of thousands of customers. Our state-of-the-art facility and expert technicians ensure
your vehicle receives the highest level of care.`,
      contentAr: `سمارت موتور هي مركز الخدمة الأول في أبو ظبي للسيارات الأوروبية الفاخرة. مع أكثر من 20 سنة من التميز،
كسبنا ثقة آلاف العملاء. تضمن منشآتنا الحديثة وفنيونا الخبراء أن تتلقى سيارتك أعلى مستويات الرعاية.`,
      published: true,
    },
  ]

  for (const content of contentItems) {
    try {
      const contentId = await createContent({
        ...content,
        author: 'Admin',
      })
      console.log(`  ✓ Created content: ${content.title} (${contentId})`)
    } catch (error) {
      console.error(`  ✗ Error creating content ${content.title}:`, error)
    }
  }
}

// Export for manual execution
if (typeof window === 'undefined') {
  // Server-side only
  seedFirebaseDatabase().catch(console.error)
}
