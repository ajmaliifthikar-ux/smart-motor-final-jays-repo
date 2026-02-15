'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Role is just a string now in SQLite schema, but we can define a type for TS convenience
type Role = "ADMIN" | "CUSTOMER" | "SUPPORT" | "EDITOR"

export async function toggleUserRole(userId: string, currentRole: string) {
    const session = await auth()

    // Security check: Only Admins can change roles
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    // ...
    const adminId = session.user.id
    if (!adminId) throw new Error("Unauthorized: No User ID")

    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN"

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    })

    // 📝 Audit Log
    await prisma.auditLog.create({
        data: {
            userId: adminId,
            action: "TOGGLE_ROLE",
            resource: `user:${userId}`,
            details: JSON.stringify({ from: currentRole, to: newRole }) // Stringify for SQLite
        }
    })

    revalidatePath("/admin/users")
    return { success: true, message: `User role updated to ${newRole}` }
}

export async function deleteUser(userId: string) {
    const session = await auth()

    // Security check
    if (session?.user?.role !== "ADMIN" || !session?.user?.id) {
        throw new Error("Unauthorized")
    }

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
        throw new Error("Cannot delete your own account")
    }

    // 🛡️ Soft Delete (Preserve data)
    await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() } // Mark as deleted
    })

    // 📝 Audit Log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "DELETE_USER",
            resource: `user:${userId}`,
            details: JSON.stringify({ method: "soft_delete" }) // Stringify
        }
    })

    revalidatePath("/admin/users")
    return { success: true, message: "User deleted successfully" }
}

export async function updateUser(userId: string, data: { name: string, email: string, role: string }) {
    const session = await auth()

    if (session?.user?.role !== "ADMIN" || !session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { name, email, role } = data

    await prisma.user.update({
        where: { id: userId },
        data: { name, email, role }
    })

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "UPDATE_USER",
            resource: `user:${userId}`,
            details: JSON.stringify({ name, role }) // Stringify
        }
    })

    revalidatePath("/admin/users")
    return { success: true, message: "User updated successfully" }
}
