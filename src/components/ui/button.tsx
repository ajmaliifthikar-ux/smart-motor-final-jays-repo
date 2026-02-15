'use client'

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, variant = 'primary', disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[#121212] text-white hover:bg-[#121212]/90",
      secondary: "bg-white text-[#121212] border border-gray-200 hover:bg-gray-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "hover:bg-gray-100 text-gray-600",
      outline: "border border-input bg-background hover:bg-gray-100 hover:text-accent-foreground",
      accent: "bg-[#E62329] text-white hover:bg-[#E62329]/90",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
