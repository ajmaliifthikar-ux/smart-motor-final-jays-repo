# Seed Data Preview — What Gets Written to Firestore

> Database: `smartmotordb` (named Firestore database)
> Trigger: `GET /api/dev/seed?key=sm-seed-2026`

---

## 🔧 SERVICES COLLECTION (9 documents)

Each service document is written to `services/{auto-id}` with these fields.

---

### 1 — Engine Diagnostic
| Field | Value |
|-------|-------|
| `slug` | `engine-diagnostic` |
| `name` | Engine Diagnostic |
| `nameAr` | تشخيص المحرك |
| `category` | `mechanical` |
| `basePrice` | AED 250 |
| `duration` | 1–2 hours |
| `icon` | `wrench` |
| `description` | Advanced computer diagnostics for engine health and performance |
| `active` | `true` |

---

### 2 — Transmission Service
| Field | Value |
|-------|-------|
| `slug` | `transmission-service` |
| `name` | Transmission Service |
| `nameAr` | صيانة ناقل الحركة |
| `category` | `mechanical` |
| `basePrice` | AED 450 |
| `duration` | 2–4 hours |
| `icon` | `gear` |
| `description` | Complete transmission maintenance and repairs for all drivetrain types |
| `active` | `true` |

---

### 3 — Brake Service
| Field | Value |
|-------|-------|
| `slug` | `brake-service` |
| `name` | Brake Service |
| `nameAr` | صيانة الفرامل |
| `category` | `mechanical` |
| `basePrice` | AED 300 |
| `duration` | 1–3 hours |
| `icon` | `shield` |
| `description` | Complete brake system maintenance and high-performance upgrades |
| `active` | `true` |

---

### 4 — Ceramic Coating
| Field | Value |
|-------|-------|
| `slug` | `ceramic-coating` |
| `name` | Ceramic Coating |
| `nameAr` | طلاء السيراميك |
| `category` | `ceramic` |
| `basePrice` | AED 1,500 |
| `duration` | 1–2 days |
| `icon` | `shield` |
| `description` | Premium nano-ceramic protection for paint and glass surfaces |
| `active` | `true` |

---

### 5 — Paint Protection Film (PPF)
| Field | Value |
|-------|-------|
| `slug` | `paint-protection-film` |
| `name` | Paint Protection Film (PPF) |
| `nameAr` | فيلم حماية الطلاء |
| `category` | `ppf` |
| `basePrice` | AED 2,000 |
| `duration` | 1–3 days |
| `icon` | `shield` |
| `description` | Invisible protection against stone chips, scratches, and road hazards |
| `active` | `true` |

---

### 6 — Window Tinting
| Field | Value |
|-------|-------|
| `slug` | `window-tinting` |
| `name` | Window Tinting |
| `nameAr` | تظليل النوافذ |
| `category` | `tinting` |
| `basePrice` | AED 600 |
| `duration` | 2–4 hours |
| `icon` | `sun` |
| `description` | Professional window tinting for UV protection and privacy |
| `active` | `true` |

---

### 7 — Professional Detailing
| Field | Value |
|-------|-------|
| `slug` | `detailing` |
| `name` | Professional Detailing |
| `nameAr` | التفصيل الاحترافي |
| `category` | `detailing` |
| `basePrice` | AED 800 |
| `duration` | 4–8 hours |
| `icon` | `sparkles` |
| `description` | Complete interior and exterior detailing for showroom-quality finish |
| `active` | `true` |

---

### 8 — Suspension Service
| Field | Value |
|-------|-------|
| `slug` | `suspension-service` |
| `name` | Suspension Service |
| `nameAr` | صيانة التعليق |
| `category` | `mechanical` |
| `basePrice` | AED 500 |
| `duration` | 2–4 hours |
| `icon` | `wind` |
| `description` | Advanced suspension maintenance and performance upgrades |
| `active` | `true` |

---

### 9 — Air Conditioning Service
| Field | Value |
|-------|-------|
| `slug` | `air-conditioning` |
| `name` | Air Conditioning Service |
| `nameAr` | صيانة تكييف الهواء |
| `category` | `mechanical` |
| `basePrice` | AED 400 |
| `duration` | 1–2 hours |
| `icon` | `wind` |
| `description` | Complete AC system maintenance and refrigerant service |
| `active` | `true` |

---

## 🚗 BRANDS COLLECTION (17 documents)

Each brand document is written to `brands/{auto-id}`.
**All brands get `serviceIds` = all 9 service slugs listed above.**

