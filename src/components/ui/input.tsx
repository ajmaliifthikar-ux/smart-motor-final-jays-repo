import * as React from "react"
import { cn } from "@/lib/utils"
// We import Label to use if label prop is provided
import { Label } from "@/components/ui/label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  inputClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, type, label, error, id, ...props }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        {label && <Label htmlFor={id} className={props.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>{label}</Label>}
        <input
          type={type}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121212] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
