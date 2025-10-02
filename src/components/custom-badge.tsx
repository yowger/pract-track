import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden capitalize",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                blue: "border border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
                green: "border border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
                yellow: "border border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/70 dark:text-white/80",
                red: "border border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
                orange: "border border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
                overtime:
                    "border border-purple-400 bg-purple-50 text-purple-800 dark:bg-purple-900/70 dark:text-white/80",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export type BadgeTypes = VariantProps<typeof badgeVariants>

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

export function CustomBadge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}
