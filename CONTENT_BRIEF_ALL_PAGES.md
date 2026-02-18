# Smart Motor — Complete Content Brief
## All Pages, All Sections, All Text + Pages Tree Map

> **Purpose:** Use this as your master content writing guide. Every section of every page is documented with its current placeholder/draft text. Replace the content in each section with your final copy, then hand back for seeding and finalising.
>
> **Brand Color:** `#E62329` (Red) · `#121212` (Near-black) · `#FAFAF9` (Off-white)
> **Design Style:** Luxury automotive — bold uppercase headings, tight tracking, minimal but premium
> **Tone:** Professional, elite, confident — not casual. Think "bespoke concierge", not "friendly garage"

---

## 🗺️ PAGES TREE MAP
### How All Pages Link Together

```
smartmotor.ae (Root → redirects to /new-home)
│
├── / (Root Homepage — same as /new-home)
│   └── → Redirects to /new-home
│
├── /new-home (Primary Homepage)
│   ├── Sections: Hero → Logo Slider → About → Services → Why Us → Packages → Booking → Testimonials → FAQ → Newsletter → Footer
│   ├── Nav → #about (About section)
│   ├── Nav → #services (Services section)
│   ├── Nav → #brands (Logo Slider section)
│   ├── Nav → #packages (Packages section)
│   ├── Nav → /new-home/smart-tips (Smart Tips page)
│   ├── Nav → #contact (Footer section)
│   ├── "Book Now" CTA → #booking (Booking Form section)
│   └── "Learn More About Us" → /about
│
├── /about (About Page)
│   ├── Sections: Hero → Core Pillars → Experience → Brand Slider → Footer
│   └── "Logo Slider" → /new-home/brands (View All Capabilities)
│
├── /contact (Contact Page)
│   ├── Sections: Hero → Contact Cards → Map → Booking Form → Footer
│   ├── Phone card → tel:+97125555443
│   ├── WhatsApp card → wa.me/97125555443
│   └── Map card → Google Maps
│
├── /services (Services Catalog — legacy, shows static data)
│   └── Each service → /new-home/services/[id]
│
├── /new-home/services/[id] (Service Detail Page — dynamic from Firebase)
│   └── Back → /services or /new-home
│
├── /new-home/brands (Brands Directory Page)
│   ├── Sections: Hero → Categories Grid → Footer
│   ├── Brand categories: German | Japanese | Chinese | American | European
│   └── Each brand card → /new-home/brands/[slug]
│
├── /new-home/brands/[slug] (Brand Detail — new-home version)
│   └── Full brand detail client component
│
├── /brand/[slug] (Brand Detail — main version, active)
│   ├── Sections: Hero → Services Grid → Models → Booking Sidebar → Footer
│   ├── Service cards → /new-home/services/[service-slug]
│   └── "Schedule Inspection" → /#booking
│
├── /new-home/smart-tips (Blog / Tips Listing Page)
│   ├── Sections: Hero → Blog Grid → Booking Form → Footer
│   └── Each post → /new-home/smart-tips/[slug]
│
├── /new-home/smart-tips/[slug] (Blog Post Detail Page)
│   └── Related posts → other /new-home/smart-tips/[slug] pages
│
├── /new-home/packages (Service Packages Page)
│   ├── Sections: Hero → Packages List → CTA → Footer
│   └── "Contact Us" CTA → #contact (Footer)
│
├── /privacy (Privacy Policy)
│   └── Standalone — links back via Footer
│
├── /terms (Terms of Service)
│   └── Standalone — links back via Footer
│
├── /faq (FAQ Page — linked from Footer, file may be placeholder)
│   └── Standalone
│
├── /careers (Careers Page — linked from Footer, file may be placeholder)
│   └── Standalone
│
└── FOOTER LINKS (appear on all pages)
    ├── Quick Links: Home | About Us | Services | FAQ | Careers | Contact
    ├── Our Services: Mechanical | Electrical | Body Shop | Paint & Protection | Ceramic Coating | Window Tinting | Detailing
    ├── Privacy Policy → /privacy
    └── Terms of Service → /terms
```

---

## 🧭 GLOBAL NAVIGATION

### Navbar
**Logo:** Smart Motor logo image (links → /new-home)

**Desktop Navigation Links:**
| Label | Destination | Type |
|-------|------------|------|
| About Us | `#about` | Anchor scroll |
| Services | `#services` | Anchor scroll |
| Brands | `#brands` | Anchor scroll |
| Packages | `#packages` | Anchor scroll |
| Smart Tips | `/new-home/smart-tips` | Page link |
| Contact | `#contact` | Anchor scroll |

**Desktop Right Actions:**
- Label: `Toll Free`
- Phone button: `80076278` → `tel:80076278`
- Tooltip: *"Call us directly for immediate assistance"*
- Book button: `Book Now` → scrolls to `#booking`

**Mobile Menu:**
- Numbered list: `01 About Us` / `02 Services` / `03 Brands` / `04 Packages` / `05 Smart Tips` / `06 Contact`
- Call block label: `Toll Free Call`
- Call block number: `800 SMART`

