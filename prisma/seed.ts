import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// --- SERVICES DATA ---
const services = [
    {
        id: 'mechanical',
        name: 'Mechanical Services',
        nameAr: 'الخدمات الميكانيكية',
        description: 'Expert engine, transmission, and mechanical repairs for all brands.',
        descriptionAr: 'إصلاحات الخبراء للمحرك وناقل الحركة والميكانيكا لجميع العلامات التجارية.',
        category: 'mechanical',
        duration: '2-4 Hours',
        icon: 'wrench',
        iconImage: '/images/services/icons/mechanical.png',
        image: '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp',
        detailedDescription: 'Professional mechanical services in Abu Dhabi. Expert engine, transmission, and mechanical repairs for all brands. Our certified technicians use state-of-the-art diagnostic tools to ensure your vehicle performs at its best.',
        process: [
            { step: '01', title: 'Diagnostics', desc: 'Advanced computer scanning and manual inspection' },
            { step: '02', title: 'Plan', desc: 'Detailed report and transparent cost estimate' },
            { step: '03', title: 'Repair', desc: 'Execution by certified specialists using OEM parts' },
            { step: '04', title: 'Quality Check', desc: 'Final inspection and road test' }
        ],
        subServices: [
            { title: 'Engine Services', description: 'Complete engine diagnostics, repair, and rebuilding.', features: ['Engine diagnostics & scanning', 'Timing belt replacement', 'Engine overhaul'] },
            { title: 'Transmission Services', description: 'Expert service for automatic and manual transmissions.', features: ['Transmission diagnostics', 'Fluid change', 'Gearbox overhaul'] },
            { title: 'Brake Services', description: 'Professional brake service for reliable stopping power.', features: ['Brake pad replacement', 'ABS system diagnostics', 'Brake fluid flush'] }
        ],
        seo: { title: 'Car Mechanical Repair Abu Dhabi | Engine & Transmission Service', description: 'Expert mechanical repairs for luxury cars in Abu Dhabi.' }
    },
    {
        id: 'electrical',
        name: 'Electrical Services',
        nameAr: 'الخدمات الكهربائية',
        description: 'Advanced diagnostics, battery, alternator, and ECU repairs.',
        descriptionAr: 'تشخيص متقدم، بطارية، مولد، وإصلاح وحدة التحكم الإلكترونية.',
        category: 'mechanical',
        duration: '1-3 Hours',
        icon: 'sparkles',
        iconImage: '/images/services/icons/electrical.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Comprehensive car electrical services including battery replacement, alternator repair, and ECU programming.',
        process: [
            { step: '01', title: 'Scan', desc: 'Full system diagnostic scan' },
            { step: '02', title: 'Test', desc: 'Battery, alternator and circuit testing' },
            { step: '03', title: 'Fix', desc: 'Precision repair of electrical components' }
        ],
        subServices: [
            { title: 'Electrical Diagnostics', description: 'Pinpoint accuracy for complex issues.', features: ['Fault code reading', 'Circuit testing'] },
            { title: 'Battery & Charging', description: 'Keep your vehicle powered.', features: ['Battery testing', 'Alternator repair'] }
        ],
        seo: { title: 'Car Electrical Repair Abu Dhabi | Auto Electrician', description: 'Best auto electrician in Abu Dhabi.' }
    },
    {
        id: 'bodyshop',
        name: 'Body Shop & Accident Repair',
        nameAr: 'ورشة الهيكل وإصلاح الحوادث',
        description: 'Expert body repair, panel beating, and accident restoration.',
        descriptionAr: 'إصلاح الهيكل الخبير وسحب الصدمات واستعادة أضرار الحوادث.',
        category: 'bodyshop',
        duration: '3-7 Days',
        icon: 'car',
        iconImage: '/images/services/icons/bodyshop.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Professional auto body shop. From minor dents to major collision restoration.',
        process: [
            { step: '01', title: 'Assessment', desc: 'Damage evaluation' },
            { step: '02', title: 'Body Work', desc: 'Panel beating and structural repair' }
        ],
        subServices: [
            { title: 'Accident Repair', description: 'Complete collision restoration.', features: ['Frame straightening', 'Structural repairs'] },
            { title: 'Paintless Dent Repair', description: 'Remove dents preserving factory paint.', features: ['Door dings', 'Minor dents'] }
        ],
        seo: { title: 'Auto Body Shop Abu Dhabi | Accident Repair', description: 'Best car body shop in Musaffah.' }
    },
    {
        id: 'ppf',
        name: 'Paint & Protection',
        nameAr: 'الطلاء والحماية',
        description: 'Professional painting and premium Paint Protection Films (PPF).',
        descriptionAr: 'طلاء احترافي، وأفلام حماية الطلاء.',
        category: 'ppf',
        duration: '2-3 Days',
        icon: 'shield',
        iconImage: '/images/services/icons/ppf.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Protect your vehicle\'s paint with premium PPF and professional painting.',
        process: [
            { step: '01', title: 'Prep', desc: 'Deep cleaning and correction' },
            { step: '02', title: 'Install', desc: 'Precision application' }
        ],
        subServices: [
            { title: 'Car Painting', description: 'Restore and upgrade appearance.', features: ['Full resprays', 'Panel painting'] },
            { title: 'PPF', description: 'Invisible armor for your paint.', features: ['Self-healing film', 'Matte finish'] }
        ],
        seo: { title: 'Car Painting & PPF Abu Dhabi | Paint Protection Film', description: 'Professional car painting and PPF.' }
    },
    {
        id: 'ceramic',
        name: 'Ceramic Coating',
        nameAr: 'طلاء السيراميك',
        description: 'Long-lasting paint protection and stunning gloss.',
        descriptionAr: 'حماية طويلة الأمد للطلاء ولمعان مذهل.',
        category: 'ceramic',
        duration: '1-2 Days',
        icon: 'sparkles',
        iconImage: '/images/services/icons/ceramic.png',
        image: '/images/services/Gemini_Generated_Image_7vknrq7vknrq7vkn.webp',
        detailedDescription: 'Unmatched protection against UV rays, chemicals, and contaminants.',
        process: [
            { step: '01', title: 'Correction', desc: 'Multi-stage paint correction' },
            { step: '02', title: 'Coating', desc: 'Layered application' }
        ],
        subServices: [
            { title: 'Standard Protection', description: '2-3 year durability.', features: ['Single layer', 'Hydrophobic'] },
            { title: 'Ultimate Protection', description: '5-7+ year durability.', features: ['Multi-layer', 'Showroom finish'] }
        ],
        seo: { title: 'Ceramic Coating Abu Dhabi | Car Paint Protection', description: 'Best ceramic coating service.' }
    },
    {
        id: 'tinting',
        name: 'Window Tinting',
        nameAr: 'تظليل النوافذ',
        description: 'High-quality window tinting for privacy and heat reduction.',
        descriptionAr: 'تظليل نوافذ عالي الجودة للخصوصية وتقليل الحرارة.',
        category: 'tinting',
        duration: '3-4 Hours',
        icon: 'sun',
        iconImage: '/images/services/icons/tinting.png',
        image: '/images/services/Gemini_Generated_Image_acgzrhacgzrhacgz.webp',
        detailedDescription: 'Stay cool and protected with high-quality window films.',
        process: [
            { step: '01', title: 'Clean', desc: 'Thorough glass cleaning' },
            { step: '02', title: 'Cut', desc: 'Precision computer-cutting' }
        ],
        subServices: [
            { title: 'Ceramic Film', description: 'Maximum heat rejection and clarity.', features: ['99% UV protection', 'High IR rejection'] },
            { title: 'Carbon Film', description: 'Superior durability.', features: ['Matte finish', 'No signal interference'] }
        ],
        seo: { title: 'Car Window Tinting Abu Dhabi | Heat Rejection', description: 'Professional car window tinting.' }
    },
    {
        id: 'detailing',
        name: 'Detailing & Polishing',
        nameAr: 'التفصيل والتلميع',
        description: 'Premium interior and exterior detailing services.',
        descriptionAr: 'خدمات التفصيل الداخلي والخارجي الفاخرة.',
        category: 'detailing',
        duration: '4-6 Hours',
        icon: 'sparkles',
        iconImage: '/images/services/icons/detailing.png',
        image: '/images/services/Gemini_Generated_Image_7vknrq7vknrq7vkn.webp',
        detailedDescription: 'Complete detailing tailored to restore your vehicle to showroom condition.',
        process: [
            { step: '01', title: 'Wash', desc: 'Hand wash and decontamination' },
            { step: '02', title: 'Interior', desc: 'Steam cleaning and leather care' }
        ],
        subServices: [
            { title: 'Exterior Detailing', description: 'Restore paint depth.', features: ['Paint correction', 'Machine polishing'] },
            { title: 'Interior Detailing', description: 'Deep clean your cabin.', features: ['Steam cleaning', 'Odor elimination'] }
        ],
        seo: { title: 'Car Detailing Abu Dhabi | Interior & Exterior Polishing', description: 'Top-rated car detailing.' }
    },
    {
        id: 'towing',
        name: 'Towing & Breakdown',
        nameAr: 'السحب والأعطال',
        description: '24/7 emergency towing and roadside assistance.',
        descriptionAr: 'خدمة السحب والمساعدة على الطريق على مدار الساعة.',
        category: 'towing',
        duration: '30-45 Mins',
        icon: 'truck',
        iconImage: '/images/services/icons/towing.png',
        image: '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp',
        detailedDescription: 'Fast and reliable emergency towing across Abu Dhabi.',
        process: [
            { step: '01', title: 'Call', desc: 'Immediate dispatch' },
            { step: '02', title: 'Recover', desc: 'Safe transport' }
        ],
        subServices: [
            { title: 'Towing Services', description: 'Safe transport for all vehicles.', features: ['Flatbed towing', 'Sports car towing'] },
            { title: 'Breakdown Assistance', description: 'On-site emergency repairs.', features: ['Battery jump-start', 'Fuel delivery'] }
        ],
        seo: { title: 'Car Towing Service Abu Dhabi | 24/7 Recovery', description: 'Fast car towing and recovery.' }
    }
]

