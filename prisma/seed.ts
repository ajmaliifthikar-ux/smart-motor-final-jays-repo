import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// --- DATA ---

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
            {
                title: 'Engine Services',
                description: 'Complete engine diagnostics, repair, and rebuilding services.',
                features: ['Engine diagnostics & scanning', 'Engine repair & rebuilding', 'Timing belt replacement', 'Engine overhaul services', ' cooling system service']
            },
            {
                title: 'Transmission Services',
                description: 'Expert service for automatic and manual transmissions.',
                features: ['Transmission diagnostics', 'Automatic transmission repair', 'Fluid verification & change', 'Clutch repair & replacement', 'Gearbox overhaul']
            },
            {
                title: 'Oil & Fluid Services',
                description: 'Premium oil change and fluid maintenance.',
                features: ['Synthetic engine oil change', 'Transmission fluid service', 'Brake fluid replacement', 'Coolant system service', 'Differential oil change']
            },
            {
                title: 'Brake Services',
                description: 'Professional brake service for reliable stopping power.',
                features: ['Brake pad replacement', 'Brake disc (rotor) service', 'ABS system diagnostics', 'Brake fluid flush', 'Caliper repair']
            },
            {
                title: 'Suspension & Steering',
                description: 'Restore your vehicle\'s ride quality and handling.',
                features: ['Shock absorber replacement', 'Control arm repair', 'Power steering repair', 'Wheel alignment', 'Air suspension service']
            },
            {
                title: 'Air Conditioning',
                description: 'Essential AC service for Abu Dhabi\'s extreme heat.',
                features: ['AC diagnostics & gas refill', 'Compressor repair', 'Evaporator service', 'Leak detection', 'Climate control repair']
            },
            {
                title: 'Tire Services',
                description: 'Complete tire care and maintenance.',
                features: ['Tire installation & balancing', 'Wheel alignment', 'Tire rotation', 'Puncture repair', 'TPMS service']
            }
        ],
        seo: {
            title: 'Car Mechanical Repair Abu Dhabi | Engine & Transmission Service',
            description: 'Expert mechanical repairs for luxury cars in Abu Dhabi. Engine diagnostics, transmission service, and maintenance by certified technicians.'
        }
    },
    {
        id: 'electrical',
        name: 'Electrical Services',
        nameAr: 'الخدمات الكهربائية',
        description: 'Advanced diagnostics, battery, alternator, and ECU repairs for all brands.',
        descriptionAr: 'تشخيص متقدم، بطارية، مولد، وإصلاح وحدة التحكم الإلكترونية لجميع العلامات التجارية.',
        category: 'mechanical',
        duration: '1-3 Hours',
        icon: 'sparkles',
        iconImage: '/images/services/icons/electrical.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Comprehensive car electrical services including battery replacement, alternator repair, ECU programming, and sensor diagnostics. We fix complex electrical issues in luxury vehicles.',
        process: [
            { step: '01', title: 'Scan', desc: 'Full system diagnostic scan' },
            { step: '02', title: 'Test', desc: 'Battery, alternator and circuit testing' },
            { step: '03', title: 'Fix', desc: 'Precision repair of electrical components' }
        ],
        subServices: [
            {
                title: 'Electrical Diagnostics',
                description: 'Pinpoint accuracy for complex electrical issues.',
                features: ['Computer diagnostic scanning', 'Fault code reading', 'Circuit testing', 'Electrical load testing']
            },
            {
                title: 'Battery & Charging',
                description: 'Keep your vehicle powered and ready.',
                features: ['Battery testing & replacement', 'Alternator repair', 'Starter motor service', 'Cable inspection']
            },
            {
                title: 'ECU & Control Modules',
                description: 'Expert repair for vehicle computers.',
                features: ['ECU diagnostics & repair', 'Sensor replacements', 'Transmission control module', 'Programming & coding']
            },
            {
                title: 'Lighting & Accessories',
                description: 'Repair and upgrade vehicle lighting.',
                features: ['Headlight & taillight repair', 'LED/HID service', 'Power window repair', 'Dashboard cluster repair']
            },
            {
                title: 'Advanced Systems',
                description: 'Service for modern driver assistance systems.',
                features: ['Navigation troubleshooting', 'Parking sensor repair', 'Camera system service', 'ADAS diagnostics']
            }
        ],
        seo: {
            title: 'Car Electrical Repair Abu Dhabi | Auto Electrician',
            description: 'Best auto electrician in Abu Dhabi. Battery replacement, alternator repair, ECU programming, and diagnostics for all car brands.'
        }
    },
    {
        id: 'bodyshop',
        name: 'Body Shop & Accident Repair',
        nameAr: 'ورشة الهيكل وإصلاح الحوادث',
        description: 'Expert body repair, panel beating, and accident damage restoration.',
        descriptionAr: 'إصلاح الهيكل الخبير وسحب الصدمات واستعادة أضرار الحوادث وفقًا لمعايير المصنع.',
        category: 'bodyshop',
        duration: '3-7 Days',
        icon: 'car',
        iconImage: '/images/services/icons/bodyshop.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Professional auto body shop and accident repair in Abu Dhabi. From minor dents to major collision restoration, we use factory-approved techniques to restore your vehicle to its original condition.',
        process: [
            { step: '01', title: 'Assessment', desc: 'Damage evaluation and insurance coordination' },
            { step: '02', title: 'Body Work', desc: 'Panel beating, welding, and structural repair' },
            { step: '03', title: 'Paint', desc: 'Color matching and professional painting' },
            { step: '04', title: 'Finish', desc: 'Polishing and final quality control' }
        ],
        subServices: [
            {
                title: 'Accident Repair',
                description: 'Complete collision restoration services.',
                features: ['Frame straightening', 'Panel replacement', 'Structural repairs', 'Welding services', 'Insurance claim assistance']
            },
            {
                title: 'Paintless Dent Repair (PDR)',
                description: 'Remove dents while preserving factory paint.',
                features: ['Door ding removal', 'Hail damage repair', 'Minor dent removal', 'Crease removal']
            },
            {
                title: 'Body Kit Installation',
                description: 'Transform your vehicle with custom kits.',
                features: ['Front splitter installation', 'Side skirts', 'Rear diffusers', 'Spoiler installation', 'Wide-body kits']
            },
            {
                title: 'Upholstery Services',
                description: 'Interior repair and restoration.',
                features: ['Seat repair', 'Leather restoration', 'Headliner replacement', 'Dashboard wrapping']
            }
        ],
        seo: {
            title: 'Auto Body Shop Abu Dhabi | Accident Repair & Dent Removal',
            description: 'Best car body shop in Musaffah. Accident repair, dent removal, painting, and body kit installation. Insurance claims accepted.'
        }
    },
    {
        id: 'ppf',
        name: 'Paint & Protection',
        nameAr: 'الطلاء والحماية',
        description: 'Professional painting and premium Paint Protection Films (PPF).',
        descriptionAr: 'طلاء احترافي، إصلاح الخدوش، وأفلام حماية الطلاء.',
        category: 'ppf',
        duration: '2-3 Days',
        icon: 'shield',
        iconImage: '/images/services/icons/ppf.png',
        image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        detailedDescription: 'Protect your vehicle\'s paint with our premium Paint Protection Film (PPF) and professional painting services. Factory-quality finishes with advanced color-matching technology.',
        process: [
            { step: '01', title: 'Prep', desc: 'Deep cleaning and paint correction' },
            { step: '02', title: 'Install', desc: 'Precision application of PPF' },
            { step: '03', title: 'Cure', desc: 'Allowing film to bond and cure' }
        ],
        subServices: [
            {
                title: 'Car Painting',
                description: 'Restore and upgrade your vehicle\'s appearance.',
                features: ['Full vehicle resprays', 'Panel painting', 'Scratch repair', 'Smart paint solutions', 'Color matching']
            },
            {
                title: 'Paint Protection Film (PPF)',
                description: 'Invisible armor for your vehicle\'s paint.',
                features: ['Full front-end protection', 'Full vehicle wrap', 'Self-healing film', 'Matte finish options', 'High-impact area coverage']
            }
        ],
        seo: {
            title: 'Car Painting & PPF Abu Dhabi | Paint Protection Film',
            description: 'Professional car painting and PPF installation in Abu Dhabi. Protect your car from scratches and UV rays with premium films.'
        }
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
        detailedDescription: 'Experience unmatched vehicle protection with our professional ceramic coating services. Provides long-term protection against UV rays, chemicals, and environmental contaminants while enhancing gloss.',
        process: [
            { step: '01', title: 'Correction', desc: 'Multi-stage paint correction to remove swirls' },
            { step: '02', title: 'Coating', desc: 'Layered application of ceramic coating' },
            { step: '03', title: 'Bake', desc: 'Infrared curing for maximum hardness' }
        ],
        subServices: [
            {
                title: 'Standard Protection',
                description: 'Entry-level coating for daily protection.',
                features: ['2-3 year durability', 'Single layer application', 'High gloss finish', 'Hydrophobic properties']
            },
            {
                title: 'Premium Protection',
                description: 'Enhanced durability for luxury vehicles.',
                features: ['4-5 year durability', 'Two-layer application', 'Superior scratch resistance', 'Deep gloss']
            },
            {
                title: 'Ultimate Protection',
                description: 'Maximum protection for exotic cars.',
                features: ['5-7+ year durability', 'Multi-layer application', 'Self-healing properties', 'Showroom finish']
            }
        ],
        seo: {
            title: 'Ceramic Coating Abu Dhabi | Car Paint Protection',
            description: 'Best ceramic coating service in Abu Dhabi. Protect your car paint from UV rays and scratches. Long-lasting shine and protection.'
        }
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
        detailedDescription: 'Premium window tinting services in Abu Dhabi. Stay cool and protected with high-quality window films that reject heat and block harmful UV rays.',
        process: [
            { step: '01', title: 'Clean', desc: 'Thorough cleaning of glass surfaces' },
            { step: '02', title: 'Cut', desc: 'Precision computer-cutting of film' },
            { step: '03', title: 'Apply', desc: 'Bubble-free installation' }
        ],
        subServices: [
            {
                title: 'Dyed Film',
                description: 'Affordable glare reduction and privacy.',
                features: ['Good heat rejection', 'Non-reflective', 'Budget-friendly', 'Various shades available']
            },
            {
                title: 'Carbon Film',
                description: 'Superior heat rejection and durability.',
                features: ['Matte finish', 'No signal interference', 'Fade resistant', 'Excellent UV protection']
            },
            {
                title: 'Ceramic Film (Premium)',
                description: 'Maximum heat rejection and clarity.',
                features: ['99% UV protection', 'High IR rejection', 'Crystal clear visibility', 'Best for luxury vehicles']
            }
        ],
        seo: {
            title: 'Car Window Tinting Abu Dhabi | Heat Rejection Films',
            description: 'Professional car window tinting in Abu Dhabi. Ceramic and carbon films for maximum heat rejection and UV protection. UAE legal tinting.'
        }
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
        detailedDescription: 'Complete car detailing tailored to restore your vehicle to showroom condition. From deep interior cleaning to exterior paint correction.',
        process: [
            { step: '01', title: 'Wash', desc: 'Detailed hand wash and decontamination' },
            { step: '02', title: 'Interior', desc: 'Steam cleaning and leather care' },
            { step: '03', title: 'Exterior', desc: 'Polishing and wax application' }
        ],
        subServices: [
            {
                title: 'Exterior Detailing',
                description: 'Restore paint depth and shine.',
                features: ['Paint correction', 'Scratch removal', 'Machine polishing', 'Clay bar treatment', 'Wheel & tire detail']
            },
            {
                title: 'Interior Detailing',
                description: 'Deep clean and sanitize your cabin.',
                features: ['Steam cleaning', 'Leather conditioning', 'Carpet shampooing', 'Odor elimination', 'Fabric protection']
            },
            {
                title: 'Engine Bay Detailing',
                description: 'Safe cleaning for your engine.',
                features: ['Degreasing', 'Component cleaning', 'Dressing & protection', 'Leak inspection']
            }
        ],
        seo: {
            title: 'Car Detailing Abu Dhabi | Interior & Exterior Polishing',
            description: 'Top-rated car detailing in Abu Dhabi. Paint correction, interior deep cleaning, and polishing for all car types.'
        }
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
        detailedDescription: 'Fast and reliable emergency towing and breakdown services across Abu Dhabi. We are available 24/7 to assist you when you need it most.',
        process: [
            { step: '01', title: 'Call', desc: 'Immediate dispatch upon your call' },
            { step: '02', title: 'Arrive', desc: 'Rapid arrival at your location' },
            { step: '03', title: 'Recover', desc: 'Safe transport to our center or your destination' }
        ],
        subServices: [
            {
                title: 'Towing Services',
                description: 'Safe transport for all vehicle types.',
                features: ['Flatbed towing', 'Luxury vehicle transport', 'Sports car towing', 'Long-distance towing']
            },
            {
                title: 'Breakdown Assistance',
                description: 'On-site emergency repairs.',
                features: ['Battery jump-start', 'Flat tire assistance', 'Fuel delivery', 'Lockout service']
            },
            {
                title: 'Accident Recovery',
                description: 'Professional recovery from accident scenes.',
                features: ['Scene assistance', 'Vehicle recovery', 'Insurance process support']
            }
        ],
        seo: {
            title: 'Car Towing Service Abu Dhabi | 24/7 Recovery',
            description: 'Fast car towing and recovery service in Abu Dhabi. 24/7 roadside assistance, battery jump start, and flatbed towing.'
        }
    }
]

