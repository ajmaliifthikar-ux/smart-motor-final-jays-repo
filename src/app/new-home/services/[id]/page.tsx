import { Metadata } from 'next'
import { JsonLd } from "@/components/seo/JsonLd"
import { WithContext, Service as SchemaService, BreadcrumbList, ListItem, Offer, OfferCatalog, AutoRepair, City } from "schema-dts"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ServiceDetailClient } from '@/components/v2/sections/service-detail-client'
import { Service } from '@/types'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    try {
        const services = await prisma.service.findMany({
            select: { slug: true }
        })
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
        const service = await prisma.service.findUnique({
            where: { slug: id },
            select: { name: true, description: true, seo: true }
        })

        if (!service) return {}

        const seo = service.seo as { title: string, description: string } | null

        return {
            title: seo?.title || `${service.name} | Smart Motor Abu Dhabi`,
            description: seo?.description || service.description,
            openGraph: {
                title: seo?.title || `${service.name} | Smart Motor Abu Dhabi`,
                description: seo?.description || service.description,
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
        serviceData = await prisma.service.findUnique({
            where: { slug: serviceId }
        })
    } catch (error) {
        console.error('Database error:', error)
        // Fallback or error page
    }

    if (!serviceData) {
        return notFound()
    }

    // Cast Prisma result to Service type
    const service: Service = {
        ...serviceData,
        id: serviceData.slug,
        descriptionAr: serviceData.descriptionAr || '',
        basePrice: serviceData.basePrice || undefined,
        category: (serviceData.category as any) || 'mechanical',
        icon: serviceData.icon || 'wrench',
        process: serviceData.process as any,
        subServices: serviceData.subServices as any,
        seo: serviceData.seo as any,
        detailedDescription: serviceData.detailedDescription || undefined,
        image: serviceData.image || undefined,
        iconImage: serviceData.iconImage || undefined
    }

    const itemOffered = (service.subServices || []).map((sub): Offer => ({
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