---

## 🦶 GLOBAL FOOTER

**Column 1 — Brand**
- Body text: *"Smart Motor Auto Repair is a professional automotive service center dedicated to delivering top-notch solutions for all your vehicle needs."*
- Social links: Instagram · WhatsApp · Facebook · TikTok · Threads

**Column 2 — Quick Links**
- Heading: `Quick Links`
- Links: Home · About Us · Services · FAQ · Careers · Contact

**Column 3 — Services**
- Heading: `Our Services`
- Links: Mechanical Services · Electrical Services · Body Shop · Paint & Protection · Ceramic Coating · Window Tinting · Detailing

**Column 4 — Contact**
- Heading: `Contact Us`
- Address: `M9, Musaffah Industrial Area, Abu Dhabi, UAE`
  - Tooltip: *"Visit us in Musaffah"*
- Phone: `+971 2 555 5443`
  - Tooltip: *"Call us now"*
- Hours: `Daily: 08:00 AM - 07:00 PM`
  - Tooltip: *"Working hours"*

**Bottom Bar:**
- Copyright: `© 2026 SMART MOTOR AUTO REPAIR.`
- Payment icons: Visa · Mastercard · Apple Pay
- Legal links: Privacy Policy · Terms of Service
- Disclaimer: *"This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."*

---

---

# PAGE-BY-PAGE CONTENT BREAKDOWN

---

## PAGE 1: HOMEPAGE (`/new-home`)

> The main landing page. Contains 10 sections in this order:
> Hero → Logo Slider → About → Services → Why Us → Packages → Booking Form → Testimonials → FAQ → Newsletter → Footer

---

### SECTION 1.1 — HERO

**Badge text:**
> `Smart Choices Start Here`

**Headline Line 1:**
> `PROFESSIONAL AUTOMOTIVE`

**Headline Line 2 (large, silver shine effect):**
> `SERVICE CENTER`

**Subheading / Description:**
> *"Your trusted automotive partner in Abu Dhabi. Expert Repair, Diagnostics & Maintenance for Luxury, Sports & European Cars."*

**CTA Button 1 (primary, dark):**
> `Book Appointment` → scrolls to `#booking`

**CTA Button 2 (secondary, outlined):**
> `Call: 02 555 5443` → opens callback modal

**Stats Row (3 items with tooltips):**
| Stat Value | Stat Label | Tooltip |
|-----------|-----------|---------|
| `15+` | `Years Exp` | *"Serving Abu Dhabi since 2009"* |
| `1k+` | `Happy Customers` | *"Trusted by 1000+ vehicle owners"* |
| `50+` | `Brand Specialists` | *"Expert technicians across all brands"* |

**Scroll indicator:**
> `Scroll`

**Background:** Full-width hero vehicle image with white gradient overlay (left fade)

---

### SECTION 1.2 — BRAND LOGO SLIDER

**Section Badge:**
> `Elite Performance`

**Heading:**
> `Trusted by` **`Leading Brands`** *(silver shine)*

**Center brand tooltip:**
> `View [Brand Name] services`

**View all link:**
> `View All Capabilities →` → `/new-home/brands`

**Brands displayed (from Firebase, 17 brands):**
Mercedes-Benz · BMW · Audi · Porsche · Range Rover · Bentley · Lamborghini · Bugatti · Rolls-Royce · Ferrari · Alfa Romeo · Aston Martin · Cadillac · Chevrolet · Dodge · Ford · Genesis

*(Auto-scrolls every 3 seconds, pauses on hover)*

---

### SECTION 1.3 — ABOUT SNIPPET

**Badge:**
> `Who We Are`

**Heading:**
> `Your Trusted` / `Automotive Partner` / *`In Abu Dhabi`* *(gray)*

**Paragraph 1:**
> *"Smart Motor Auto Repair is a professional automotive service center dedicated to delivering top-notch solutions for all your vehicle needs. Located in the heart of Musaffah (M9), we specialize in luxury, sports, and European vehicles with expertise across German, Japanese, and Chinese brands."*

**Paragraph 2:**
> *"Whether you need routine maintenance, complex repairs, body shop services, or premium detailing, we are your one-stop solution for complete automotive care."*

**CTA link:**
> `Learn More About Us →` → `/about`

**Stats Grid (4 cards, right side):**
| Value | Label |
|-------|-------|
| `15+` | `Years Experience` |
| `1k+` | `Happy Customers` |
| `50+` | `Brand Specialists` |
| `7-Day` | `Service Guarantee` |

*(Cards flip to dark background on hover)*

---

### SECTION 1.4 — SERVICES GRID

**Badge:**
> `COMPREHENSIVE AUTOMOTIVE SOLUTIONS`

**Heading Line 1:**
> `UNDER ONE`

**Heading Line 2 (silver shine):**
> `ROOF`

**CTA Button (top right of section):**
> `View Full Schedule` → scrolls to `#booking`

**Service Cards (dynamic from Firebase — 9 services):**

Each card shows on dark background with background image:
- Duration badge (e.g. `1-2 hours`)
- Service name (large, italic, uppercase)
- Description (appears on hover)
- `Learn More →` button