const brandCategories = [
    {
        id: 'european',
        name: 'European Brands',
        slug: 'european-brands',
        description: 'Luxury, performance, and advanced technology specialists for British and Swedish marques.',
        brands: [
            {
                id: 'land-rover',
                name: 'Range Rover / Land Rover',
                logo: '/brands/landrover-logo.png',
                heroImage: '/images/brands/landrover-hero.jpg',
                description: 'Complete Range Rover and Land Rover service including all-terrain system specialists.',
                specialties: ['Terrain Response', 'Air Suspension', 'Ingenium Engines'],
                models: ['Range Rover', 'Sport', 'Velar', 'Evoque', 'Defender', 'Discovery'],
                services: ['Air suspension repair', 'Terrain Response calibration', 'Engine overhaul', 'Electrical gloss']
            },
            {
                id: 'jaguar',
                name: 'Jaguar',
                logo: '/brands/jaguar-logo.png',
                heroImage: '/images/brands/jaguar-hero.jpg',
                description: 'Expert Jaguar service for all models including I-PACE electric vehicles.',
                specialties: ['F-Type Performance', 'I-PACE EV', 'Ingenium Engines'],
                models: ['F-Pace', 'E-Pace', 'F-Type', 'XE', 'XF', 'XJ'],
                services: ['Supercharger service', 'Cooling system repair', 'Electrical diagnostics', 'Brake service']
            },
            {
                id: 'volvo',
                name: 'Volvo',
                logo: '/brands/volvo-logo.png',
                heroImage: '/images/brands/volvo-hero.jpg',
                description: 'Specialized Volvo service with focus on safety systems and hybrid technology.',
                specialties: ['Pilot Assist', 'PHEV Systems', 'Drive-E Engines'],
                models: ['XC90', 'XC60', 'XC40', 'S90', 'S60', 'V60'],
                services: ['Hybrid battery health', 'Safety system calibration', 'Engine diagnostics', 'Software updates']
            }
        ]
    },
    {
        id: 'german',
        name: 'German Brands',
        slug: 'german-brands',
        description: 'German engineering is renowned worldwide for precision, performance, and innovation. Our technicians specialize in German vehicles with brand-specific diagnostic equipment.',
        brands: [
            {
                id: 'bmw',
                name: 'BMW',
                logo: '/brands/bmw-logo.png',
                heroImage: '/images/brands/bmw-hero.jpg',
                description: 'Complete BMW service and repair from 3-Series to 7-Series, X models, M-Performance, and i-Series electric vehicles.',
                specialties: ['M-Performance', 'iDrive Systems', 'EfficientDynamics', 'Electrical Diagnostics'],
                models: ['3-Series', '5-Series', '7-Series', 'X3', 'X5', 'X7', 'M3', 'M4', 'M5', 'iX', 'i4'],
                services: ['Engine diagnostics', 'Transmission service', 'Electrical system diagnostics', 'iDrive system troubleshooting']
            },
            {
                id: 'mercedes',
                name: 'Mercedes-Benz',
                logo: '/brands/mercedes-logo.png',
                heroImage: '/images/brands/mercedes-hero.jpg',
                description: 'Authorized expertise for all Mercedes-Benz models from C-Class to S-Class, AMG performance, and EQ electric vehicles.',
                specialties: ['AMG Performance', 'EQ Electric', 'Airmatic Suspension', 'COMAND System'],
                models: ['C-Class', 'E-Class', 'S-Class', 'G-Wagon', 'GLE', 'GLS', 'AMG GT', 'EQS', 'EQE'],
                services: ['COMAND system diagnostics', 'Airmatic suspension service', 'AMG performance maintenance', '4MATIC system service']
            },
            {
                id: 'audi',
                name: 'Audi',
                logo: '/brands/audi-logo.png',
                heroImage: '/images/brands/audi-hero.jpg',
                description: 'Specialized Audi service for all models including Quattro, S-Line, RS performance, and e-tron electric vehicles.',
                specialties: ['Quattro AWD', 'e-tron Electric', 'RS Performance', 'Virtual Cockpit'],
                models: ['A3', 'A4', 'A6', 'A8', 'Q5', 'Q7', 'Q8', 'RS6', 'RS Q8', 'e-tron GT'],
                services: ['Quattro AWD system service', 'MMI system diagnostics', 'Virtual cockpit troubleshooting', 'S and RS performance service']
            },
            {
                id: 'porsche',
                name: 'Porsche',
                logo: '/brands/porsche-logo.png',
                heroImage: '/images/brands/porsche-hero.jpg',
                description: 'Expert Porsche service for 911, Cayenne, Macan, Panamera, and Taycan electric sports cars.',
                specialties: ['PDK Transmission', 'Taycan Electric', 'Sport Chrono', 'PASM Suspension'],
                models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman'],
                services: ['Performance engine service', 'PDK transmission service', 'Sport Chrono system', 'PASM suspension service']
            },
            {
                id: 'volkswagen',
                name: 'Volkswagen',
                logo: '/brands/vw-logo.png',
                heroImage: '/images/brands/vw-hero.jpg',
                description: 'Complete VW service for all models from Golf to Touareg, GTI performance, and ID electric vehicles.',
                specialties: ['DSG Transmission', 'TSI/TDI Engines', '4MOTION', 'ID Electric'],
                models: ['Golf', 'GTI', 'R', 'Tiguan', 'Touareg', 'Teramont', 'ID.4', 'ID.6'],
                services: ['TSI/TDI engine service', 'DSG transmission service', '4MOTION AWD service', 'Infotainment system']
            }
        ]
    },
    {
        id: 'japanese',
        name: 'Japanese Brands',
        slug: 'japanese-brands',
        description: 'Japanese vehicles are renowned for reliability, efficiency, and advanced technology. Our team has extensive experience servicing all major Japanese brands.',
        brands: [
            {
                id: 'toyota',
                name: 'Toyota',
                logo: '/brands/toyota-logo.png',
                heroImage: '/images/brands/toyota-hero.jpg',
                description: 'Complete Toyota service including Land Cruiser, Camry, Corolla, Prado, and hybrid models.',
                specialties: ['Hybrid Synergy Drive', 'Land Cruiser 4x4', 'Off-road Prep'],
                models: ['Land Cruiser', 'Prado', 'Camry', 'Corolla', 'RAV4', 'Highlander', 'Crown', 'Supra'],
                services: ['Hybrid system maintenance', '4x4 system maintenance', 'Engine diagnostics', 'Transmission repair']
            },
            {
                id: 'lexus',
                name: 'Lexus',
                logo: '/brands/lexus-logo.png',
                heroImage: '/images/brands/lexus-hero.jpg',
                description: 'Luxury Lexus service for all models including ES, LS, LX, RX, and hybrid vehicles.',
                specialties: ['Luxury Hybrid', 'Advanced Safety', 'LX 4x4 Systems'],
                models: ['LS', 'ES', 'IS', 'LX600', 'RX', 'NX', 'GX'],
                services: ['Hybrid battery service', 'Luxury interior care', 'Suspension service', 'Electrical diagnostics']
            },
            {
                id: 'nissan',
                name: 'Nissan',
                logo: '/brands/nissan-logo.png',
                heroImage: '/images/brands/nissan-hero.jpg',
                description: 'Expert Nissan service from Altima to Patrol, including Z sports cars and Leaf electric vehicles.',
                specialties: ['Patrol Y62/Y63', 'GT-R Performance', 'Intelligent Mobility'],
                models: ['Patrol', 'Altima', 'Maxima', 'X-Terra', 'Pathfinder', 'Z', 'GT-R'],
                services: ['Patrol performance tuning', 'CVT transmission service', 'Engine diagnostics', 'Suspension upgrades']
            },
            {
                id: 'honda',
                name: 'Honda',
                logo: '/brands/honda-logo.png',
                heroImage: '/images/brands/honda-hero.jpg',
                description: 'Complete Honda service for Accord, Civic, CR-V, Pilot, and hybrid models.',
                specialties: ['i-VTEC Engines', 'Honda Sensing', 'Hybrid Systems'],
                models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'ZR-V', 'HR-V'],
                services: ['VTEC engine tuning', 'CVT maintenance', 'Hybrid system checks', 'Brake service']
            },
            {
                id: 'mazda',
                name: 'Mazda',
                logo: '/brands/mazda-logo.png',
                heroImage: '/images/brands/mazda-hero.jpg',
                description: 'Specialized Mazda service for all models including SKYACTIV technology vehicles.',
                specialties: ['SKYACTIV Tech', 'i-ACTIVSENSE', 'Rotary Heritage'],
                models: ['Mazda6', 'CX-5', 'CX-9', 'CX-60', 'MX-5'],
                services: ['SKYACTIV engine service', 'Transmission repair', 'Safety system calibration', 'Periodic maintenance']
            },
            {
                id: 'mitsubishi',
                name: 'Mitsubishi',
                logo: '/brands/mitsubishi-logo.png',
                heroImage: '/images/brands/mitsubishi-hero.jpg',
                description: 'Expert Mitsubishi service including Pajero, Outlander, and Eclipse Cross.',
                specialties: ['Super Select 4WD', 'PHEV Systems', 'MIVEC Engines'],
                models: ['Pajero', 'Outlander', 'Montero Sport', 'Eclipse Cross', 'ASX'],
                services: ['4WD system service', 'CVT transmission repair', 'Hybrid maintenance', 'Engine tuning']
            },
            {
                id: 'infiniti',
                name: 'Infiniti',
                logo: '/brands/infiniti-logo.png',
                heroImage: '/images/brands/infiniti-hero.jpg',
                description: 'Luxury Infiniti service for all models with advanced technology support.',
                specialties: ['VC-Turbo', 'ProPILOT', 'Luxury Performance'],
                models: ['QX80', 'QX60', 'Q50', 'QX50', 'Q60'],
                services: ['Turbo engine repair', 'Electrical diagnostics', 'AC system service', 'Suspension repair']
            }
        ]
    },
    {
        id: 'chinese',
        name: 'Chinese Brands',
        slug: 'chinese-brands',
        description: 'Smart Motor Auto Repair positions itself as an early specialist in Chinese luxury and electric vehicles entering the UAE market.',
        brands: [
            {
                id: 'byd',
                name: 'BYD',
                logo: '/brands/byd-logo.png',
                heroImage: '/images/brands/byd-hero.jpg',
                description: 'Specialized BYD service for all models including Seal, Han, Tang, Atto 3, and Dolphin electric vehicles.',
                specialties: ['Blade Battery', 'DM-i Hybrid', 'EV Powertrain'],
                models: ['Han', 'Tang', 'Seal', 'Atto 3', 'Dolphin', 'Qin Plus'],
                services: ['Blade Battery health check', 'High-voltage system repairs', 'Software updates', 'Regenerative braking service']
            },
            {
                id: 'mg',
                name: 'MG',
                logo: '/brands/mg-logo.png',
                heroImage: '/images/brands/mg-hero.jpg',
                description: 'Complete MG service for all models including ZS, HS, RX5, and electric ZS EV.',
                specialties: ['ZS EV', 'Turbo Engines', 'DCT Transmission'],
                models: ['MG GT', 'MG HS', 'MG RX5', 'MG ZS EV', 'MG One', 'MG Whale'],
                services: ['Turbo engine maintenance', 'Dual-clutch transmission service', 'EV battery check', 'Electrical diagnostics']
            },
            {
                id: 'hongqi',
                name: 'Hongqi',
                logo: '/brands/hongqi-logo.png',
                heroImage: '/images/brands/hongqi-hero.jpg',
                description: 'Luxury Hongqi service including H5, H7, H9, and HS models - Chinese luxury vehicle specialists.',
                specialties: ['Luxury Sedan Care', 'HS SUV Series', 'Premium Electronics'],
                models: ['H9', 'H5', 'HS5', 'HS7', 'E-HS9'],
                services: ['Air suspension calibration', 'Luxury interior detailing', 'Advanced electronics diagnostics', 'Engine tuning']
            },
            {
                id: 'haval',
                name: 'Haval',
                logo: '/brands/haval-logo.png',
                heroImage: '/images/brands/haval-hero.jpg',
                description: 'Expert Haval SUV service including H6, Jolion, and all-terrain models.',
                specialties: ['H6 Hybrid', 'Jolion DCT', 'Off-road Systems'],
                models: ['H6', 'Jolion', 'H9', 'Dargo'],
                services: ['Turbocharged engine service', 'DCT transmission maintenance', '4WD system checks', 'Electronics repair']
            },
            {
                id: 'voyah',
                name: 'Voyah',
                logo: '/brands/voyah-logo.png',
                heroImage: '/images/brands/voyah-hero.jpg',
                description: 'Premium Voyah electric and hybrid vehicle service - Chinese luxury EV specialists.',
                specialties: ['EV Luxury', 'High Voltage', 'Smart Cockpit'],
                models: ['Free', 'Dreamer', 'Passion'],
                services: ['EV battery diagnostics', 'Smart system updates', 'Luxury interior care', 'Air suspension service']
            },
            {
                id: 'aito',
                name: 'Aito',
                logo: '/brands/aito-logo.png',
                heroImage: '/images/brands/aito-hero.jpg',
                description: 'Specialized Aito service including M5, M7, M9 - Huawei HarmonyOS-powered vehicles.',
                specialties: ['HarmonyOS', 'Range Extender', 'Huawei Tech'],
                models: ['M5', 'M7', 'M9'],
                services: ['Hybrid system service', 'Infotainment updates', 'Sensor calibration', 'Routine maintenance']
            },
            {
                id: 'jetour',
                name: 'Jetour',
                logo: '/brands/jetour-logo.png',
                heroImage: '/images/brands/jetour-hero.jpg',
                description: 'Specialized service for Jetour X70, X90, and Dashing models.',
                specialties: ['X70/X90 Series', 'Dashing Tech', 'SUV Maintenance'],
                models: ['X70', 'X70 Plus', 'X90 Plus', 'Dashing', 'T2'],
                services: ['Engine periodic maintenance', 'Transmission fluid change', 'Suspension inspection', 'Computer diagnostics']
            },
            {
                id: 'geely',
                name: 'Geely',
                logo: '/brands/geely-logo.png',
                heroImage: '/images/brands/geely-hero.jpg',
                description: 'Expert service for Geely Monjaro, Coolray, and Tugella.',
                specialties: ['CMA Platform', 'Volvo-shared Tech', 'Turbo Engines'],
                models: ['Monjaro', 'Coolray', 'Tugella', 'Emgrand', 'Geometry C'],
                services: ['Engine timing', 'Transmission programming', 'Electrical troubleshooting', 'AC service']
            }
        ]
    },
    {
        id: 'american',
        name: 'American Brands',
        slug: 'american-brands',
        description: 'From muscle cars to luxury SUVs, we handle American power and performance.',
        brands: [
            {
                id: 'ford',
                name: 'Ford',
                logo: '/brands/ford-logo.png',
                heroImage: '/images/brands/ford-hero.jpg',
                description: 'Complete Ford service including F-Series, Mustang, Explorer, and electric vehicles.',
                specialties: ['EcoBoost', 'Mustang Performance', 'Truck Maintenance'],
                models: ['F-150', 'Mustang', 'Explorer', 'Expedition', 'Edge', 'Bronco', 'Raptor'],
                services: ['EcoBoost turbo service', 'Transmission repair', 'Suspension lifts', 'Electrical repair']
            },
            {
                id: 'chevrolet',
                name: 'Chevrolet',
                logo: '/brands/chevrolet-logo.png',
                heroImage: '/images/brands/chevrolet-hero.jpg',
                description: 'Expert Chevrolet service including Corvette, Camaro, Tahoe, and Suburban.',
                specialties: ['Corvette/Camaro', 'V8 Engines', 'Large SUVs'],
                models: ['Tahoe', 'Suburban', 'Silverado', 'Corvette', 'Camaro', 'Blazer'],
                services: ['V8 engine tuning', 'Transmission service', 'AC repair', 'Brake upgrades']
            },
            {
                id: 'gmc',
                name: 'GMC',
                logo: '/brands/gmc-logo.png',
                heroImage: '/images/brands/gmc-hero.jpg',
                description: 'Specialized GMC service for Sierra, Yukon, and all professional-grade vehicles.',
                specialties: ['Denali Trim', 'Heavy Duty', 'Duramax Diesel'],
                models: ['Sierra', 'Yukon', 'Yukon XL', 'Acadia', 'Terrain'],
                services: ['Heavy-duty truck service', 'Diesel engine maintenance', '4x4 repair', 'Electrical diagnostics']
            },
            {
                id: 'jeep',
                name: 'Jeep',
                logo: '/brands/jeep-logo.png',
                heroImage: '/images/brands/jeep-hero.jpg',
                description: 'Expert Jeep service for Wrangler, Grand Cherokee, and all 4x4 models.',
                specialties: ['Wrangler Customization', '4x4 Systems', 'Pentastar/Hemi'],
                models: ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Compass'],
                services: ['Off-road suspension', 'Differential service', 'Engine repair', 'Electrical accessories']
            },
            {
                id: 'cadillac',
                name: 'Cadillac',
                logo: '/brands/cadillac-logo.png',
                heroImage: '/images/brands/cadillac-hero.jpg',
                description: 'Luxury Cadillac service for Escalade and all premium American vehicles.',
                specialties: ['Escalade', 'V-Series', 'Super Cruise'],
                models: ['Escalade', 'CT4', 'CT5', 'XT4', 'XT5', 'XT6'],
                services: ['Magnetic Ride Control service', 'CUE system repair', 'Engine diagnostics', 'Luxury maintenance']
            },
            {
                id: 'dodge',
                name: 'Dodge',
                logo: '/brands/dodge-logo.png',
                heroImage: '/images/brands/dodge-hero.jpg',
                description: 'Performance Dodge service including Charger, Challenger, and Durango.',
                specialties: ['HEMI Engines', 'SRT/Hellcat', 'Performance'],
                models: ['Charger', 'Challenger', 'Durango', 'Ram'],
                services: ['High-performance tuning', 'Supercharger maintenance', 'Suspension upgrades', 'Brake service']
            }
        ]
    }
]