| # | `name` | `nameAr` | `slug` | `logoUrl` (from `/public/brands-carousel/`) | `description` (models) |
|---|--------|----------|--------|---------------------------------------------|------------------------|
| 1 | Mercedes-Benz | مرسيدس بنز | `mercedes-benz` | `mercedes-logo.png` | S-Class, E-Class, C-Class, GLE, AMG series |
| 2 | BMW | بي ام دبليو | `bmw` | `bmw-logo.png` | 7-Series, 5-Series, 3-Series, X7, M-Performance |
| 3 | Audi | أودي | `audi` | `audi-logo-150x150-1.png` | A8, A7, A6, Q7, RS series |
| 4 | Porsche | بورشه | `porsche` | `porsche-logo.png` | 911, Panamera, Cayenne, Taycan |
| 5 | Range Rover | رينج روفر | `range-rover` | `range-rover-logo.png` | Range Rover, Sport, Evoque, Discovery |
| 6 | Bentley | بنتلي | `bentley` | `bentley-logo-150x150-1.png` | Continental GT, Flying Spur, Bentayga |
| 7 | Lamborghini | لامبورجيني | `lamborghini` | `lamborghini-logo.png` | Aventador, Huracán, Urus |
| 8 | Bugatti | بوغاتي | `bugatti` | `Bugatti-logo.png` | Chiron, Divo |
| 9 | Rolls-Royce | رولز رويس | `rolls-royce` | `rolls-royce-logo.png` | Phantom, Ghost, Wraith, Dawn |
| 10 | Ferrari | فيراري | `ferrari` | `ferrari-logo.png` | F8 Tributo, Roma, SF90, Daytona SP3 |
| 11 | Alfa Romeo | ألفا روميو | `alfa-romeo` | `alfa-romeo-logo.png` | Giulia, Stelvio, 4C |
| 12 | Aston Martin | استون مارتن | `aston-martin` | `aston-martin-logo.png` | Vantage, DBX, DB11 |
| 13 | Cadillac | كاديلاك | `cadillac` | `cadillac.png` | Escalade, CT5, Lyriq |
| 14 | Chevrolet | شيفروليه | `chevrolet` | `chevrolet.png` | Corvette, Silverado, Equinox |
| 15 | Dodge | دودج | `dodge` | `dodge-logo.png` | Charger, Challenger, Ram |
| 16 | Ford | فورد | `ford` | `ford-logo.png` | Mustang, F-150, Ranger |
| 17 | Genesis | جينيسيس | `genesis` | `genesis-logo.png` | G70, G80, GV70 |

---

## 🔗 SERVICE IDs ATTACHED TO EVERY BRAND

```json
"serviceIds": [
  "engine-diagnostic",
  "transmission-service",
  "brake-service",
  "ceramic-coating",
  "paint-protection-film",
  "window-tinting",
  "detailing",
  "suspension-service",
  "air-conditioning"
]
```

This means every brand page (`/brand/mercedes-benz`, `/brand/ferrari`, etc.) will display all 9 services as clickable cards.

---

## ▶️ How to Trigger the Seed

Hit this URL once in your browser or with curl:

```
https://smartmotorlatest.vercel.app/api/dev/seed?key=sm-seed-2026
```

**Expected response:**
```json
{
  "success": true,
  "results": [
    "✅ Service: Engine Diagnostic",
    "✅ Service: Transmission Service",
    "✅ Service: Brake Service",
    "✅ Service: Ceramic Coating",
    "✅ Service: Paint Protection Film (PPF)",
    "✅ Service: Window Tinting",
    "✅ Service: Professional Detailing",
    "✅ Service: Suspension Service",
    "✅ Service: Air Conditioning Service",
    "✅ Brand: Mercedes-Benz",
    "✅ Brand: BMW",
    "✅ Brand: Audi",
    "✅ Brand: Porsche",
    "✅ Brand: Range Rover",
    "✅ Brand: Bentley",
    "✅ Brand: Lamborghini",
    "✅ Brand: Bugatti",
    "✅ Brand: Rolls-Royce",
    "✅ Brand: Ferrari",
    "✅ Brand: Alfa Romeo",
    "✅ Brand: Aston Martin",
    "✅ Brand: Cadillac",
    "✅ Brand: Chevrolet",
    "✅ Brand: Dodge",
    "✅ Brand: Ford",
    "✅ Brand: Genesis"
  ]
}
```

If already seeded, it skips and returns `⏭ already seeded` messages.

---

## ✅ What you'll see after seeding

| Page | What appears |
|------|-------------|
| `/brand/mercedes-benz` | 9 service cards with descriptions + links |
| `/brand/ferrari` | 9 service cards |
| Booking form → Step 2 | All 17 brand logos, brand name on hover |
| Booking form → Step 3 | All 9 services listed |
| `/services` | All 9 services in the catalog grid |

---

> **Note:** Prices shown are starting `basePrice` values in AED. Final pricing per job is discussed at inspection.
