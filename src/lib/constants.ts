/**
 * Smart Motor — Single Source of Truth for Business Constants
 * All contact details, hours, and business info lives here.
 * Update this file to propagate changes across the entire site.
 */

export const BUSINESS = {
  name: 'Smart Motor Auto Repair',
  tagline: "Abu Dhabi's Premier Automotive Atelier — Est. 2009",
  established: '2009',

  // --- Contact ---
  phone: '+971 2 555 5443',
  phoneTel: '+97125555443',
  tollfree: '800 76278',
  tollfreeTel: '80076278',
  whatsapp: '+971 80 05445',
  whatsappUrl: 'https://wa.me/9718005445',
  email: 'service@smartmotor.ae',

  // --- Location ---
  address: 'M9, Musaffah Industrial Area, Abu Dhabi, UAE',
  addressStreet: 'M9, Musaffah Industrial Area',
  addressCity: 'Abu Dhabi',
  addressCountry: 'AE',
  mapsUrl: 'https://maps.google.com/?q=Smart+Motor+Auto+Repair+Musaffah+Abu+Dhabi',
  geo: {
    latitude: '24.4539',
    longitude: '54.3773',
  },

  // --- Operating Hours (AUTHORITATIVE) ---
  hours: {
    weekdays: 'Mon – Sat: 08:00 – 19:00',
    weekend: 'Sunday: Closed',
    open: '08:00',
    close: '19:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    closedDays: ['Sunday'],
    displayShort: 'Mon–Sat 08:00–19:00',
    displayFull: 'Monday to Saturday, 8:00 AM to 7:00 PM. Closed on Sundays.',
  },

  // --- Social ---
  social: {
    instagram: 'https://instagram.com/smartmotor_autorepair',
    facebook: 'https://facebook.com/smartmotorae',
    tiktok: 'https://tiktok.com/@smartmotorae',
    threads: 'https://threads.net/@smartmotor_autorepair',
  },

  // --- SEO ---
  siteUrl: 'https://smartmotor.ae',
  priceRange: '$$$',

  // --- Stats ---
  stats: {
    yearsExp: '17+',
    yearsExpLabel: 'Years Experience',
    yearsExpTooltip: 'Serving Abu Dhabi since 2009',
    clients: '1,000+',
    clientsLabel: 'Satisfied Clients',
    clientsTooltip: 'Trusted by 1000+ vehicle owners',
    technicians: '50+',
    techniciansLabel: 'Factory-Certified Technicians',
    techniciansTooltip: 'Expert technicians across all brands',
    warranty: '6-Month',
    warrantyLabel: 'Labour Warranty',
    rating: '4.9',
    ratingLabel: 'Google Rating',
    reviewCount: '127',
  },
} as const