**Current Services in Database:**

| # | Name | Description | Category | Price | Duration |
|---|------|-------------|----------|-------|---------|
| 1 | Engine Diagnostic | Advanced computer diagnostics for engine health and performance | Mechanical | AED 250 | 1-2 hours |
| 2 | Transmission Service | Complete transmission maintenance and repairs for all drivetrain types | Mechanical | AED 450 | 2-4 hours |
| 3 | Brake Service | Complete brake system maintenance and high-performance upgrades | Mechanical | AED 300 | 1-3 hours |
| 4 | Ceramic Coating | Premium nano-ceramic protection for paint and glass surfaces | Ceramic | AED 1,500 | 1-2 days |
| 5 | Paint Protection Film (PPF) | Invisible protection against stone chips, scratches, and road hazards | PPF | AED 2,000 | 1-3 days |
| 6 | Window Tinting | Professional window tinting for UV protection and privacy | Tinting | AED 600 | 2-4 hours |
| 7 | Professional Detailing | Complete interior and exterior detailing for showroom-quality finish | Detailing | AED 800 | 4-8 hours |
| 8 | Suspension Service | Advanced suspension maintenance and performance upgrades | Mechanical | AED 500 | 2-4 hours |
| 9 | Air Conditioning Service | Complete AC system maintenance and refrigerant service | Mechanical | AED 400 | 1-2 hours |

> **Note:** All prices shown are `basePrice` starting values in AED. Final pricing discussed at inspection.

---

### SECTION 1.5 — WHY SMART MOTOR

**Badge:**
> `Why Smart Motor?`

**Heading:**
> `The Smart` **`Definition`** *(silver shine)*

**Feature List (7 items with checkmark icons):**

| Title | Description |
|-------|-------------|
| Factory-Quality Standards | We maintain manufacturer specifications for all repairs. |
| State-of-the-Art Equipment | Advanced diagnostic tools and modern repair equipment. |
| Certified Technicians | Trained specialists with years of hands-on experience. |
| Transparent Pricing | No hidden charges - detailed estimates before work begins. |
| Comprehensive Services | From mechanical repairs to body shop to detailing. |
| Competitive Packages | Cost-effective service packages and promotional offers. |
| Convenient Location | Central Musaffah location with easy access from Abu Dhabi. |

**Image Grid (4 images, left side — captions appear on hover):**
- `Advanced Diagnostics`
- `Premium Lounge`
- `Expert Team`
- `Genuine Parts`

---

### SECTION 1.6 — SERVICE PACKAGES

**Badge:**
> `Exclusive Offers`

**Heading:**
> `Cost-Effective` **`Packages`** *(silver shine)*

**Package Cards (dynamic from Firebase — currently empty, needs seeding):**

Each card displays:
- Badge: `Best Value` (light card) or `Limited Time` (dark card, animated pulse)
- Package title (large)
- Subtitle in red
- Feature list (bullet points)
- CTA Button: `Get Quote` (light card) or `Claim Offer` (dark card)

> **⚠️ Note:** Packages collection is currently empty in Firebase. Needs to be seeded with package data before this section will display content.

---

### SECTION 1.7 — BOOKING FORM

**Section Badge:**
> `Seamless Performance`

**Heading:**
> `BOOK YOUR SERVICE`

**Step Navigation (4 steps):**

**Step 1 — Details**
- Step label: `Details`
- Field 1: Label `Owner Name` · Placeholder `Enter your full name`
- Field 2: Label `Contact Number` · Placeholder `+971 50 000 0000`
- Field 3: Label `Email Address` · Placeholder `your@email.com`
- Privacy note: *"Your contact details are encrypted and used only for service updates via WhatsApp and Email. No spam, just elite service."*
- Proceed button: `Proceed to Vehicle`

**Step 2 — Vehicle**
- Step label: `Vehicle`
- Label 1: `01 Select Brand` · Search placeholder: `Search...`
- Label 2: `02 Select Model` · Filter placeholder: `Filter Models...`
- Fallback text: `Choose a Brand First`
- Brand tiles: show logo with brand name tooltip on hover (17 brands)
- Trust logos at bottom: Porsche · BMW · Mercedes · Audi · Land Rover
- Proceed button: `Proceed to Service`

**Step 3 — Service**
- Step label: `Service`
- Service cards show: name, description, duration
- `Learn More` link on each card
- Proceed button: `Proceed to Schedule`

**Step 4 — Schedule**
- Step label: `Schedule`
- Calendar label: `Appointment` · Sub-label: `Select Date`
- Time label: `Arrival Time` · Sub-label: `Choose Slot`
- Notes field: Label `Service Requirements / Notes` · Placeholder: `Any specific noise, issue, or request we should prepare for?`
- Status text: `Waiting for date...`
- No slots text: `Full Capacity / No Slots`
- Final CTA: `Confirm Booking`

**Success Screen (shown after booking):**
- Heading: `Success!`
- Message: *"Your engine is starting! We've received your booking request and our team will contact you shortly to confirm the details."*
- Reset button: `Book Another Service`