// --- BRAND CATEGORIES ---
const brandCategories = [
    {
        id: 'exotic',
        name: 'Exotic & Supercars',
        slug: 'exotic-supercars',
        description: 'Specialized care for high-performance and luxury marques.',
        brands: [
            { id: 'lamborghini', name: 'Lamborghini', logoFile: 'lamborghini-logo-150x150-1.png', models: 'Gallardo,Huracan,Aventador,Urus', specialties: 'V10/V12 Engines,Performance,Aerodynamics', heritage: 'Italian supercar excellence since 1963.' },
            { id: 'ferrari', name: 'Ferrari', logoFile: 'ferrari-logo.png', models: 'LaFerrari,488,SF90,Roma,F8', specialties: 'Racing Heritage,V8/V12 Mastery,F1 Tech', heritage: 'The most iconic racing and luxury brand.' },
            { id: 'bugatti', name: 'Bugatti', logoFile: 'Bugatti-logo.png', models: 'Chiron,Veyron,Divo,Bolide', specialties: 'W16 Engine,Hypercar Engineering,Performance', heritage: 'French-Italian hypercar mastery.' },
            { id: 'rollsroyce', name: 'Rolls Royce', logoFile: 'rolls-royce-logo.png', models: 'Phantom,Ghost,Cullinan,Wraith', specialties: 'Bespoke Luxury,V12 Smoothness,Craftsmanship', heritage: 'The pinnacle of luxury automotive.' },
            { id: 'mclaren', name: 'McLaren', logoFile: 'mclaren-logo.png', models: '720S,765LT,Artura,GT', specialties: 'Carbon Fiber,F1-derived Engineering', heritage: 'Born on the track, perfected for the road.' },
            { id: 'astonmartin', name: 'Aston Martin', logoFile: 'aston-martin-logo.png', models: 'DB11,DBS,Vantage,DBX', specialties: 'British Elegance,GT Luxury', heritage: 'Power, beauty, and soul.' },
            { id: 'maserati', name: 'Maserati', logoFile: 'maserati-logo.png', models: 'MC20,Ghibli,Levante,Quattroporte', specialties: 'Italian Soul,Exotic Sound', heritage: 'Luxury, sports and style.' },
            { id: 'bentley', name: 'Bentley', logoFile: 'bentley-logo-150x150-1.png', models: 'Continental GT,Bentayga,Flying Spur', specialties: 'W12 Engineering,Handcrafted Luxury', heritage: 'Handcrafted luxury and performance.' }
        ]
    },
    {
        id: 'german',
        name: 'German Brands',
        slug: 'german-brands',
        description: 'Renowned precision and innovation.',
        brands: [
            { id: 'bmw', name: 'BMW', logoFile: 'bmw-logo.png', models: '3-Series,5-Series,7-Series,X5,M4', specialties: 'M-Performance,iDrive,Diagnostics', heritage: 'The ultimate driving machine.' },
            { id: 'mercedes', name: 'Mercedes-Benz', logoFile: 'mercedes-logo.png', models: 'C-Class,S-Class,G-Wagon,AMG GT', specialties: 'AMG,Airmatic,COMAND', heritage: 'Pinnacle of luxury and innovation.' },
            { id: 'audi', name: 'Audi', logoFile: 'audi-logo-150x150-1.png', models: 'R8,RS6,Q8,A8', specialties: 'Quattro AWD,Virtual Cockpit', heritage: 'Vorsprung durch Technik.' },
            { id: 'porsche', name: 'Porsche', logoFile: 'porsche-logo.png', models: '911,Cayenne,Macan,Taycan', specialties: 'PDK,PASM,Performance', heritage: 'Uncompromised racing pedigree.' }
        ]
    },
    {
        id: 'european',
        name: 'European Brands',
        slug: 'european-brands',
        description: 'Luxury and advanced technology.',
        brands: [
            { id: 'rangerover', name: 'Range Rover', logoFile: 'land-rover-logo.png', models: 'Vogue,Sport,Velar,Defender', specialties: 'All-Terrain,Air Suspension', heritage: 'British luxury matched with off-road capability.' },
            { id: 'jaguar', name: 'Jaguar', logoFile: 'jaguar-logo.png', models: 'F-Pace,F-Type,XE,XJ', specialties: 'Performance,Ingenium Engines', heritage: 'Grace, pace, and space.' },
            { id: 'volvo', name: 'Volvo', logoFile: 'volvo-logo.png', models: 'XC90,XC60,S90', specialties: 'Safety,Hybrid Technology', heritage: 'Swedish safety and elegance.' }
        ]
    },
    {
        id: 'japanese',
        name: 'Japanese Brands',
        slug: 'japanese-brands',
        description: 'Reliability and efficiency.',
        brands: [
            { id: 'toyota', name: 'Toyota', logoFile: 'toyota-logo.png', models: 'Land Cruiser,Prado,Camry', specialties: 'Hybrid,4x4 Maintenance', heritage: 'Quality, durability, and reliability.' },
            { id: 'lexus', name: 'Lexus', logoFile: 'lexus-logo.png', models: 'LS,LX,RX,ES', specialties: 'Luxury Hybrid,Comfort', heritage: 'The pursuit of perfection.' },
            { id: 'nissan', name: 'Nissan', logoFile: 'nissanlogo.png', models: 'Patrol,GT-R,Altima', specialties: 'Patrol Tuning,CVT Service', heritage: 'Innovation that excites.' }
        ]
    },
    {
        id: 'chinese',
        name: 'Chinese Brands',
        slug: 'chinese-brands',
        description: 'Luxury and electric vehicles.',
        brands: [
            { id: 'byd', name: 'BYD', logoFile: 'BYD.svg', models: 'Han,Tang,Seal,Atto 3', specialties: 'Blade Battery,EV Powertrain', heritage: 'Redefining sustainable mobility.' },
            { id: 'mg', name: 'MG', logoFile: 'mg-logo.png', models: 'MG GT,HS,ZS EV', specialties: 'Turbo Engines,EV Battery', heritage: 'Modern British heritage.' }
        ]
    },
    {
        id: 'american',
        name: 'American Brands',
        slug: 'american-brands',
        description: 'Power and performance.',
        brands: [
            { id: 'ford', name: 'Ford', logoFile: 'ford-logo.png', models: 'Mustang,F-150,Explorer', specialties: 'EcoBoost,Truck Maintenance', heritage: 'Built Ford Tough.' },
            { id: 'chevrolet', name: 'Chevrolet', logoFile: 'chevrolet.png', models: 'Corvette,Camaro,Tahoe', specialties: 'V8 Engines,Performance', heritage: 'Find New Roads.' },
            { id: 'cadillac', name: 'Cadillac', logoFile: 'cadillac.png', models: 'Escalade,CT5,XT6', specialties: 'Luxury,Super Cruise', heritage: 'Standard of the world.' },
            { id: 'dodge', name: 'Dodge', logoFile: 'dodge-logo.png', models: 'Charger,Challenger,Durango', specialties: 'HEMI,High Performance', heritage: 'Domestic Performance.' }
        ]
    }
]

