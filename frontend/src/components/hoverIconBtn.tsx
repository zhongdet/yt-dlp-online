"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"

interface HoverIconButtonProps
  extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  /** The icon to show on hover */
  hoverIcon: React.ReactNode
  /** Position of the hover icon */
  iconPosition?: "left" | "right"
  /** Animation style for the icon */
  animation?: "fade" | "slide" | "scale" | "rotate"
  asChild?: boolean
}

function HoverIconButton({
  children,
  hoverIcon,
  iconPosition = "right",
  animation = "slide",
  className,
  variant,
  size,
  asChild = false,
  ...props
}: HoverIconButtonProps) {
  const animationClasses = {
    fade: {
      icon: "opacity-0 group-hover:opacity-100",
      content: "group-hover:opacity-80",
      button: "",
    },
    slide: {
      icon:
        iconPosition === "right"
          ? "translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          : "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
      content:
        iconPosition === "right"
          ? "group-hover:-translate-x-2"
          : "group-hover:translate-x-2",
      button: "px-6",
    },
    scale: {
      icon: "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100",
      content: "group-hover:scale-95",
      button: "",
    },
    rotate: {
      icon: "rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100",
      content: "",
      button: "",
    },
  }

  const iconElement = (
    <span
      className={cn(
        "absolute inline-flex items-center justify-center transition-all duration-300 ease-out",
        iconPosition === "right" ? "right-3" : "left-3",
        animationClasses[animation].icon
      )}
    >
      {hoverIcon}
    </span>
  )

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group relative overflow-hidden justify-center transition-all duration-300 ease-out",
        animationClasses[animation].button,
        className
      )}
      {...props}
    >
      {iconElement}
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 ease-out",
          animationClasses[animation].content
        )}
      >
        {children}
      </span>
    </Button>
  )
}

export { HoverIconButton }