**Error States:**
- Connectivity issue: *"Connectivity issue. Please refresh the page."*
- Field validation errors per field

---

### SECTION 1.8 — TESTIMONIALS

**Badge (EN/AR):**
> `Voice of Excellence` / `أصوات التميز`

**Heading (EN/AR):**
> `TRUST THE` / `ثقة`
> **`PROFESSIONALS`** *(silver shine)* / **`المحترفين`**

**Google Reviews Card (dark, left side):**
- Icon label: `Google Reviews`
- Sub-label: `4.9/5 Elite Rating`
- Body: *"Discover why UAE's elite car owners trust Smart Motor Performance with their most valuable automotive assets."*

**Navigation buttons:**
- Tooltip 1: `Previous review`
- Tooltip 2: `Next review`

**Testimonial Cards (5 cards, stack/rotate animation):**

| # | Name | Rating | Comment | Brand Badge |
|---|------|--------|---------|-------------|
| 1 | Ahmed Al Mansouri | ★★★★★ | *"Exceptional service! They took care of my Mercedes like it was their own. The ceramic coating looks absolutely stunning."* | Mercedes Patron |
| 2 | Sarah Johnson | ★★★★★ | *"Best PPF installation in Abu Dhabi. The team is professional and the results are flawless. Highly recommended!"* | Porsche Patron |
| 3 | Mohammed Hassan | ★★★★★ | *"I've been bringing my BMW here for 5 years. Consistent quality and honest service every time."* | BMW Patron |
| 4 | Emily Chen | ★★★★ | *"Great experience with their detailing service. My Range Rover looks brand new again!"* | Range-Rover Patron |
| 5 | Khalid Al Dhaheri | ★★★★★ | *"The accident repair on my Audi was perfect. You can't even tell there was any damage. True professionals!"* | Audi Patron |

> **Note:** Testimonials are currently hardcoded in `/src/lib/data.ts`. These will need to be moved to Firebase for easy updates.

---

### SECTION 1.9 — FAQ

**Badge:**
> `Support Desk`

**Heading:**
> `Elite Knowledge`

**Body text:**
> *"Find answers to common questions about our elite services."*

**FAQ Items (currently hardcoded in `/src/lib/data.ts`):**

| # | Question | Answer |
|---|---------|--------|
| 1 | What brands do you specialize in? | We specialize in European luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and Bentley. Our technicians are factory-trained and use OEM parts. |
| 2 | Do you provide pickup and delivery service? | Yes, we offer complimentary pickup and delivery service within Abu Dhabi for Gold and Platinum loyalty members. Other customers can avail this service for a nominal fee. |
| 3 | How long does PPF installation take? | Full vehicle PPF installation typically takes 2-3 days. Partial coverage (front bumper, hood, fenders) can be completed in 1 day. We use only premium Xpel films. |
| 4 | What warranty do you offer on ceramic coating? | Our Gtechniq ceramic coating comes with up to 9 years warranty depending on the package selected. We are certified Gtechniq installers. |
| 5 | Do you offer financing options? | Yes, we partner with Tabby for buy-now-pay-later options, allowing you to split payments into 4 interest-free installments. |
| 6 | What are your operating hours? | We are open Saturday to Thursday, 8:00 AM to 6:00 PM. Closed on Fridays. Emergency towing is available 24/7. |

**CTA Footer (inside FAQ section):**
- Heading: `Still Seeking Clarity?`
- Body: *"Our concierge team is here for personalized assistance."*
- CTA: `Connect at +971 2 555 5443`
- Tooltip: *"Tap to call our team directly"*

---

### SECTION 1.10 — NEWSLETTER

**Badge:**
> `Stay Connected` *(with mail icon)*

**Heading Line 1 (faded):**
> `Join the`

**Heading Line 2 (red, glowing):**
> `Elite Club`

**Description:**
> *"Get exclusive offers, maintenance tips, and early access to seasonal campaigns delivered to your inbox."*

**Form:**
- Email input placeholder: `Enter your email address`
- Submit button: `Subscribe Now`
- Disclaimer: `No spam. Unsubscribe anytime.`

**Success State (shown after subscription):**
- Heading: `Welcome to the Club!`
- Body: *"Check your inbox for a special welcome gift."*
- Button: `Done`

---

---

## PAGE 2: ABOUT PAGE (`/about`)

> Sections: Hero → Core Pillars → Experience → Brand Slider → Footer

---

### SECTION 2.1 — ABOUT HERO

**Badge:**
> `Our Engineering Story`

**Heading Line 1:**
> `PRECISION`

**Heading Line 2 (silver shine):**
> `HERITAGE`

**Description:**
> *"Since 2009, Smart Motor has been the epicenter of luxury automotive care in Abu Dhabi, blending German engineering standards with bespoke concierge service."*

---

### SECTION 2.2 — CORE PILLARS

*(Dark background section — 3 columns)*

**Pillar 1:**
- Icon: Zap (lightning)
- Heading: `Rapid Diagnostics`
- Body: *"Using factory-grade telemetry to pinpoint issues with surgical accuracy, reducing downtime for your vehicle."*

