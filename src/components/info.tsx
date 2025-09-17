import { Label } from "./ui/label"
import { Skeleton } from "./ui/skeleton"

interface InfoProps {
    label: string
    value: string
    isLoading?: boolean
    skeletonLength?: number
}

export function Info({
    label,
    value,
    isLoading = false,
    skeletonLength = 80,
}: InfoProps) {
    return (
        <div>
            <Label className="text-sm text-muted-foreground">{label}</Label>
            {isLoading ? (
                <Skeleton
                    className="h-4 mt-1"
                    style={{ width: skeletonLength }}
                />
            ) : (
                <p className="font-medium text-sm">{value}</p>
            )}
        </div>
    )
}
