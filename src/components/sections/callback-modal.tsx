'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, PhoneIcon, CheckIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CallbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [step, setStep] = useState<'phone' | 'calling' | 'complete'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length >= 10) {
      setStep('calling')
      // Simulate AI call - in production this would trigger ElevenLabs
      setTimeout(() => {
        setStep('complete')
      }, 5000)
    }
  }

  const handleClose = () => {
    setStep('phone')
    setPhoneNumber('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon size={24} />
              </button>

              {step === 'phone' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#E62329]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneIcon size={32} className="text-[#E62329]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-2">
                    Request a Callback
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI assistant will call you instantly to help with your booking.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="tel"
                      placeholder="+971 XX XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="text-center text-lg"
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full"
                      disabled={phoneNumber.length < 10}
                    >
                      Call Me Now
                    </Button>
                  </form>

                  <p className="text-xs text-gray-500 mt-4">
                    By requesting a callback, you agree to receive a call from our AI assistant.
                  </p>
                </div>
              )}

              {step === 'calling' && (
                <div className="text-center py-8">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 bg-[#E62329] rounded-full animate-ping opacity-25" />
                    <div className="absolute inset-2 bg-[#E62329] rounded-full animate-ping opacity-25 animation-delay-200" />
                    <div className="relative w-24 h-24 bg-[#E62329] rounded-full flex items-center justify-center">
                      <PhoneIcon size={40} className="text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-2">
                    Connecting...
                  </h3>
                  <p className="text-gray-600">
                    Our AI assistant is calling <br />
                    <span className="font-medium">{phoneNumber}</span>
                  </p>

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
                    <p className="text-sm text-gray-600 italic">
                      &quot;Hello! This is Smart Motor&apos;s booking assistant. I understand you&apos;d like
                      to schedule a service. May I have your name please?&quot;
                    </p>
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-[#38A169] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckIcon size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-2">
                    Booking Received!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you! Our team will confirm your appointment within 30 minutes.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-[#38A169] font-medium">Pending Confirmation</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={handleClose}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