// --- OTHER DATA ---
const packages = [
    { id: 'special-package', title: 'Special Service Package', subtitle: '50,000 KM Coverage', isPromotional: true, bestFor: 'Long-term maintenance', features: ['1 Major Service', '4 Minor Services', 'Save Up to 30%'], validity: '1 Year' },
    { id: 'current-promo', title: 'Current Promotion', subtitle: 'Limited Time Offer', isPromotional: true, bestFor: 'Immediate savings', features: ['50% OFF Minor Services', 'Free Multi-point Inspection'], validity: 'Limited Time' },
    { id: 'exotic-care', title: 'Exotic Care Plus', subtitle: 'Bespoke Supercar Program', isPromotional: true, bestFor: 'Ferrari & Lamborghini Owners', features: ['Diagnostic Telemetry', 'Fluid Analysis', 'Concierge Pickup'], validity: 'Active' },
    { id: 'german-precision', title: 'German Precision Bundle', subtitle: 'Audi, BMW & Mercedes', isPromotional: true, bestFor: 'European Performance', features: ['OEM Filter Changes', 'Software Optimization', 'Brake Calibration'], validity: 'Active' }
]

const faqs = [
    { question: 'What brands do you specialize in?', answer: 'We specialize in European, Exotic, and Luxury vehicles including Mercedes, BMW, Ferrari, and Lamborghini.', category: 'general' },
    { question: 'Do you offer pickup and delivery?', answer: 'Yes, we offer complimentary pickup and delivery within Abu Dhabi for members.', category: 'services' },
    { question: 'How long does a major service take?', answer: 'A comprehensive major service typically takes 4-6 hours depending on the vehicle model and specific engineering requirements.', category: 'technical' },
    { question: 'Are your parts genuine?', answer: 'We use 100% genuine OEM parts for all our services to ensure the integrity and performance of your vehicle.', category: 'general' }
]

