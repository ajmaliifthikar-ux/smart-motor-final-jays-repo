import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { hashValue } from '@/lib/hashing'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/security/questions/update
 * Update admin security questions
 *
 * Body:
 * - questions: Array of { question, answer } objects (minimum 3)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = session.uid
    const body = await req.json()
    const { questions } = body

    // Validate inputs
    if (!Array.isArray(questions) || questions.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 security questions are required' },
        { status: 400 }
      )
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question || !q.answer || typeof q.answer !== 'string') {
        return NextResponse.json(
          { error: 'Each question must have a non-empty answer' },
          { status: 400 }
        )
      }

      if (q.answer.trim().length === 0) {
        return NextResponse.json(
          { error: 'Answers cannot be empty' },
          { status: 400 }
        )
      }
    }

    // Hash answers
    const hashedQuestions = await Promise.all(
      questions.map(async (q) => {
        const answerHash = await hashValue(q.answer.trim().toLowerCase())
        return {
          question: q.question,
          answerHash,
        }
      })
    )

    // Get user document
    const userDoc = adminDb.collection('users').doc(adminId)
    const userData = await userDoc.get()
    const existingSecurity = userData.data()?.security || {}

    // Update user security questions
    await userDoc.update({
      security: {
        ...existingSecurity,
        securityQuestions: hashedQuestions,
        securityQuestionsUpdatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: 'SECURITY_QUESTIONS_UPDATED',
      status: 'SUCCESS',
      details: {
        questionCount: questions.length,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Security questions updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Security questions update error:', error)
    return NextResponse.json(
      { error: 'Failed to update security questions' },
      { status: 500 }
    )
  }
}
