import { Info } from "@/components/info"

interface AdviserInfoProps {
    adviser: string
    email: string
    phone: string
    isLoading?: boolean
}

export function AdviserInfo({
    adviser,
    email,
    phone,
    isLoading = false,
}: AdviserInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Info
                label="Adviser"
                value={adviser}
                isLoading={isLoading}
                skeletonLength={140}
            />
            <Info
                label="Email"
                value={email}
                isLoading={isLoading}
                skeletonLength={160}
            />
            <Info
                label="Phone"
                value={phone}
                isLoading={isLoading}
                skeletonLength={110}
            />
        </div>
    )
}
