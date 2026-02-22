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
                        const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
                        if (!firebaseApiKey) {
                            throw new Error('CONFIG_ERROR: NEXT_PUBLIC_FIREBASE_API_KEY is missing in Vercel settings.');
                        }

                        // Truly verify against Firebase using REST API
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
                            const errorCode = data.error?.message || 'UNKNOWN_FIREBASE_ERROR';
                            console.error('Firebase Auth REST API Error:', errorCode);
                            throw new Error(`FIREBASE_ERROR: ${errorCode}`);
                        }

                        // Firebase Auth successful! Now sync with Prisma
                        let userRecord;
                        try {
                            userRecord = await adminAuth.getUserByEmail(email);
                        } catch (firebaseAdminError) {
                            console.error('Firebase Admin SDK Error (Check your service account config):', firebaseAdminError);
                            // Fallback if Admin SDK fails but REST API succeeded
                            // This might happen if service account is not set up but client API key is
                            userRecord = { uid: data.localId, displayName: null, customClaims: {} };
                        }

                        const isFirebaseAdmin = (userRecord as any).customClaims?.role === 'ADMIN';
                        
                        let dbUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

                        if (!dbUser) {
                            dbUser = await prisma.user.create({
                                data: {
                                    email: email.toLowerCase(),
                                    name: (userRecord as any).displayName || email.split('@')[0],
                                    role: isFirebaseAdmin ? 'ADMIN' : 'USER',
                                }
                            });
                        } else if (isFirebaseAdmin && dbUser.role !== 'ADMIN') {
                            // Update role if changed in Firebase
                            dbUser = await prisma.user.update({
                                where: { email: email.toLowerCase() },
                                data: { role: 'ADMIN' }
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
