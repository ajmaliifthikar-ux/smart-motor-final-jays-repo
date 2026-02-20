'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface SecurityQuestionsProps {
  onQuestionsUpdated: () => void
}

const SECURITY_QUESTIONS = [
  'What is the name of your first pet?',
  'In what city were you born?',
  'What is your mother\'s maiden name?',
  'What is your favorite book?',
  'What was the name of your elementary school?',
  'What is your favorite movie?',
  'In what city did you meet your best friend?',
  'What is your favorite food?',
  'What is the name of the street you grew up on?',
  'What is your favorite sports team?',
]

export default function SecurityQuestions({ onQuestionsUpdated }: SecurityQuestionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<
    Array<{ id: string; question: string; answer: string }>
  >([
    { id: '1', question: '', answer: '' },
    { id: '2', question: '', answer: '' },
    { id: '3', question: '', answer: '' },
  ])

  const handleQuestionChange = (index: number, question: string) => {
    const updated = [...questions]
    updated[index].question = question
    setQuestions(updated)
  }

  const handleAnswerChange = (index: number, answer: string) => {
    const updated = [...questions]
    updated[index].answer = answer
    setQuestions(updated)
  }

  async function handleSaveQuestions() {
    if (
      questions.some((q) => !q.question || !q.answer) ||
      questions.some((q) => q.answer.trim().length === 0)
    ) {
      toast.error('Please fill in all security questions and answers')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/security/questions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questions.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update security questions')
        return
      }

      toast.success('Security questions updated successfully')
      setIsEditing(false)
      onQuestionsUpdated()
    } catch (error) {
      toast.error('An error occurred while updating questions')
      console.error('Update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Questions</h2>
        <p className="text-gray-600 mt-2">
          Set up security questions as an additional way to verify your identity
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Answers are case-insensitive</h3>
            <p className="text-sm text-blue-800 mt-1">
              Use simple, memorable answers that only you would know. Your answers are securely
              hashed and never stored in plain text.
            </p>
          </div>
        </div>
      </Card>

      {!isEditing ? (
        <>
          {/* Status */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Not yet configured</h3>
                <p className="text-sm text-amber-800 mt-1">
                  Set up your security questions for additional account recovery options.
                </p>
              </div>
            </div>
          </Card>

          {/* Button */}
          <Button onClick={() => setIsEditing(true)} className="w-full">
            <Edit2 className="w-4 h-4 mr-2" />
            Set Up Security Questions
          </Button>
        </>
      ) : (
        <>
          {/* Question Inputs */}
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Question {index + 1}
                  </label>
                  <select
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a question</option>
                    {SECURITY_QUESTIONS.map((question) => (
                      <option key={question} value={question}>
                        {question}
                      </option>
                    ))}
                  </select>
                </div>

                {q.question && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Enter your answer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This answer will be used to verify your identity in recovery scenarios.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSaveQuestions}
              disabled={isLoading || questions.some((q) => !q.question || !q.answer)}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Security Questions'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setQuestions([
                  { id: '1', question: '', answer: '' },
                  { id: '2', question: '', answer: '' },
                  { id: '3', question: '', answer: '' },
                ])
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
