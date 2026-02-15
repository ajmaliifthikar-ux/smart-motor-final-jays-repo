'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    console.error('Auth Error:', error)
                    console.error('Auth Error Cause:', error.cause)
                    return 'Something went wrong.'
            }
        }
        console.error('Non-Auth Error:', error)
        throw error
    }
}
