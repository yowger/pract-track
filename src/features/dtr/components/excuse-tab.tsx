import { useEffect } from "react"
import { toast } from "sonner"

import { useGetExcuseRequests } from "@/api/hooks/use-real-time-excuse"
import ExcuseCard from "@/components/excuse-card"

interface ExcuseTabProps {
    userId: string
}

export default function ExcuseTab({ userId }: ExcuseTabProps) {
    const { data: excuses, error } = useGetExcuseRequests({
        studentId: userId,
    })

    useEffect(() => {
        if (error) {
            toast.error(error || "Something went wrong")
        }
    }, [error])

    return (
        <>
            {excuses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {excuses.map((excuse) => (
                        <ExcuseCard key={excuse.id} excuse={excuse} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-sm">
                    No excuse requests found.
                </p>
            )}
        </>
    )
}
