"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { UseStateHistoryValue } from "@mantine/hooks";

const buttonVariants = cva(
    "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: `
                    group relative w-full flex justify-center border 
                    border-transparent 
                    text-white bg-main-500 hover:bg-main-600 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500
                    px-6 py-2 rounded-xl text-base font-semibold! transition-all! duration-200!
                    cursor-pointer`,
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: `group relative w-full flex justify-center  items-center
                    border border-gray-500 
                    text-white bg-transparent hover:bg-main-600 hover:border-main-600
                    focus:outline-none
                    px-6 py-2 rounded-xl  font-semibold! transition-colors duration-200
                    cursor-pointer`,
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const [loading, setLoading] = React.useState(false);
        
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={loading || props.disabled}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
