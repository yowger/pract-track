import { Info } from "@/components/info"

interface AgencyInfoProps {
    agencyName: string
    supervisor: string
    location: string
    contact: string
    isLoading?: boolean
}

export function AgencyInfo({
    agencyName,
    supervisor,
    location,
    contact,
    isLoading = false,
}: AgencyInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Info
                label="Agency Name"
                value={agencyName}
                isLoading={isLoading}
                skeletonLength={150}
            />
            <Info
                label="Supervisor"
                value={supervisor}
                isLoading={isLoading}
                skeletonLength={120}
            />
            <Info
                label="Location"
                value={location}
                isLoading={isLoading}
                skeletonLength={180}
            />
            <Info
                label="Contact"
                value={contact}
                isLoading={isLoading}
                skeletonLength={110}
            />
        </div>
    )
}
