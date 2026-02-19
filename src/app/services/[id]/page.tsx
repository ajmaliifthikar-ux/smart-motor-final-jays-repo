import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminGetAllServices } from '@/lib/firebase-admin'
import { ServiceDetailClient } from '@/components/v2/sections/service-detail-client'
import { Service } from '@/types'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
    try {
        const services = await adminGetAllServices()
        return services.map((s) => ({ id: s.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    try {
        const allServices = await adminGetAllServices()
        const service = allServices.find(s => s.slug === id)
        if (!service) return {}
        return {
            title: `${service.name} in Abu Dhabi | Smart Motor Auto Repair`,
            description: service.description || `Professional ${service.name} at Smart Motor, Musaffah Abu Dhabi. Certified technicians, OEM parts, 12-month warranty.`,
            alternates: { canonical: `https://smartmotor.ae/services/${id}` },
            openGraph: {
                title: `${service.name} | Smart Motor Abu Dhabi`,
                description: service.description,
                url: `https://smartmotor.ae/services/${id}`,
            },
        }
    } catch {
        return { title: 'Service | Smart Motor Abu Dhabi' }
    }
}

export default async function ServiceDetailPage({ params }: Props) {
    const { id } = await params
    let serviceData: any
    try {
        const allServices = await adminGetAllServices()
        serviceData = allServices.find((s: any) => s.slug === id)
    } catch (error) {
        console.error('DB error on service page:', error)
    }
    if (!serviceData) notFound()

    const service: Service = {
        ...serviceData,
        id: serviceData.slug,
        descriptionAr: serviceData.descriptionAr || '',
        basePrice: serviceData.basePrice || undefined,
        category: serviceData.category || 'mechanical',
        icon: serviceData.icon || 'wrench',
        process: [],
        subServices: [],
        seo: undefined,
        detailedDescription: serviceData.detailedDescription || undefined,
        image: serviceData.image || undefined,
        iconImage: undefined,
    }

    return <ServiceDetailClient service={service} />
}
