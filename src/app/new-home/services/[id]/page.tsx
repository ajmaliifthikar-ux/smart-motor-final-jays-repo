import { Metadata } from 'next'
import { WithContext, BreadcrumbList, ListItem, Offer } from "schema-dts"
import { notFound } from 'next/navigation'
import { adminGetAllServices } from '@/lib/firebase-admin'
import { ServiceDetailClient } from '@/components/v2/sections/service-detail-client'
import { Service } from '@/types'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    try {
        const services = await adminGetAllServices()
        return services.map((service) => ({
            id: service.slug,
        }))
    } catch (error) {
        console.error('Database connection failed during static generation:', error)
        return []
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const id = params.id
    try {
        const allServices = await adminGetAllServices()
        const service = allServices.find(s => s.slug === id)

        if (!service) return {}

        return {
            title: `${service.name} in Abu Dhabi | Smart Motor Auto Repair`,
            description: service.description || `Professional ${service.name} at Smart Motor Auto Repair, Musaffah, Abu Dhabi. Certified technicians, OEM parts, 6-month warranty.`,
            alternates: {
                canonical: `https://smartmotor.ae/services/${id}`,
                languages: {
                    'ar': `https://smartmotor.ae/ar/services/${id}`,
                    'x-default': `https://smartmotor.ae/services/${id}`,
                }
            },
            openGraph: {
                title: `${service.name} in Abu Dhabi | Smart Motor Auto Repair`,
                description: service.description,
                url: `https://smartmotor.ae/services/${id}`,
            }
        }
    } catch (error) {
        return {
            title: 'Service Not Found | Smart Motor Abu Dhabi',
        }
    }
}

export default async function ServiceDetailPage(props: Props) {
    const params = await props.params
    const serviceId = params.id

    let serviceData
    try {
        const allServices = await adminGetAllServices()
        serviceData = allServices.find(s => s.slug === serviceId)
    } catch (error) {
        console.error('Database error:', error)
        // Fallback or error page
    }

    if (!serviceData) {
        return notFound()
    }

    // Safely parse subServices (not available in Firebase)
    let subServicesList: any[] = []
    let processList: any[] = []

    // Cast Firestore result to Service type
    const service: Service = {
        ...serviceData,
        id: serviceData.slug,
        descriptionAr: serviceData.descriptionAr || '',
        basePrice: serviceData.basePrice || undefined,
        category: (serviceData.category as any) || 'mechanical',
        icon: serviceData.icon || 'wrench',
        process: processList,
        subServices: subServicesList,
        seo: undefined,
        detailedDescription: serviceData.detailedDescription || undefined,
        image: serviceData.image || undefined,
        iconImage: undefined
    }

    const itemOffered: Offer[] = subServicesList.map((sub) => ({
        "@type": "Offer",
        itemOffered: {
            "@type": "Service",
            name: sub.title
        }
    } as Offer));

    const serviceJsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `https://smartmotor.ae/services/${service.id}#service`,
        name: service.name,
        description: service.description || `Professional ${service.name} in Abu Dhabi by certified technicians.`,
        url: `https://smartmotor.ae/services/${service.id}`,
        provider: {
            "@type": "AutoRepair",
            "@id": "https://smartmotor.ae/#organization",
            name: "Smart Motor Auto Repair",
            url: "https://smartmotor.ae",
            telephone: "+97125555443",
            address: {
                "@type": "PostalAddress",
                streetAddress: "M9, Musaffah Industrial Area",
                addressLocality: "Abu Dhabi",
                addressCountry: "AE"
            }
        },
        image: service.image ? `https://smartmotor.ae${service.image}` : "https://smartmotor.ae/images/og-image.jpg",
        areaServed: [
            { "@type": "City", name: "Abu Dhabi" },
            { "@type": "City", name: "Musaffah" }
        ],
        ...(service.basePrice ? {
            offers: {
                "@type": "Offer",
                priceCurrency: "AED",
                price: service.basePrice.toString(),
                priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    priceCurrency: "AED",
                    price: service.basePrice.toString(),
                    name: `Starting price for ${service.name}`
                },
                availability: "https://schema.org/InStock",
                url: `https://smartmotor.ae/services/${service.id}`,
                seller: {
                    "@type": "AutoRepair",
                    name: "Smart Motor Auto Repair"
                }
            }
        } : {
            offers: {
                "@type": "Offer",
                priceCurrency: "AED",
                availability: "https://schema.org/InStock",
                url: `https://smartmotor.ae/services/${service.id}`,
                description: "Contact us for pricing"
            }
        }),
        ...(itemOffered.length > 0 ? {
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${service.name} Packages`,
                itemListElement: itemOffered
            }
        } : {})
    };

    const breadcrumbLd: WithContext<BreadcrumbList> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://smartmotor.ae"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://smartmotor.ae/services"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: `https://smartmotor.ae/services/${service.id}`
            } as ListItem
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <ServiceDetailClient service={service} />
        </>
    )
}