**Pillar 2:**
- Icon: Shield
- Heading: `OEM Integrity`
- Body: *"We exclusively source 100% genuine parts, ensuring your vehicle's warranty and performance remain uncompromised."*

**Pillar 3:**
- Icon: Award
- Heading: `Master Craftsmanship`
- Body: *"Our technicians are brand-certified specialists with over 15 years of experience in exotic and European engineering."*

---

### SECTION 2.3 — EXPERIENCE / CONCIERGE

**Badge:**
> `The Customer Journey`

**Heading:**
> `Bespoke` / `Concierge` / *`Service.`* *(gray)*

**Body:**
> *"At Smart Motor, we don't just repair cars; we manage your automotive lifestyle. From complimentary pickup and delivery to real-time telemetry updates, every step is designed for your convenience."*

**Stats (2 cards):**
| Value | Label |
|-------|-------|
| `15+` | `Years Experience` |
| `1K+` | `Elite Clients` |

**Image caption (overlaid on workshop photo):**
- Sub-label: `Live Operations`
- Heading: `Musaffah M9 Hub`

---

### SECTION 2.4 — BRAND SLIDER

*(Same component as homepage brand slider — see Section 1.2)*

---

---

## PAGE 3: CONTACT PAGE (`/contact`)

> Sections: Hero → Contact Cards → Map → Booking Form → Footer

---

### SECTION 3.1 — CONTACT HERO

**Badge:**
> `Get In Touch`

**Heading Line 1:**
> `DIRECT`

**Heading Line 2 (silver shine):**
> `CHANNELS`

**Description:**
> *"Connect with our engineering advisors for immediate technical assistance or bespoke service inquiries."*

---

### SECTION 3.2 — CONTACT CARDS

*(3 cards in a row)*

**Card 1 — Voice Support**
- Icon: Phone
- Heading: `Voice Support`
- Body: *"Direct line to our engineering team for rapid response."*
- Phone: `+971 2 555 5443` → `tel:+97125555443`
- Sub-line: `Toll Free: 800 SMART`

**Card 2 — Live WhatsApp**
- Icon: MessageCircle (green)
- Heading: `Live WhatsApp`
- Body: *"Send images or videos of your vehicle concerns directly."*
- CTA: `Start Conversation` → `wa.me/97125555443`

**Card 3 — Visit Workshop**
- Icon: Map Pin (dark)
- Heading: `Visit Workshop`
- Body: `M9, Musaffah Industrial Area, Abu Dhabi, UAE.`
- CTA: `Open in Maps →` → Google Maps link

---

### SECTION 3.3 — MAP / LOCATION

**Badge:**
> `Global HQ`

**Location Heading:**
> `Musaffah M9` / `Engineering Hub`

**Hours panel heading:**
> `Working Hours`

**Hours:**
| Day | Hours |
|-----|-------|
| `Mon - Sat` | `08:00 - 19:00` |
| `Sunday` | `Closed` |

---

### SECTION 3.4 — BOOKING FORM

*(Same booking form component as Homepage Section 1.7)*

---

---

## PAGE 4: SERVICES PAGE (`/services`)

> Full services catalog page — now pulls live from Firebase (same 9 seeded services). Also has its own hero section.

**Hero Section:**

**Badge:**
> `Engineering Catalog`

**Heading Line 1:**
> `MASTER`

**Heading Line 2 (silver shine):**
> `SOLUTIONS`

**Description:**
> *"Discover our comprehensive range of high-performance automotive services, precision-engineered for the world's most elite vehicles."*

**Services Grid** — same component as homepage, loads all 9 services from Firebase.

---

**Page Metadata:**
- Title: Services catalog

**Content (static from `data.ts`):**

| Service | Description | Starting Price | Duration |
|---------|-------------|---------------|---------|
| Mechanical & Electrical | Complete engine diagnostics, repairs, and electrical system maintenance for European luxury vehicles. | AED 500 | 2-4 hours |
| Bodyshop & Accident Repair | Expert body repair, panel beating, and accident damage restoration to factory standards. | AED 1,500 | 3-7 days |
| Paint Protection Film (Xpel) | Premium Xpel paint protection film installation to guard against scratches, chips, and UV damage. | AED 5,000 | 2-3 days |
| Ceramic Coating (Gtechniq) | Professional Gtechniq ceramic coating for long-lasting paint protection and stunning gloss. | AED 3,000 | 1-2 days |
| Window Tinting | High-quality window tinting for privacy, UV protection, and heat reduction. | AED 800 | 3-4 hours |
| Detailing & Polishing | Premium interior and exterior detailing to restore your vehicle to showroom condition. | AED 400 | 4-6 hours |
| Towing & Breakdown | 24/7 emergency towing and roadside assistance across Abu Dhabi. | — | 30-60 mins |

> **Note:** Service detail pages at `/services/[id]` redirect to `/new-home/services/[id]`

---

## PAGE 5: SERVICE DETAIL PAGE (`/new-home/services/[id]`)

> Dynamic page, loads data from Firebase `services` collection.

