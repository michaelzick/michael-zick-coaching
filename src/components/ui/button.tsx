import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-w-0 max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-background text-center text-sm font-bold uppercase tracking-[0.05em] ring-offset-background transition-all focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cta-elevated-on-hover bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "cta-elevated-on-hover bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "bg-background text-foreground hover:bg-muted hover:text-foreground",
        secondary:
          "cta-elevated-on-hover bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        default: "min-h-[44px] px-3 py-2 sm:px-4 md:px-5",
        sm: "min-h-[40px] px-3 py-2 sm:px-4",
        lg: "min-h-[48px] px-4 py-3 sm:px-6 md:px-8",
        icon: "h-11 w-11",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
