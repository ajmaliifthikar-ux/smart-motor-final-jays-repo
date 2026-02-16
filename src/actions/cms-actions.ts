'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function checkAdmin() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" || !session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function updateContentBlock(formData: FormData) {
    const session = await checkAdmin()
    const adminId = session.user.id!
    const adminName = session.user.name || session.user.email || "Unknown Admin"

    const key = formData.get("key") as string
    const value = formData.get("value") as string
    const valueAr = formData.get("valueAr") as string | null
    const type = (formData.get("type") as string) || "text"
    const status = (formData.get("status") as string) || "PUBLISHED"

    // 1. Fetch previous state for Audit & Snapshot
    const previousContent = await prisma.contentBlock.findUnique({
        where: { key }
    })

    const newValue = { value, valueAr, type, status }

    await prisma.$transaction(async (tx) => {
        // 2. Create Snapshot if it's a significant update
        if (previousContent) {
            await tx.contentHistory.create({
                data: {
                    key,
                    entityType: "ContentBlock",
                    snapshot: JSON.stringify(previousContent),
                    createdBy: adminName,
                }
            })
        }

        // 3. Perform Update/Upsert
        await tx.contentBlock.upsert({
            where: { key },
            update: newValue,
            create: { key, ...newValue },
        })

        // 4. Detailed Audit Log
        await tx.contentAudit.create({
            data: {
                key,
                entityType: "ContentBlock",
                previousValue: previousContent ? JSON.stringify(previousContent) : null,
                newValue: JSON.stringify(newValue),
                updatedBy: adminName,
            }
        })

        // Legacy Audit Log sync
        await tx.auditLog.create({
            data: {
                userId: adminId,
                action: "UPDATE_CONTENT_V2",
                resource: `content:${key}`,
                details: JSON.stringify({ status, type, valueSnippet: value.slice(0, 50) })
            }
        })
    })

    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
}

export async function restoreContentVersion(id: string) {
    await checkAdmin()

    const history = await prisma.contentHistory.findUnique({
        where: { id }
    })

    if (!history) throw new Error("History record not found")

    const snapshot = JSON.parse(history.snapshot)

    if (history.entityType === "ContentBlock") {
        await prisma.contentBlock.update({
            where: { key: history.key },
            data: {
                value: snapshot.value,
                valueAr: snapshot.valueAr,
                type: snapshot.type,
                status: snapshot.status
            }
        })
    } else if (history.entityType === "Service") {
        await prisma.service.update({
            where: { id: history.key },
            data: snapshot
        })
    } else if (history.entityType === "Brand") {
        await prisma.brand.update({
            where: { id: history.key },
            data: snapshot
        })
    }

    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
}

export async function updateService(id: string, data: any) {
    const session = await checkAdmin()
    const adminName = session.user.name || session.user.email || "Unknown Admin"

    const previous = await prisma.service.findUnique({ where: { id } })
    if (!previous) throw new Error("Service not found")

    await prisma.$transaction(async (tx) => {
        await tx.contentHistory.create({
            data: {
                key: previous.id,
                entityType: "Service",
                snapshot: JSON.stringify(previous),
                createdBy: adminName,
            }
        })

        await tx.service.update({
            where: { id },
            data
        })

        await tx.contentAudit.create({
            data: {
                key: previous.id,
                entityType: "Service",
                previousValue: JSON.stringify(previous),
                newValue: JSON.stringify(data),
                updatedBy: adminName,
            }
        })
    })

    revalidatePath("/services")
    revalidatePath(`/services/${previous.slug}`)
    revalidatePath("/admin/content")
    return { success: true }
}

export async function updateBrand(id: string, data: any) {
    const session = await checkAdmin()
    const adminName = session.user.name || session.user.email || "Unknown Admin"

    const previous = await prisma.brand.findUnique({ where: { id } })
    if (!previous) throw new Error("Brand not found")

    await prisma.$transaction(async (tx) => {
        await tx.contentHistory.create({
            data: {
                key: previous.id,
                entityType: "Brand",
                snapshot: JSON.stringify(previous),
                createdBy: adminName,
            }
        })

        await tx.brand.update({
            where: { id },
            data
        })

        await tx.contentAudit.create({
            data: {
                key: previous.id,
                entityType: "Brand",
                previousValue: JSON.stringify(previous),
                newValue: JSON.stringify(data),
                updatedBy: adminName,
            }
        })
    })

    revalidatePath("/")
    revalidatePath(`/brand/${previous.slug}`)
    revalidatePath("/admin/content")
    return { success: true }
}

export async function addBrand(formData: FormData) {
    await checkAdmin()

    const name = formData.get("name") as string
    const nameAr = formData.get("nameAr") as string | null
    // For now, we'll assume logoUrl is passed or handle upload separately.
    // This is a simple impl for the database record.

    await prisma.brand.create({
        data: {
            name,
            nameAr,
            // logoUrl: ... (Handle file upload logic if needed elsewhere)
        }
    })

    revalidatePath("/admin/content")
    return { success: true }
}

export async function deleteBrand(id: string) {
    await checkAdmin()

    await prisma.brand.delete({
        where: { id }
    })

    revalidatePath("/admin/content")
    return { success: true }
}