**Content comes from Firebase service document fields:**
- `name` / `nameAr` — Service title
- `description` / `descriptionAr` — Short description
- `detailedDescription` — Long-form body text
- `basePrice` — Starting price in AED
- `duration` — Estimated time
- `category` — Service category
- `image` — Hero image

**Currently seeded services (slugs):**
`engine-diagnostic` · `transmission-service` · `brake-service` · `ceramic-coating` · `paint-protection-film` · `window-tinting` · `detailing` · `suspension-service` · `air-conditioning`

---

## PAGE 6: BRANDS DIRECTORY (`/new-home/brands`)

> Shows all brands grouped by category.

**Page Metadata:**
- Title: `Car Brands We Service | Smart Motor Abu Dhabi`
- Description: `Expert repair for Mercedes, BMW, Audi, Toyota, Nissan, Chinese EVs, and American cars. Certified specialists for every brand.`

### SECTION 6.1 — BRANDS HERO

*(Dark full-bleed hero with background image)*

**Badge:**
> `Brand Expertise`

**Heading Line 1:**
> `Specialized Service`

**Heading Line 2 (gray):**
> `Across Global Brands`

**Description:**
> *"Trusted car repair services in Abu Dhabi for German, Japanese, Chinese, European, and American vehicles. Engine, transmission, AC, and electric diagnostics by certified brand specialists."*

**Category filter pills (anchor links):**
- `German` → `#german`
- `Japanese` → `#japanese`
- `Chinese` → `#chinese`

### SECTION 6.2 — BRAND CATEGORIES

*(5 categories — brands filtered from Firebase by category field)*

**Category 1:**
- Name: `German Engineering`
- Description: *"Premium service for high-performance German vehicles. Expert diagnostics and repairs for BMW, Mercedes, Audi, Porsche, and Volkswagen using manufacturer specifications."*

**Category 2:**
- Name: `Japanese Reliability`
- Description: *"Comprehensive maintenance for Japanese brands. From routine service to complex repairs, we ensure your Toyota, Nissan, Lexus, and Infiniti run perfectly."*

**Category 3:**
- Name: `Chinese Brands`
- Description: *"Specialized care for the new generation of Chinese luxury and electric vehicles. Expertise in BYD, MG, Geely, Hongqi, and more."*

**Category 4:**
- Name: `American Performance`
- Description: *"Dedicated service for American muscle and SUVs. Ford, Chevrolet, GMC, Jeep, Dodge, and Cadillac specialists."*

**Category 5:**
- Name: `European Luxury`
- Description: *"Expert care for British and Italian luxury brands including Range Rover, Jaguar, Bentley, and Rolls Royce."*

> **Note:** Brand cards within each category show logo, brand name, description, and 3 specialty tags. Currently brands don't have `category` field set, so categories show empty. This needs to be seeded.

---

## PAGE 7: BRAND DETAIL PAGE (`/brand/[slug]`)

> Dynamic page. Fetches brand + services from Firebase.

---

### SECTION 7.1 — BRAND HERO

*(Dark black hero with red glow)*

**Badge:**
> `Specialized Heritage`

**Heading:**
> `[Brand Name]` / **`Certified`** *(silver shine)*

**Description:**
> `[brand.description]` — pulled from Firebase (currently contains comma-separated model names)

*e.g. for Mercedes-Benz: "German luxury vehicles with precision engineering. Models: S-Class, E-Class, C-Class, GLE, AMG series."*

---

### SECTION 7.2 — AVAILABLE SERVICES

**Label:**
> `Available Services`

*(Grid of service cards — 2 columns)*

Each service card:
- Service name (uppercase, bold)
- Service description (truncated)
- `Learn More →` → `/new-home/services/[slug]`

---

### SECTION 7.3 — ADDITIONAL SERVICES & MODELS

**Label:**
> `Additional Services & Models` *(or `Engineering Specialties` if no services)*

Each item:
- Specialty name
- Sub-label: `Expert Service`

---

### SECTION 7.4 — PERFORMANCE MODELS SERVICED

**Label:**
> `Performance Models Serviced`

Pill tags for each model (from `brand.description` field, comma-separated)

*e.g. for Mercedes-Benz: S-Class · E-Class · C-Class · GLE · AMG series*

---

### SECTION 7.5 — BOOKING SIDEBAR

**Booking card (dark):**
- Icon: Shield
- Heading: `Elite` / `Service`
- Body: *"Our master technicians are factory-trained specifically for [Brand Name] platforms."*
- CTA: `Schedule Inspection` → `/#booking`

**Review snippet card:**
- Label: ★ `Client Reviews`
- Quote: *"The only place in Abu Dhabi I trust with my [Model/Brand]. Precision and transparency at every step."*
- Attribution: `Verified Owner`

---

---

## PAGE 8: SMART TIPS / BLOG (`/new-home/smart-tips`)

> Dynamic blog listing page. Posts come from Firebase `content` collection.

**Page Metadata:**
- Title: `Car Maintenance Tips & News | Smart Motor Abu Dhabi`
- Description: `Expert advice on car repair, maintenance, and diagnostics from Smart Motor Abu Dhabi. Stay informed with our latest automotive insights.`

