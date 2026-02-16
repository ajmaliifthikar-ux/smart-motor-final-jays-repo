'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, Loader2, CheckCircle2, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!review.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          text: review,
          platform: 'all'
        })
      })

      if (!response.ok) throw new Error('Failed to post review')
      
      setIsSubmitted(true)
      toast.success('Review posted successfully!')
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setReview('')
        setRating(5)
      }, 3000)
    } catch (error) {
      console.error(error)
      toast.error('Failed to post review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-[2.5rem] shadow-2xl z-[160] overflow-hidden p-8 border border-gray-100"
          >
            {isSuccess ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#121212]">Review Submitted!</h3>
                <p className="text-gray-500 font-medium px-8">
                  Your feedback has been posted to our Google and Facebook profiles. Thank you for choosing Smart Motor.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#121212]">Share Your Experience</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Direct Post to Google & Facebook</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Rating */}
                  <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Overall Rating</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-90 hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={cn(
                              "transition-colors",
                              (hover || rating) >= star 
                                ? "fill-[#FFCC00] text-[#FFCC00]" 
                                : "text-gray-200 fill-transparent"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Write your review</span>
                    <Textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Tell us about the service you received..."
                      className="min-h-[150px] bg-gray-50 border-0 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#121212] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !review.trim()}
                    className="w-full h-16 rounded-[1.2rem] bg-[#121212] hover:bg-[#E62329] text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Post Review
                        <div className="flex items-center gap-1.5 ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <img src="/google-logo.svg" alt="G" className="w-3 h-3 grayscale invert" />
                          <Facebook size={12} className="fill-white" />
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
