import { PrismaClient } from '@prisma/client'
import { services } from '../src/lib/data'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding services...')

    for (const service of services) {
        await prisma.service.upsert({
            where: { slug: service.id }, // Assuming 'id' in data.ts maps to 'slug' in DB for uniqueness
            update: {
                name: service.name,
                nameAr: service.nameAr,
                description: service.description,
                descriptionAr: service.descriptionAr || '',
                detailedDescription: service.detailedDescription || '',
                category: service.category,
                basePrice: service.basePrice,
                duration: service.duration,
                icon: service.icon,
                image: service.image,
                process: service.process ? JSON.parse(JSON.stringify(service.process)) : undefined,
                seo: service.seo ? JSON.parse(JSON.stringify(service.seo)) : undefined,
            },
            create: {
                slug: service.id,
                name: service.name,
                nameAr: service.nameAr,
                description: service.description,
                descriptionAr: service.descriptionAr || '',
                detailedDescription: service.detailedDescription || '',
                category: service.category,
                basePrice: service.basePrice,
                duration: service.duration,
                icon: service.icon,
                image: service.image,
                process: service.process ? JSON.parse(JSON.stringify(service.process)) : undefined,
                seo: service.seo ? JSON.parse(JSON.stringify(service.seo)) : undefined,
                isEnabled: true,
            },
        })
        console.log(`Seeded: ${service.name}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
