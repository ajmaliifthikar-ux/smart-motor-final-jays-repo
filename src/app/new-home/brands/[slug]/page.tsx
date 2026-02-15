import { Metadata } from 'next'
import { JsonLd } from "@/components/seo/JsonLd"
import { WithContext, Service, BreadcrumbList, AutoRepair, City, Brand as SchemaBrand, ListItem } from "schema-dts"
import { BrandDetailClient } from '@/components/v2/sections/brand-detail-client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Brand } from '@/types/v2'

type Props = {
    params: Promise<{ slug: string }>
}

const CATEGORIES_MAP: Record<string, string> = {
    'german': 'German Engineering',
    'japanese': 'Japanese Reliability',
    'chinese': 'Chinese Brands',
    'american': 'American Performance',
    'european': 'European Luxury'
}

export async function generateStaticParams() {
    try {
        const brands = await prisma.brand.findMany({ select: { slug: true, id: true } })
        return brands.map(b => ({ slug: b.slug || b.id }))
    } catch {
        return []
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const brandId = params.slug

    // Try finding by slug first, then by name/id if needed, but slug is unique
    const brand = await prisma.brand.findFirst({
        where: {
            OR: [
                { slug: brandId },
                { id: brandId }
            ]
        }
    })

    if (!brand) {
        return {
            title: 'Brand Not Found',
        }
    }

    return {
        title: `${brand.name} Service & Repair | Smart Motor Abu Dhabi`,
        description: brand.description,
        openGraph: {
            title: `${brand.name} Service Specialists`,
            description: `Expert ${brand.name} maintenance and repair in Abu Dhabi. Factory-trained technicians and genuine parts.`,
            images: brand.heroImage ? [{ url: brand.heroImage }] : undefined,
        },
    }
}

export default async function BrandDetailPage(props: Props) {
    const params = await props.params
    const brandId = params.slug

    const brandData = await prisma.brand.findFirst({
        where: {
            OR: [
                { slug: brandId },
                { id: brandId }
            ]
        }
    })

    if (!brandData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Brand Not Found</h1>
                    <Link href="/new-home/brands" className="text-[#E62329] font-bold uppercase underline">All Brands</Link>
                </div>
            </div>
        )
    }

    // Map to Brand type
    const brand: Brand = {
        id: brandData.id,
        name: brandData.name,
        logo: brandData.logoUrl || '',
        description: brandData.description || '',
        heroImage: brandData.heroImage || '',
        specialties: brandData.specialties ? brandData.specialties.split(',') : [],
        models: brandData.models ? brandData.models.split(',') : [],
        services: brandData.services ? brandData.services.split(',') : [],
        // commonIssues? Not in DB yet
    }

    const categoryName = brandData.category ? CATEGORIES_MAP[brandData.category] : undefined

    const jsonLd: WithContext<Service> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${brand.name} Service & Repair`,
        description: brand.description,
        provider: {
            "@type": "AutoRepair",
            name: "Smart Motor Auto Repair",
            url: "https://smartmotor.ae"
        } as AutoRepair,
        image: brand.heroImage ? `https://smartmotor.ae${brand.heroImage}` : undefined,
        areaServed: {
            "@type": "City",
            name: "Abu Dhabi"
        } as City,
        brand: {
            "@type": "Brand",
            name: brand.name
        } as SchemaBrand
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
                name: "Brands",
                item: "https://smartmotor.ae/new-home/brands"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 3,
                name: brand.name,
                item: `https://smartmotor.ae/new-home/brands/${brand.id}` // or slug
            } as ListItem
        ]
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <BrandDetailClient brand={brand} categoryName={categoryName} />
        </>
    )
}