### SECTION 8.1 — SMART TIPS HERO

*(Dark full-bleed hero, left-aligned text)*

**Badge:**
> `Expert Advice`

**Heading Line 1:**
> `Smart`

**Heading Line 2 (silver shine):**
> `Tips`

**Description:**
> *"Latest automotive insights, maintenance guides, and expert advice from Abu Dhabi's premier auto repair specialists."*

### SECTION 8.2 — BLOG GRID

*(Dynamic — loads all published BLOG content from Firebase)*

**Post card fields used:**
- `title` — Post title
- `excerpt` — Short preview
- `image` — Cover image (fallback: `/bg-placeholder.jpg`)
- `date` — Published date
- `category` — Category tag (default: `Automotive`)
- `author` — Author name (default: `Smart Motor Team`)
- `slug` — Used for URL: `/new-home/smart-tips/[slug]`

---

## PAGE 9: BLOG POST DETAIL (`/new-home/smart-tips/[slug]`)

> Dynamic post detail page.

**Content fields:**
- `title` — Large heading
- `content` — Full article body
- `image` — Hero image
- `author` — Author attribution
- `date` — Published date
- `category` — Category label
- Related posts section

---

## PAGE 10: PACKAGES PAGE (`/new-home/packages`)

> Service packages listing.

**Page Metadata:**
- Title: `Value Service Packages | Smart Motor Abu Dhabi`
- Description: `Exclusive auto service packages for Mercedes, BMW, Audi, and more. Transparent pricing and premium care in Musaffah.`

---

### SECTION 10.1 — PACKAGES HERO

**Heading:**
> `Exclusive` **`Offers`** *(red)*

**Description:**
> *"Premium service packages designed to save you money while maintaining your vehicle's peak performance."*

---

### SECTION 10.2 — PACKAGES LIST

*(Dynamic from Firebase `packages` collection — currently empty, needs seeding)*

**Package card structure:**
- Badge: `Best Value` or `Limited Time`
- Package title
- Subtitle (in red)
- Features list (bullet points)
- CTA: `Get Quote` or `Claim Offer`

---

### SECTION 10.3 — CUSTOM PACKAGE CTA

*(Red background section)*

**Heading:**
> `Need a Custom Package?`

**Body:**
> *"We understand every driver is unique. Contact us to create a service plan tailored to your specific vehicle and driving habits."*

**CTA Button:**
> `Contact Us` → `#contact`

---

---

## PAGE 11: PRIVACY POLICY (`/privacy`)

**Badge:**
> `Legal Standards`

**Heading Line 1:**
> `PRIVACY`

**Heading Line 2 (silver shine):**
> `PROTOCOL`

---

**01. Data Collection**
> *"We collect only the essential information required to provide elite automotive services, including vehicle telemetry, contact details for service updates, and diagnostic history."*

**02. Encryption & Security**
> *"All client data is encrypted using military-grade protocols. We maintain a "Privacy First" engineering standard, ensuring your vehicle's history and your personal details are never shared with third-party marketers."*

**03. Telemetry Usage**
> *"Vehicle diagnostic data is used exclusively to optimize your service journey and provide predictive maintenance alerts via our AI Specialist system."*

**Footer note:**
> `Last Updated: February 2026`

---

## PAGE 12: TERMS OF SERVICE (`/terms`)

**Badge:**
> `Service Agreement`

**Heading Line 1:**
> `TERMS OF`

**Heading Line 2 (silver shine):**
> `ENGAGEMENT`

---

**01. Service Warranty**
> *"All mechanical repairs carried out by Smart Motor technicians include a 6-month or 10,000km warranty on labor. Spare parts are subject to manufacturer-specific warranty terms."*

**02. Booking & Cancellations**
> *"Appointments can be managed via the Smart Assistant or direct channels. We request a 24-hour notice for cancellations to optimize workshop orchestration."*

**03. Genuine Parts Commitment**
> *"Smart Motor strictly uses 100% genuine OEM parts. Using non-genuine parts provided by the client may void our service warranty."*

**Footer note:**
> `Jurisdiction: Abu Dhabi, United Arab Emirates`

---

## PAGE 13: FAQ PAGE (`/faq`)

> Linked from footer. File may need to be created as a full page (currently may not exist as standalone page).

**Suggested structure (based on FAQ data in `data.ts`):**

**Badge:** `Support Desk`
**Heading:** `Elite Knowledge`

**Current FAQ Items (from `data.ts` — English & Arabic):**

1. **What brands do you specialize in?**
   We specialize in European luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and Bentley. Our technicians are factory-trained and use OEM parts.

2. **Do you provide pickup and delivery service?**
   Yes, we offer complimentary pickup and delivery service within Abu Dhabi for Gold and Platinum loyalty members. Other customers can avail this service for a nominal fee.

3. **How long does PPF installation take?**
   Full vehicle PPF installation typically takes 2-3 days. Partial coverage (front bumper, hood, fenders) can be completed in 1 day. We use only premium Xpel films.

