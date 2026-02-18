import { Car, Service, Testimonial, FAQ } from '@/types'

export const cars: Car[] = [
  {
    id: 'lamborghini',
    brand: 'lamborghini',
    brandName: 'Lamborghini',
    modelName: 'Gallardo LP560-4',
    modelPath: '/models/lamborghini.glb',
    color: '#D4AF37',
  },
  {
    id: 'bugatti',
    brand: 'bugatti',
    brandName: 'Bugatti',
    modelName: 'Chiron Super Sport',
    modelPath: '/models/bugatti.glb',
    color: '#0066b1',
  },
  {
    id: 'rollsroyce',
    brand: 'rollsroyce',
    brandName: 'Rolls Royce',
    modelName: 'Phantom',
    modelPath: '/models/rollsroyce.glb',
    color: '#333333',
  },
  {
    id: 'ferrari',
    brand: 'ferrari',
    brandName: 'Ferrari',
    modelName: 'LaFerrari',
    modelPath: '/models/ferrari.glb',
    color: '#bb0a30',
  },
]

export const services: Service[] = [
  {
    id: 'mechanical',
    name: 'Mechanical & Electrical',
    nameAr: 'الميكانيكا والكهرباء',
    description: 'Complete engine diagnostics, repairs, and electrical system maintenance for European luxury vehicles.',
    descriptionAr: 'تشخيص كامل للمحرك والإصلاحات وصيانة النظام الكهربائي للسيارات الفاخرة الأوروبية.',
    category: 'mechanical',
    basePrice: 500,
    duration: '2-4 hours',
    icon: 'wrench',
    image: '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp',
  },
  {
    id: 'bodyshop',
    name: 'Bodyshop & Accident Repair',
    nameAr: 'ورشة الهيكل وإصلاح الحوادث',
    description: 'Expert body repair, panel beating, and accident damage restoration to factory standards.',
    descriptionAr: 'إصلاح الهيكل الخبير وسحب الصدمات واستعادة أضرار الحوادث وفقًا لمعايير المصنع.',
    category: 'bodyshop',
    basePrice: 1500,
    duration: '3-7 days',
    icon: 'car',
    image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
  },
  {
    id: 'ppf',
    name: 'Paint Protection Film (Xpel)',
    nameAr: 'فيلم حماية الطلاء (Xpel)',
    description: 'Premium Xpel paint protection film installation to guard against scratches, chips, and UV damage.',
    descriptionAr: 'تركيب فيلم حماية الطلاء Xpel الممتاز للحماية من الخدوش والرقائق وأضرار الأشعة فوق البنفسجية.',
    category: 'ppf',
    basePrice: 5000,
    duration: '2-3 days',
    icon: 'shield',
    image: '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
  },
  {
    id: 'ceramic',
    name: 'Ceramic Coating (Gtechniq)',
    nameAr: 'طلاء السيراميك (Gtechniq)',
    description: 'Professional Gtechniq ceramic coating for long-lasting paint protection and stunning gloss.',
    descriptionAr: 'طلاء السيراميك الاحترافي Gtechniq لحماية الطلاء طويلة الأمد واللمعان المذهل.',
    category: 'ceramic',
    basePrice: 3000,
    duration: '1-2 days',
    icon: 'sparkles',
    image: '/images/services/Gemini_Generated_Image_7vknrq7vknrq7vkn.webp',
  },
  {
    id: 'tinting',
    name: 'Window Tinting',
    nameAr: 'تظليل النوافذ',
    description: 'High-quality window tinting for privacy, UV protection, and heat reduction.',
    descriptionAr: 'تظليل نوافذ عالي الجودة للخصوصية والحماية من الأشعة فوق البنفسجية وتقليل الحرارة.',
    category: 'tinting',
    basePrice: 800,
    duration: '3-4 hours',
    icon: 'sun',
    image: '/images/services/Gemini_Generated_Image_acgzrhacgzrhacgz.webp',
  },
  {
    id: 'detailing',
    name: 'Detailing & Polishing',
    nameAr: 'التفصيل والتلميع',
    description: 'Premium interior and exterior detailing to restore your vehicle to showroom condition.',
    descriptionAr: 'تفصيل داخلي وخارجي فاخر لاستعادة سيارتك إلى حالة صالة العرض.',
    category: 'detailing',
    basePrice: 400,
    duration: '4-6 hours',
    icon: 'sparkles',
    image: '/images/services/Gemini_Generated_Image_7vknrq7vknrq7vkn.webp',
  },
  {
    id: 'towing',
    name: 'Towing & Breakdown',
    nameAr: 'السحب والأعطال',
    description: '24/7 emergency towing and roadside assistance across Abu Dhabi.',
    descriptionAr: 'خدمة السحب والمساعدة على الطريق على مدار الساعة في جميع أنحاء أبوظبي.',
    category: 'towing',
    // basePrice: 200,
    duration: '30-60 mins',
    icon: 'truck',
    image: '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp',
    detailedDescription: 'Emergency roadside assistance and recovery services across the UAE. We use specialized flatbed trailers for luxury and low-profile vehicles.',
    process: [
      { step: '01', title: 'Request Dispatch', desc: 'Secure one-tap booking via app' },
      { step: '02', title: 'Location Sync', desc: 'Live GPS tracking of your recovery unit' },
      { step: '03', title: 'Safe Transit', desc: 'Double-strapped specialized luxury towing' }
    ],
    seo: {
      title: 'Emergency Towing Abu Dhabi | Smart Motor Performance',
      description: '24/7 Professional towing and recovery for luxury cars in Abu Dhabi. Specialized flatbeds for low-profile vehicles.'
    }
  },
]

