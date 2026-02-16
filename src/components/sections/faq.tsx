'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, PhoneIcon } from '@/components/ui/icons'
import { faqs } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import { FAQ as FAQType } from '@/types'

export function FAQ({ initialFaqs }: { initialFaqs?: FAQType[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const displayFaqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : faqs

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="text-[#D42B2B] font-black text-xs uppercase tracking-[0.3em]">
            Support Desk
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-black mt-4 mb-8 tracking-tighter">
            Elite <span className="text-gray-300">Knowledge</span>
          </h2>
          <p className="text-gray-500 text-xl font-medium">
            Find answers to common questions about our elite services.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {displayFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={cn(
                  'border rounded-[2rem] overflow-hidden transition-all duration-300',
                  openIndex === index
                    ? 'border-black shadow-xl'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-8 text-left bg-transparent hover:bg-white transition-colors"
                >
                  <span className="font-black text-black text-xl uppercase tracking-tighter pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    size={24}
                    className={cn(
                      'text-[#E62329] flex-shrink-0 transition-transform duration-300',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8">
                        <div className="pt-6 border-t border-gray-100">
                          <p className="text-gray-600 font-medium leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 p-12 bg-black rounded-[3rem] shadow-2xl carbon-fiber border border-white/5"
        >
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
            Still Seeking <span className="silver-shine">Clarity?</span>
          </h3>
          <p className="text-white/60 mb-8 font-medium">
            Our concierge team is here for personalized assistance.
          </p>
          <Tooltip content="Tap to call our team directly" position="top">
            <a
              href="tel:+97125555443"
              className="inline-flex items-center gap-4 text-[#FFD700] font-black uppercase tracking-widest text-sm hover:text-white transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFD700] group-hover:text-black transition-all">
                <PhoneIcon size={18} />
              </div>
              <span>Connect at +971 2 555 5443</span>
            </a>
          </Tooltip>
        </motion.div>
      </div>
    </section>
  )
}
