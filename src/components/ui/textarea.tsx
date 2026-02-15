'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-black placeholder-gray-400 font-semibold',
            'focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white',
            'transition-all duration-300 min-h-[120px] resize-y',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#E53E3E]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[#718096]">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