export const brandSocials = {
  mercedes: { instagram: 'https://www.instagram.com/mercedesbenz/', facebook: 'https://www.facebook.com/mercedesbenz/' },
  bmw: { instagram: 'https://www.instagram.com/bmw/', facebook: 'https://www.facebook.com/BMW/' },
  porsche: { instagram: 'https://www.instagram.com/porsche/', facebook: 'https://www.facebook.com/porsche/' },
  bugatti: { instagram: 'https://www.instagram.com/bugatti/', facebook: 'https://www.facebook.com/bugatti/' },
  ferrari: { instagram: 'https://www.instagram.com/ferrari/', facebook: 'https://www.facebook.com/ferrari/' },
  rollsroyce: { instagram: 'https://www.instagram.com/rollsroycecars/', facebook: 'https://www.facebook.com/rollsroycecars/' },
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmed Al Mansouri',
    rating: 5,
    comment: 'Exceptional service! They took care of my Mercedes like it was their own. The ceramic coating looks absolutely stunning.',
    carBrand: 'mercedes',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Best PPF installation in Abu Dhabi. The team is professional and the results are flawless. Highly recommended!',
    carBrand: 'porsche',
    date: '2024-01-10',
  },
  {
    id: '3',
    name: 'Mohammed Hassan',
    rating: 5,
    comment: 'I\'ve been bringing my BMW here for 5 years. Consistent quality and honest service every time.',
    carBrand: 'bmw',
    date: '2024-01-05',
  },
  {
    id: '4',
    name: 'Emily Chen',
    rating: 4,
    comment: 'Great experience with their detailing service. My Range Rover looks brand new again!',
    carBrand: 'range-rover',
    date: '2023-12-28',
  },
  {
    id: '5',
    name: 'Khalid Al Dhaheri',
    rating: 5,
    comment: 'The accident repair on my Audi was perfect. You can\'t even tell there was any damage. True professionals!',
    carBrand: 'audi',
    date: '2023-12-20',
  },
]

