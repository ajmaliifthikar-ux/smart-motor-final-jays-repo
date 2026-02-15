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

    const key = formData.get("key") as string
    const value = formData.get("value") as string
    const valueAr = formData.get("valueAr") as string | null
    const type = (formData.get("type") as string) || "text"
    // Valid statuses: DRAFT, PUBLISHED, ARCHIVED. Default to PUBLISHED for backward compat if not provided
    const status = (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "PUBLISHED"

    await prisma.contentBlock.upsert({
        where: { key },
        update: { value, valueAr, type, status },
        create: { key, value, valueAr, type, status },
    })

    // 📝 Audit Log
    await prisma.auditLog.create({
        data: {
            userId: adminId,
            action: "UPDATE_CONTENT",
            resource: `content:${key}`,
            details: JSON.stringify({ status, type, valueSnippet: value.slice(0, 50) }) // Stringified
        }
    })

    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
}

export async function addBrand(formData: FormData) {
    await checkAdmin()

    const name = formData.get("name") as string
    const nameAr = formData.get("nameAr") as string | null
    // For now, we'll assume logoUrl is passed or handle upload separately.
    // This is a simple impl for the database record.

    await (prisma as any).brand.create({
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