const packages = [
    {
        id: 'special-service-package',
        title: 'Special Service Package',
        subtitle: '50,000 KM Coverage',
        isPromotional: true,
        bestFor: 'Long-term maintenance',
        features: [
            '1 Major Service',
            '4 Minor Services',
            'Complete Coverage',
            'Save Up to 30%'
        ],
        validity: '1 Year or 50,000 KM'
    },
    {
        id: 'current-promotion',
        title: 'Current Promotion',
        subtitle: 'Limited Time Offer',
        isPromotional: true,
        bestFor: 'Immediate savings',
        features: [
            '50% OFF Minor Services',
            '25% OFF Labour Charges',
            'All Car Brands',
            'Free Multi-point Inspection'
        ],
        validity: 'Limited Time Only'
    }
]

const aboutContent = {
    mission: 'To provide factory-quality automotive services at competitive prices while building lasting relationships with our customers through transparency, integrity, and excellence.',
    values: ['Quality Excellence', 'Transparency', 'Customer Focus', 'Continuous Innovation', 'Professional Integrity'],
    story: 'Established in Abu Dhabi, Smart Motor Auto Repair has grown from a humble workshop to a premier automotive service center. With over 15 years of experience, we have continuously invested in state-of-the-art technology and training to meet the evolving needs of modern vehicles.',
    stats: [
        { label: 'Years Experience', value: '15+' },
        { label: 'Happy Customers', value: '1000+' },
        { label: 'Brand Specialists', value: '50+' },
        { label: 'Service Guarantee', value: '7-Day' }
    ],
    features: [
        'Factory-quality standards',
        'State-of-the-art equipment',
        'Certified technicians',
        'Comprehensive services',
        'Transparent pricing',
        'Convenient location',
        '7-day service'
    ]
}

