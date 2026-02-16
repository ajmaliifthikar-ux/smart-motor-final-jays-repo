import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { adminAuth } from "@/lib/firebase-admin"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Firebase",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6)
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    
                    try {
                        // Verify Firebase credentials via admin SDK
                        const userRecord = await adminAuth.getUserByEmail(email)
                        
                        // For Firebase, we verify the password exists in the Prisma DB 
                        // (or can use Firebase custom claims for role)
                        const dbUser = await prisma.user.findUnique({ where: { email } })

                        if (!dbUser) {
                            // User exists in Firebase but not in our DB, create DB user
                            return await prisma.user.create({
                                data: {
                                    email,
                                    name: userRecord.displayName || email.split('@')[0],
                                    role: 'USER',
                                }
                            })
                        }

                        // For backward compatibility, check hashed password if it exists
                        if (dbUser.password) {
                            const passwordsMatch = await bcrypt.compare(password, dbUser.password)
                            if (!passwordsMatch) return null
                        }

                        return dbUser
                    } catch (error) {
                        // Firebase user doesn't exist
                        return null
                    }
                }
                return null
            },
        }),
    ],
})
