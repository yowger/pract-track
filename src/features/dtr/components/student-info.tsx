import { Info } from "@/components/info"

interface StudentInfoProps {
    fullName: string
    studentNumber: string
    email: string
    phoneNumber: string
    program: string
    isLoading?: boolean
}

export function StudentInfo({
    fullName,
    studentNumber,
    email,
    phoneNumber,
    program,
    isLoading = false,
}: StudentInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Info
                label="Full Name"
                value={fullName}
                isLoading={isLoading}
                skeletonLength={120}
            />
            <Info
                label="Student Number"
                value={studentNumber}
                isLoading={isLoading}
                skeletonLength={100}
            />
            <Info
                label="Email"
                value={email}
                isLoading={isLoading}
                skeletonLength={140}
            />
            <Info
                label="Phone Number"
                value={phoneNumber}
                isLoading={isLoading}
                skeletonLength={110}
            />
            <Info
                label="Program"
                value={program}
                isLoading={isLoading}
                skeletonLength={130}
            />
        </div>
    )
}
