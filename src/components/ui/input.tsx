import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import type { IconProps } from "phosphor-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background py-2 font-input text-text-primary placeholder:text-text-tertiary transition-colors file:border-0 file:bg-transparent file:font-button-small file:text-text-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "px-3",
        file: "px-3 file:mr-2 file:px-2 file:py-1 file:rounded-md file:bg-background-secondary file:text-text-primary cursor-pointer",
      },
      state: {
        default: "border-border",
        error: "border-danger",
      },
      hasIcon: {
        true: "pl-10",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      hasIcon: false,
    },
  }
)

const labelVariants = cva("font-label-bold text-text-primary")

const descriptionVariants = cva("font-caption text-text-tertiary", {
  variants: {
    state: {
      default: "text-text-tertiary",
      error: "text-text-danger-primary",
    },
  },
  defaultVariants: {
    state: "default",
  },
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string
  description?: string
  error?: boolean
  icon?: React.ComponentType<IconProps>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    variant, 
    state,
    label, 
    description, 
    error = false, 
    disabled = false,
    icon: IconComponent,
    ...props 
  }, ref) => {
    // Determine the state based on error prop
    const currentState = error ? "error" : state || "default"
    const hasIcon = !!IconComponent
    
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className={cn(labelVariants())}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {IconComponent && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconComponent 
                size={16}
                weight="regular"
                className="text-text-tertiary" 
              />
            </div>
          )}
          <input
            type={variant === "file" ? "file" : type}
            data-slot="input"
            className={cn(
              inputVariants({ 
                variant: variant === "file" ? "file" : "default", 
                state: currentState, 
                hasIcon 
              }),
              // Focus states
              "focus-visible:border-brand",
              // Error focus state
              error && "focus-visible:border-danger-hover",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>
        
        {description && (
          <p className={cn(descriptionVariants({ state: currentState }))}>
            {description}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
