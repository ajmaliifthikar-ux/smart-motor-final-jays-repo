'use server'

import { updateContent, getService, createAuditLog, updateService, createService, deleteBrand, createBrand, getBrand } from "@/lib/firebase-db"
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

    // Update content directly in Firestore
    await updateContent(key, {
        title: key,
        content: value,
        contentAr: valueAr || undefined,
        published: status === "PUBLISHED",
    })

    // Log the audit trail
    await createAuditLog({
        userId: adminId,
        action: "UPDATE_CONTENT_BLOCK",
        resource: `content:${key}`,
        details: { status, type, valueSnippet: value.slice(0, 50) }
    })

    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
}

export async function restoreContentVersion(id: string) {
    // In Firebase without versioning, we'll just show a message
    return { 
        success: false, 
        error: "Content versioning not yet implemented in Firebase migration. Audit logs are still available for reference." 
    }
}

export async function updateServiceAction(id: string, data: any) {
    const session = await checkAdmin()
    const adminName = session.user.name || session.user.email || "Unknown Admin"

    // Verify service exists
    const previous = await getService(id)
    if (!previous) throw new Error("Service not found")

    // Update service
    await updateService(id, data)

    // Log the audit trail
    await createAuditLog({
        userId: session.user.id!,
        action: "UPDATE_SERVICE",
        resource: `service:${id}`,
        details: data
    })

    revalidatePath("/services")
    revalidatePath(`/services/${previous.slug}`)
    revalidatePath("/admin/content")
    return { success: true }
}

export async function updateBrandAction(id: string, data: any) {
    const session = await checkAdmin()
    const adminName = session.user.name || session.user.email || "Unknown Admin"

    // Verify brand exists
    const previous = await getBrand(id)
    if (!previous) throw new Error("Brand not found")

    // Update brand
    await updateContent(id, data)

    // Log the audit trail
    await createAuditLog({
        userId: session.user.id!,
        action: "UPDATE_BRAND",
        resource: `brand:${id}`,
        details: data
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

    await createBrand({
        name,
        nameAr: nameAr || undefined,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
    })

    revalidatePath("/admin/content")
    return { success: true }
}

export async function deleteBrandAction(id: string) {
    await checkAdmin()

    await deleteBrand(id)

    revalidatePath("/admin/content")
    return { success: true }
}

// Keep original function names for backward compatibility
export { updateServiceAction as updateService, updateBrandAction as updateBrand, deleteBrandAction as deleteBrand }
