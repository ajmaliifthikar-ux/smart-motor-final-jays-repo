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
                        // Truly verify against Firebase using REST API
                        const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
                        const response = await fetch(
                            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
                            {
                                method: 'POST',
                                body: JSON.stringify({
                                    email,
                                    password,
                                    returnSecureToken: true,
                                }),
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            console.error('Firebase Auth Error:', data.error?.message);
                            return null;
                        }

                        // Firebase Auth successful! Now sync with Prisma
                        let dbUser = await prisma.user.findUnique({ where: { email } });

                        if (!dbUser) {
                            // Fetch detailed user info from Admin SDK
                            const userRecord = await adminAuth.getUserByEmail(email);
                            
                            dbUser = await prisma.user.create({
                                data: {
                                    email,
                                    name: userRecord.displayName || email.split('@')[0],
                                    role: 'USER',
                                }
                            });
                        }

                        return dbUser;
                    } catch (error) {
                        console.error('Auth logic error:', error);
                        return null;
                    }
                }
                return null
            },
        }),
    ],
})
