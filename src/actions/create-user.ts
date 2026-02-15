'use server'

import { prisma } from "@/lib/prisma"
import { createUserSchema, CreateUserInput } from "@/lib/validations/user"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createUser(data: CreateUserInput) {
    const session = await auth()

    // Security: Only Admins can create users
    if (session?.user?.role !== "ADMIN") {
        return {
            success: false,
            message: "Unauthorized: Only admins can create users",
        }
    }

    const result = createUserSchema.safeParse(data)

    if (!result.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { name, email, password, role } = result.data

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                success: false,
                message: "User with this email already exists",
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        })

        revalidatePath("/admin/users")

        return {
            success: true,
            message: "User created successfully",
        }
    } catch (error) {
        console.error("Failed to create user:", error)
        return {
            success: false,
            message: "Failed to create user. Please try again.",
        }
    }
}
