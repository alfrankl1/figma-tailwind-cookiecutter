import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Palette } from "phosphor-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-button transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-text-inverse-primary dark:text-text-primary shadow hover:bg-brand-hover",
        destructive:
          "bg-danger text-text-inverse-primary dark:text-text-primary shadow-sm hover:bg-danger-hover",
        outline:
          "border border-border bg-background shadow-sm hover:bg-background-secondary hover:text-text-primary",
        secondary:
          "bg-background-secondary text-text-primary shadow-sm hover:bg-background-secondary-hover",
        ghost: "hover:bg-background-secondary hover:text-text-primary",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2.5 font-button [&_svg]:size-4",
        sm: "px-3 py-2.5 font-button-small gap-1.5 [&_svg]:size-3",
        lg: "px-4 py-3 font-button [&_svg]:size-4",
        icon: "p-2 [&_svg]:size-4",
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
  icon?: React.ComponentType<any>
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon: Icon, iconPosition = "left", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // For icon size, show only icon, no text
    if (size === "icon") {
      const IconComponent = Icon || Palette
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <IconComponent />
        </Comp>
      )
    }
    
    // For other sizes, handle icon position
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon />}
        {children}
        {Icon && iconPosition === "right" && <Icon />}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 