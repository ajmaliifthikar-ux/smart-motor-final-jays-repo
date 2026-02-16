import { Metadata } from 'next'
import { JsonLd } from "@/components/seo/JsonLd"
import { WithContext, Service as SchemaService, BreadcrumbList, ListItem, Offer, OfferCatalog, AutoRepair, City } from "schema-dts"
import { notFound } from 'next/navigation'
import { getAllServices } from '@/lib/firebase-db'
import { ServiceDetailClient } from '@/components/v2/sections/service-detail-client'
import { Service } from '@/types'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    try {
        const services = await getAllServices()
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
        const allServices = await getAllServices()
        const service = allServices.find(s => s.slug === id)

        if (!service) return {}

        return {
            title: `${service.name} | Smart Motor Abu Dhabi`,
            description: service.description,
            openGraph: {
                title: `${service.name} | Smart Motor Abu Dhabi`,
                description: service.description,
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
        const allServices = await getAllServices()
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

    const itemOffered = subServicesList.map((sub): Offer => ({
        "@type": "Offer",
        itemOffered: {
            "@type": "Service",
            name: sub.title
        } as SchemaService
    }));

    const jsonLd: WithContext<SchemaService> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
            "@type": "AutoRepair",
            name: "Smart Motor Auto Repair",
            url: "https://smartmotor.ae"
        } as AutoRepair,
        image: service.image ? `https://smartmotor.ae${service.image}` : undefined,
        areaServed: {
            "@type": "City",
            name: "Abu Dhabi"
        } as City,
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Service Features",
            itemListElement: itemOffered
        } as OfferCatalog
    };

    const breadcrumbLd: WithContext<BreadcrumbList> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://smartmotor.ae/new-home"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://smartmotor.ae/new-home#services"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: `https://smartmotor.ae/new-home/services/${service.id}`
            } as ListItem
        ]
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <ServiceDetailClient service={service} />
        </>
    )
}