export const brands = [
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    nameAr: 'مرسيدس-بنز',
    color: '#000000',
    logoFile: 'mercedes.svg',
    models: ['G-Wagon', 'S-Class', 'E-Class', 'AMG GT'],
    heritage: 'Since 1926, the pinnacle of German luxury and innovation.',
    heritageAr: 'منذ عام ١٩٢٦، قمة الفخامة والابتكار الألماني.'
  },
  {
    id: 'bmw',
    name: 'BMW',
    nameAr: 'بي إم دبليو',
    color: '#0066B1',
    logoFile: 'bmw.svg',
    models: ['M4', 'X5', '7 Series', 'M8'],
    heritage: 'The ultimate driving machine, engineered in Munich.',
    heritageAr: 'آلة القيادة القصوى، صُممت في ميونيخ.'
  },
  {
    id: 'audi',
    name: 'Audi',
    nameAr: 'أودي',
    color: '#BB0A30',
    logoFile: 'audi.svg',
    models: ['R8', 'RS6', 'Q8', 'A8'],
    heritage: 'Vorsprung durch Technik - Progress through technology.',
    heritageAr: 'التقدم عبر التكنولوجيا - شعار أودي الشهير.'
  },
  {
    id: 'porsche',
    name: 'Porsche',
    nameAr: 'بورشه',
    color: '#D5001C',
    logoFile: 'porsche.svg',
    models: ['911', 'Taycan', 'Cayenne', 'Panamera'],
    heritage: 'Precision sports cars with an uncompromised racing pedigree.',
    heritageAr: 'سيارات رياضية دقيقة مع تاريخ عرق لا يضاهى.'
  },
  {
    id: 'rangerover',
    name: 'Range Rover',
    nameAr: 'رينج روفر',
    color: '#005A2B',
    logoFile: 'rangerover.svg',
    models: ['Vogue', 'Sport', 'Velar', 'Defender'],
    heritage: 'British luxury matched with peerless off-road capability.',
    heritageAr: 'الفخامة البريطانية المقرونة بقدرات لا تضاهى على الطرق الوعرة.'
  },
  {
    id: 'bentley',
    name: 'Bentley',
    nameAr: 'بنتلي',
    color: '#004225',
    logoFile: 'bentley.svg',
    models: ['Continental GT', 'Bentayga', 'Flying Spur'],
    heritage: 'A fusion of handcrafted luxury and exhilarating performance.',
    heritageAr: 'مزيج من الفخامة المصنوعة يدوياً والأداء المذهل.'
  },
  {
    id: 'byd',
    name: 'BYD',
    nameAr: 'بي وای دي',
    color: '#E62329',
    logoFile: 'BYD.svg',
    models: ['Han', 'Tang', 'Song Plus', 'Seal'],
    heritage: 'China\'s leading electric vehicle pioneer, redefining sustainable mobility.',
    heritageAr: 'رائد السيارات الكهربائية في الصين، يُعيد تعريف التنقل المستدام.'
  },
  {
    id: 'bugatti',
    name: 'Bugatti',
    nameAr: 'بوغاتي',
    color: '#1A1A2E',
    logoFile: 'Bugatti.svg',
    models: ['Chiron', 'Veyron', 'Divo', 'Bolide'],
    heritage: 'French-Italian hypercar mastery with over a century of racing heritage.',
    heritageAr: 'إتقان السيارات الفائقة الفرنسية الإيطالية مع أكثر من قرن من تاريخ السباقات.'
  },
  {
    id: 'buick',
    name: 'Buick',
    nameAr: 'بيوك',
    color: '#1B3A5C',
    logoFile: 'Buick.svg',
    models: ['Enclave', 'Encore', 'Envision', 'LaCrosse'],
    heritage: 'American luxury with a legacy of innovation dating back to 1903.',
    heritageAr: 'الفخامة الأمريكية مع إرث من الابتكار يعود إلى عام 1903.'
  },
  {
    id: 'cadillac',
    name: 'Cadillac',
    nameAr: 'كادلاك',
    color: '#1C1C1E',
    logoFile: 'Cadillac.svg',
    models: ['Escalade', 'CT5', 'CT4', 'XT6'],
    heritage: 'The standard of American luxury since 1902, engineering excellence redefined.',
    heritageAr: 'معيار الفخامة الأمريكية منذ عام 1902، إعادة تعريف التفوق الهندسي.'
  },
  {
    id: 'caparo',
    name: 'Caparo',
    nameAr: 'كابارو',
    color: '#C41E1E',
    logoFile: 'Caparo.svg',
    models: ['T1', 'Raptor', 'Evora'],
    heritage: 'British supercar engineering pushed to the absolute limit of performance.',
    heritageAr: 'الهندسة البريطانية للسيارات الفائقة مدفوعة إلى حد الأداء المطلق.'
  },
  {
    id: 'carlsson',
    name: 'Carlsson',
    nameAr: 'كارلسون',
    color: '#2E2E2E',
    logoFile: 'Carlsson.svg',
    models: ['CLS 63 RS', 'GLS 600', 'G 63 AMG', 'C 63 RS'],
    heritage: 'German tuning excellence — transforming Mercedes into extraordinary performance machines.',
    heritageAr: 'التفوق الألماني في التنظيم — تحويل مرسيدس إلى آلات أداء استثنائية.'
  },
  {
    id: 'caterham',
    name: 'Caterham',
    nameAr: 'كاترهام',
    color: '#D4A017',
    logoFile: 'Caterham.svg',
    models: ['Seven 170', 'Seven 310', 'Seven 620', 'SuperSport'],
    heritage: 'The purest driving experience — lightweight British sports cars since 1973.',
    heritageAr: 'أنقى تجربة قيادة — سيارات رياضية بريطانية خفيفة الوزن منذ 1973.'
  }
]

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What brands do you specialize in?',
    questionAr: 'ما هي الماركات التي تتخصصون بها؟',
    answer: 'We specialize in European luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and Bentley. Our technicians are factory-trained and use OEM parts.',
    answerAr: 'نحن متخصصون في السيارات الفاخرة الأوروبية بما في ذلك مرسيدس-بنز وبي إم دبليو وأودي وبورشه ورينج روفر وبنتلي. فنيونا مدربون من المصنع ويستخدمون قطع غيار أصلية.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Do you provide pickup and delivery service?',
    questionAr: 'هل توفرون خدمة الاستلام والتوصيل؟',
    answer: 'Yes, we offer complimentary pickup and delivery service within Abu Dhabi for Gold and Platinum loyalty members. Other customers can avail this service for a nominal fee.',
    answerAr: 'نعم، نقدم خدمة استلام وتوصيل مجانية داخل أبوظبي لأعضاء الولاء الذهبي والبلاتيني. يمكن للعملاء الآخرين الاستفادة من هذه الخدمة مقابل رسوم رمزية.',
    category: 'services',
  },
  {
    id: '3',
    question: 'How long does PPF installation take?',
    questionAr: 'كم يستغرق تركيب فيلم حماية الطلاء؟',
    answer: 'Full vehicle PPF installation typically takes 2-3 days. Partial coverage (front bumper, hood, fenders) can be completed in 1 day. We use only premium Xpel films.',
    answerAr: 'عادة ما يستغرق تركيب فيلم حماية الطلاء للسيارة بالكامل 2-3 أيام. يمكن إكمال التغطية الجزئية (المصد الأمامي، غطاء المحرك، الرفارف) في يوم واحد. نستخدم فقط أفلام Xpel الممتازة.',
    category: 'ppf',
  },
  {
    id: '4',
    question: 'What warranty do you offer on ceramic coating?',
    questionAr: 'ما هو الضمان الذي تقدمونه على طلاء السيراميك؟',
    answer: 'Our Gtechniq ceramic coating comes with up to 9 years warranty depending on the package selected. We are certified Gtechniq installers.',
    answerAr: 'يأتي طلاء السيراميك Gtechniq الخاص بنا بضمان يصل إلى 9 سنوات حسب الباقة المختارة. نحن معتمدون لتركيب Gtechniq.',
    category: 'ceramic',
  },
  {
    id: '5',
    question: 'Do you offer financing options?',
    questionAr: 'هل تقدمون خيارات تمويل؟',
    answer: 'Yes, we partner with Tabby for buy-now-pay-later options, allowing you to split payments into 4 interest-free installments.',
    answerAr: 'نعم، نتشارك مع Tabby لخيارات الشراء الآن والدفع لاحقًا، مما يتيح لك تقسيم المدفوعات إلى 4 أقساط بدون فوائد.',
    category: 'payment',
  },
  {
    id: '6',
    question: 'What are your operating hours?',
    questionAr: 'ما هي ساعات العمل لديكم؟',
    answer: 'We are open Monday to Saturday, 8:00 AM to 7:00 PM. Closed on Sundays. Emergency towing is available 24/7.',
    answerAr: 'نحن مفتوحون من الاثنين إلى السبت، من 8:00 صباحًا إلى 7:00 مساءً. مغلق يوم الأحد. خدمة السحب الطارئة متاحة على مدار الساعة.',
    category: 'general',
  },
]

export const stats = [
  { value: '20+', label: 'Years Experience', labelAr: 'سنوات الخبرة' },
  { value: '50,000+', label: 'Cars Serviced', labelAr: 'سيارة تم صيانتها' },
  { value: '4.5', label: 'Star Rating', labelAr: 'تقييم النجوم' },
  { value: '98%', label: 'Customer Satisfaction', labelAr: 'رضا العملاء' },
]

export const availableTimeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
]
