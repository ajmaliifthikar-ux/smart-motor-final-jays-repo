'use server'

import { updateUser as updateUserDB, getUser, createAuditLog } from "@/lib/firebase-db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

type Role = "ADMIN" | "CUSTOMER" | "SUPPORT" | "EDITOR"

export async function toggleUserRole(userId: string, currentRole: string) {
    const session = await auth()

    // Security check: Only Admins can change roles
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const adminId = session.user.id
    if (!adminId) throw new Error("Unauthorized: No User ID")

    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN"

    // Update user role
    await updateUserDB(userId, { role: newRole as any })

    // Log the action
    await createAuditLog({
        userId: adminId,
        action: "TOGGLE_ROLE",
        resource: `user:${userId}`,
        details: { from: currentRole, to: newRole }
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

    // Soft delete - mark as deleted
    await updateUserDB(userId, { deletedAt: new Date() as any })

    // Log the action
    await createAuditLog({
        userId: session.user.id,
        action: "DELETE_USER",
        resource: `user:${userId}`,
        details: { method: "soft_delete" }
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

    // Update user
    await updateUserDB(userId, { name, email, role: role as any })

    // Log the action
    await createAuditLog({
        userId: session.user.id,
        action: "UPDATE_USER",
        resource: `user:${userId}`,
        details: { name, role }
    })

    revalidatePath("/admin/users")
    return { success: true, message: "User updated successfully" }
}