const blogPosts = [
    {
        id: '1',
        slug: 'summer-maintenance-tips',
        title: 'Essential Summer Car Maintenance Tips for Abu Dhabi Drivers',
        excerpt: 'Prepare your vehicle for the extreme UAE heat with our comprehensive summer maintenance checklist.',
        content: 'Summer in the UAE can be brutal on vehicles. High temperatures can stress your engine, battery, and tires. Here are key tips: Check your coolant levels, test your battery, inspect tire pressure and tread, and ensure your AC is performing optimally.',
        date: 'February 8, 2026',
        author: 'Smart Motor Tech Team',
        category: 'Maintenance Tips',
        image: '/images/blog/summer-tips.jpg'
    },
    {
        id: '2',
        slug: 'ceramic-coating-benefits',
        title: 'Is Ceramic Coating Worth It in UAE?',
        excerpt: 'Discover why ceramic coating is considered the ultimate protection for your car\'s paint in the desert climate.',
        content: 'Ceramic coating offers superior protection against UV rays, sandstorms, and bird droppings tailored for the UAE environment. Unlike wax, it bonds with the paint for long-lasting durability and a showroom shine.',
        date: 'February 5, 2026',
        author: 'Detailing Specialist',
        category: 'Protection',
        image: '/images/blog/ceramic-coating.jpg'
    },
    {
        id: '3',
        slug: 'ev-maintenance-guide',
        title: 'Electric Vehicle Maintenance: What You Need to Know',
        excerpt: 'As EVs become more popular in Abu Dhabi, learn about the specific maintenance needs of electric cars.',
        content: 'While EVs have fewer moving parts than ICE vehicles, they still require specialized care. Battery health checks, tire rotation due to instant torque, and brake fluid checks are essential. Our technicians are certified for HV systems.',
        date: 'January 28, 2026',
        author: 'EV Division',
        category: 'EV Insights',
        image: '/images/blog/ev-maintenance.jpg'
    }
]