4. **What warranty do you offer on ceramic coating?**
   Our Gtechniq ceramic coating comes with up to 9 years warranty depending on the package selected. We are certified Gtechniq installers.

5. **Do you offer financing options?**
   Yes, we partner with Tabby for buy-now-pay-later options, allowing you to split payments into 4 interest-free installments.

6. **What are your operating hours?**
   We are open Saturday to Thursday, 8:00 AM to 6:00 PM. Closed on Fridays. Emergency towing is available 24/7.

---

## PAGE 14: CAREERS PAGE (`/careers`)

> Linked from footer. File may need to be created.

**Suggested structure:**
- Badge: `Join Our Team`
- Heading: `DRIVEN BY` / `EXCELLENCE`
- Body: Introduction to working at Smart Motor
- Open positions section (dynamic or placeholder)
- Application CTA

---

---

# 📝 CONTENT WRITING CHECKLIST

Use this to track your progress writing final copy:

## Homepage (`/new-home`)
- [ ] Hero badge text
- [ ] Hero headline (2 lines)
- [ ] Hero subheading / description
- [ ] Hero CTA button labels
- [ ] Stats row (values + labels + tooltips)
- [ ] Brand slider heading
- [ ] About snippet badge + heading
- [ ] About snippet paragraph 1
- [ ] About snippet paragraph 2
- [ ] About stats (4 values + labels)
- [ ] Services section badge + heading
- [ ] Service names + descriptions (9 services — for Firebase seeding)
- [ ] Service detailed descriptions (for service detail pages)
- [ ] Why Smart Motor heading
- [ ] Why Smart Motor 7 feature titles + descriptions
- [ ] Service packages (need package names, subtitles, features lists)
- [ ] Booking form labels + placeholders + privacy notice + success message
- [ ] Testimonials heading
- [ ] Testimonials quotes (5 reviews)
- [ ] FAQ heading + all Q&A pairs
- [ ] FAQ CTA text
- [ ] Newsletter heading + description + disclaimer

## About Page (`/about`)
- [ ] Hero badge + heading + description
- [ ] Core pillars (3 × heading + body)
- [ ] Experience section badge + heading + body
- [ ] Experience stats

## Contact Page (`/contact`)
- [ ] Hero badge + heading + description
- [ ] 3 contact card headings + body text
- [ ] Map location name + working hours

## Brands Directory (`/new-home/brands`)
- [ ] Page hero (BrandsHero component)
- [ ] 5 category names + descriptions
- [ ] Brand descriptions (17 brands — for Firebase seeding)

## Brand Detail Pages (`/brand/[slug]`)
- [ ] Booking sidebar body text
- [ ] Review snippet quote

## Service Detail Pages (`/new-home/services/[id]`)
- [ ] Detailed description for each of 9 services
- [ ] Features list per service
- [ ] Process steps per service

## Smart Tips / Blog
- [ ] SmartTipsHero content
- [ ] Blog post content (all posts — for Firebase seeding)

## Packages Page
- [ ] Package titles, subtitles, features (for Firebase seeding)

## Privacy Policy
- [ ] Full privacy policy text (3 sections)

## Terms of Service
- [ ] Full terms text (3 sections)

## FAQ Page (standalone)
- [ ] All Q&A pairs (expand beyond current 6)

## Careers Page
- [ ] Full careers page content

---

# 🌐 CONTACT DETAILS REFERENCE

| Detail | Current Value |
|--------|--------------|
| **Phone** | +971 2 555 5443 |
| **Toll Free** | 800 SMART (80076278) |
| **WhatsApp** | +971 2 555 5443 (wa.me/97125555443) |
| **Address** | M9, Musaffah Industrial Area, Abu Dhabi, UAE |
| **Hours (Mon-Sat)** | 08:00 - 19:00 |
| **Sunday** | Closed |
| **Instagram** | @smartmotor_autorepair |
| **Email** | (not shown on site currently) |
| **Est. Year** | 2009 |

---

# 📊 DATABASE / SEEDING REFERENCE

## What's Currently in Firebase (`smartmotordb`)

### `services` collection — 9 documents ✅
All 9 services seeded with: slug, name, nameAr, description, descriptionAr, category, basePrice, duration, icon, image, detailedDescription, active

### `brands` collection — 17 documents ✅
17 brands seeded with: name, nameAr, slug, logoUrl, description (model list), serviceIds (all 9 slugs)

### `packages` collection — EMPTY ⚠️
Needs to be seeded with service package data

### `content` (BLOG) collection — Needs posts ⚠️
Publish posts via Admin Panel → Content → Blog

## What Needs Final Content Writing → Then Seeding

| Collection | Fields Needing Final Copy |
|-----------|--------------------------|
| `services` | `detailedDescription`, Arabic translations, feature lists |
| `brands` | `description` (proper descriptions, not just model list), Arabic translations |
| `packages` | Entire collection — title, subtitle, features, pricing |
| `content` | Blog posts (title, slug, excerpt, content, image, author) |

---

*Last Updated: February 2026*
*Project: Smart Motor — smartmotorlatest*
*Live URL: https://smartmotorlatest.vercel.app*
