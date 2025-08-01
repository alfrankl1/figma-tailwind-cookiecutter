import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-button transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-text-inverse-primary dark:text-text-primary hover:bg-brand-hover",
        destructive:
          "bg-danger text-text-inverse-primary dark:text-text-primary hover:bg-danger-hover",
        outline:
          "border border-border-secondary bg-background hover:bg-background-secondary hover:text-text-primary",
        secondary:
          "bg-background-secondary text-text-primary hover:bg-background-secondary-hover",
        ghost: "hover:bg-background-secondary hover:text-text-primary",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2.5 font-button [&_svg]:size-4",
        sm: "px-3 py-2.5 font-button-small gap-1.5 [&_svg]:size-3",
        lg: "px-4 py-3 font-button [&_svg]:size-4",
        "icon-default": "p-2 [&_svg]:size-4",
        "icon-sm": "p-1 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 