const faqs = [
    {
        question: 'What brands do you specialize in?',
        questionAr: 'ما هي الماركات التي تتخصصون بها؟',
        answer: 'We specialize in European luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and Bentley. Our technicians are factory-trained and use OEM parts.',
        answerAr: 'نحن متخصصون في السيارات الفاخرة الأوروبية بما في ذلك مرسيدس-بنز وبي إم دبليو وأودي وبورشه ورينج روفر وبنتلي. فنيونا مدربون من المصنع ويستخدمون قطع غيار أصلية.',
        category: 'general',
    },
    {
        question: 'Do you provide pickup and delivery service?',
        questionAr: 'هل توفرون خدمة الاستلام والتوصيل؟',
        answer: 'Yes, we offer complimentary pickup and delivery service within Abu Dhabi for Gold and Platinum loyalty members. Other customers can avail this service for a nominal fee.',
        answerAr: 'نعم، نقدم خدمة استلام وتوصيل مجانية داخل أبوظبي لأعضاء الولاء الذهبي والبلاتيني. يمكن للعملاء الآخرين الاستفادة من هذه الخدمة مقابل رسوم رمزية.',
        category: 'services',
    },
    {
        question: 'How long does PPF installation take?',
        questionAr: 'كم يستغرق تركيب فيلم حماية الطلاء؟',
        answer: 'Full vehicle PPF installation typically takes 2-3 days. Partial coverage (front bumper, hood, fenders) can be completed in 1 day. We use only premium Xpel films.',
        answerAr: 'عادة ما يستغرق تركيب فيلم حماية الطلاء للسيارة بالكامل 2-3 أيام. يمكن إكمال التغطية الجزئية (المصد الأمامي، غطاء المحرك، الرفارف) في يوم واحد. نستخدم فقط أفلام Xpel الممتازة.',
        category: 'ppf',
    },
    {
        question: 'What warranty do you offer on ceramic coating?',
        questionAr: 'ما هو الضمان الذي تقدمونه على طلاء السيراميك؟',
        answer: 'Our Gtechniq ceramic coating comes with up to 9 years warranty depending on the package selected. We are certified Gtechniq installers.',
        answerAr: 'يأتي طلاء السيراميك Gtechniq الخاص بنا بضمان يصل إلى 9 سنوات حسب الباقة المختارة. نحن معتمدون لتركيب Gtechniq.',
        category: 'ceramic',
    },
    {
        question: 'Do you offer financing options?',
        questionAr: 'هل تقدمون خيارات تمويل؟',
        answer: 'Yes, we partner with Tabby for buy-now-pay-later options, allowing you to split payments into 4 interest-free installments.',
        answerAr: 'نعم، نتشارك مع Tabby لخيارات الشراء الآن والدفع لاحقًا، مما يتيح لك تقسيم المدفوعات إلى 4 أقساط بدون فوائد.',
        category: 'payment',
    },
    {
        question: 'What are your operating hours?',
        questionAr: 'ما هي ساعات العمل لديكم؟',
        answer: 'We are open Saturday to Thursday, 8:00 AM to 6:00 PM. Closed on Fridays. Emergency towing is available 24/7.',
        answerAr: 'نحن مفتوحون من السبت إلى الخميس، من 8:00 صباحًا إلى 6:00 مساءً. مغلق يوم الجمعة. خدمة السحب الطارئة متاحة على مدار الساعة.',
        category: 'general',
    },
]

