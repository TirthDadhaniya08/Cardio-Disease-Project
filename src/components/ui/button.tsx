"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'glow';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean;
}

// Wrapping motion.button for animations
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {

        const variants = {
            primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/20",
            outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
            ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
            glow: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] border-none"
        }

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg font-semibold"
        }

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...(props as HTMLMotionProps<"button">)}
            >
                {props.children}
            </motion.button>
        )
    }
)
Button.displayName = "Button"

export { Button }