const blogPosts = [
    { slug: 'summer-maintenance', title: 'Summer Car Maintenance', excerpt: 'Prepare for UAE heat.', content: 'Detailed tips for engine, battery, and AC.', author: 'Tech Team', category: 'Tips', date: '2026-02-08' }
]

const aboutContent = {
    mission: 'Factory-quality services with integrity.',
    values: ['Quality', 'Transparency', 'Customer Focus'],
    stats: [{ label: 'Years Experience', value: '15+' }, { label: 'Happy Customers', value: '1000+' }]
}

// --- SEED FUNCTION ---
async function main() {
    console.log('🌱 Starting full seed...')

    // 1. Services
    for (const s of services) {
        await prisma.service.upsert({
            where: { slug: s.id },
            update: {
                name: s.name, nameAr: s.nameAr, description: s.description, descriptionAr: s.descriptionAr,
                detailedDescription: s.detailedDescription, category: s.category, duration: s.duration,
                icon: s.icon, iconImage: s.iconImage, image: s.image,
                process: JSON.stringify(s.process), subServices: JSON.stringify(s.subServices), seo: JSON.stringify(s.seo)
            },
            create: {
                slug: s.id, name: s.name, nameAr: s.nameAr, description: s.description, descriptionAr: s.descriptionAr,
                detailedDescription: s.detailedDescription, category: s.category, duration: s.duration,
                icon: s.icon, iconImage: s.iconImage, image: s.image,
                process: JSON.stringify(s.process), subServices: JSON.stringify(s.subServices), seo: JSON.stringify(s.seo)
            }
        })
    }

    // 2. Brands & Categories
    for (const cat of brandCategories) {
        for (const b of cat.brands) {
            await prisma.brand.upsert({
                where: { name: b.name },
                update: {
                    slug: b.id, logoFile: b.logoFile, description: b.heritage, specialties: b.specialties,
                    models: b.models, heritage: b.heritage, category: cat.id
                },
                create: {
                    slug: b.id, name: b.name, logoFile: b.logoFile, description: b.heritage, specialties: b.specialties,
                    models: b.models, heritage: b.heritage, category: cat.id
                }
            })
        }
    }

    // 3. Packages, Blog, Content
    for (const p of packages) {
        await prisma.servicePackage.upsert({
            where: { id: p.id },
            update: { title: p.title, subtitle: p.subtitle, features: JSON.stringify(p.features) },
            create: { id: p.id, title: p.title, subtitle: p.subtitle, features: JSON.stringify(p.features) }
        })
    }

    for (const post of blogPosts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: { title: post.title, excerpt: post.excerpt, publishedAt: new Date(post.date) },
            create: { slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, publishedAt: new Date(post.date) }
        })
    }

    await prisma.contentBlock.upsert({
        where: { key: 'about_page_content' },
        update: { value: JSON.stringify(aboutContent), type: 'json' },
        create: { key: 'about_page_content', value: JSON.stringify(aboutContent), type: 'json' }
    })

    // 4. FAQs
    await prisma.fAQ.deleteMany({})
    for (const faq of faqs) {
        await prisma.fAQ.create({ data: faq })
    }

    // 5. Admin
    const adminEmail = 'admin@smartmotor.ae'
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN' },
        create: {
            email: adminEmail,
            name: 'Admin',
            role: 'ADMIN',
            password: await bcrypt.hash('admin123', 10),
        },
    })

    console.log('✅ Database Seeded Successfully.')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
