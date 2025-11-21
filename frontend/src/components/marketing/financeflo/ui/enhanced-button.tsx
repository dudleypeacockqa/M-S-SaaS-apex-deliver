import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border-2 border-red-600 hover:border-red-700",
        outline:
          "border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white",
        secondary:
          "bg-gray-600 text-white hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-700",
        ghost: "bg-white/90 text-gray-900 hover:bg-white hover:text-blue-600 border-2 border-transparent hover:border-blue-200",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        cta: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-2 border-transparent shadow-xl",
        watch: "bg-white/95 text-gray-900 hover:bg-white hover:text-blue-600 border-2 border-gray-300 hover:border-blue-500 backdrop-blur-sm"
      },
      size: {
        default: "h-12 px-6 py-3 text-base font-semibold",
        sm: "h-10 px-4 py-2 text-sm font-medium",
        lg: "h-14 px-8 py-4 text-lg font-bold",
        xl: "h-16 px-10 py-5 text-xl font-bold",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }

