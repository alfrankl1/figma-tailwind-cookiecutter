import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { MagnifyingGlass, type IconProps } from "phosphor-react"

import { cn } from "@/lib/utils"

const inputCompactVariants = cva(
  "flex w-full rounded border bg-background-secondary font-input text-text-primary placeholder:text-text-tertiary transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-2 py-0 text-xs leading-4",
  {
    variants: {
      state: {
        default: "border-border hover:border-neutral-secondary-hover focus-visible:border-brand",
        focus: "border-brand focus-visible:border-brand",
        filled: "border-border",
        error: "border-danger hover:border-danger-hover focus-visible:border-danger",
      },
      hasIcon: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      hasIcon: false,
    },
  }
)

export interface InputCompactProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputCompactVariants> {
  icon?: React.ComponentType<IconProps>
  error?: boolean
}

const InputCompact = React.forwardRef<HTMLInputElement, InputCompactProps>(
  (
    {
      className,
      state,
      icon: IconComponent,
      error = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Determine the state based on error and focus/hover
    // (Parent should control state prop for focus/hover/filled)
    const currentState = error ? "error" : state || "default"
    const hasIcon = Boolean(IconComponent)

    return (
      <div className="relative w-full">
        {hasIcon && IconComponent && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconComponent size={14} weight="regular" className="text-text-tertiary" />
          </div>
        )}
        <input
          data-slot="input-compact"
          className={cn(
            inputCompactVariants({ state: currentState, hasIcon }),
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
      </div>
    )
  }
)
InputCompact.displayName = "InputCompact"

export { InputCompact, inputCompactVariants } 