// --- SEED FUNCTION ---

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Seed Services
    for (const service of services) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { subServices, process, seo, ...rest } = service
        // Need to explicitly cast Json fields for compatibility
        await prisma.service.upsert({
            where: { slug: service.id }, // Using id as slug
            update: {
                name: service.name,
                nameAr: service.nameAr,
                description: service.description,
                descriptionAr: service.descriptionAr,
                detailedDescription: service.detailedDescription,
                category: service.category,
                duration: service.duration,
                icon: service.icon,
                iconImage: service.iconImage,
                image: service.image,
                process: service.process ? JSON.stringify(service.process) : undefined,
                subServices: service.subServices ? JSON.stringify(service.subServices) : undefined,
                seo: service.seo ? JSON.stringify(service.seo) : undefined,
            },
            create: {
                slug: service.id,
                name: service.name,
                nameAr: service.nameAr,
                description: service.description,
                descriptionAr: service.descriptionAr,
                detailedDescription: service.detailedDescription,
                category: service.category,
                duration: service.duration,
                icon: service.icon,
                iconImage: service.iconImage,
                image: service.image,
                process: service.process ? JSON.stringify(service.process) : undefined,
                subServices: service.subServices ? JSON.stringify(service.subServices) : undefined,
                seo: service.seo ? JSON.stringify(service.seo) : undefined,
            },
        })
    }

    // 2. Seed Brands
    for (const category of brandCategories) {
        for (const brand of category.brands) {
            await prisma.brand.upsert({
                where: { name: brand.name },
                update: {
                    slug: brand.id,
                    logoUrl: brand.logo,
                    heroImage: brand.heroImage,
                    description: brand.description,
                    specialties: Array.isArray(brand.specialties) ? brand.specialties.join(',') : brand.specialties,
                    models: Array.isArray(brand.models) ? brand.models.join(',') : brand.models,
                    services: Array.isArray(brand.services) ? brand.services.join(',') : brand.services,
                    category: category.id
                },
                create: {
                    slug: brand.id,
                    name: brand.name,
                    logoUrl: brand.logo,
                    heroImage: brand.heroImage,
                    description: brand.description,
                    specialties: Array.isArray(brand.specialties) ? brand.specialties.join(',') : brand.specialties,
                    models: Array.isArray(brand.models) ? brand.models.join(',') : brand.models,
                    services: Array.isArray(brand.services) ? brand.services.join(',') : brand.services,
                    category: category.id
                },
            })
        }
    }

    // 3. Seed Service Packages
    for (const pkg of packages) {
        await prisma.servicePackage.upsert({
            where: { id: pkg.id },
            update: {
                title: pkg.title,
                subtitle: pkg.subtitle,
                isPromotional: pkg.isPromotional,
                bestFor: pkg.bestFor,
                features: Array.isArray(pkg.features) ? JSON.stringify(pkg.features) : pkg.features,
                validity: pkg.validity
            },
            create: {
                id: pkg.id,
                title: pkg.title,
                subtitle: pkg.subtitle,
                isPromotional: pkg.isPromotional,
                bestFor: pkg.bestFor,
                features: Array.isArray(pkg.features) ? JSON.stringify(pkg.features) : pkg.features,
                validity: pkg.validity
            }
        })
    }

    // 4. Seed Blog Posts
    for (const post of blogPosts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: {
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                author: post.author,
                category: post.category,
                publishedAt: new Date(post.date), // Simple parsing
                isPublished: true
            },
            create: {
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                author: post.author,
                category: post.category,
                publishedAt: new Date(post.date),
                isPublished: true
            }
        })
    }

    // 5. Seed About Content
    await prisma.contentBlock.upsert({
        where: { key: 'about_page_content_v2' },
        update: {
            value: JSON.stringify(aboutContent),
            type: 'json'
        },
        create: {
            key: 'about_page_content_v2',
            value: JSON.stringify(aboutContent),
            type: 'json',
            status: 'PUBLISHED'
        }
    })

    // 6. Seed FAQs
    await prisma.fAQ.deleteMany({}) // Clean start for FAQs
    for (const faq of faqs) {
        await prisma.fAQ.create({
            data: faq
        })
    }

    // 7. Admin User
    const adminEmail = 'admin@smartmotor.ae'
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin',
            role: 'ADMIN',
            password: await bcrypt.hash('admin', 10),
        },
    })

    console.log('✅ V2 Content Seeding complete.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
