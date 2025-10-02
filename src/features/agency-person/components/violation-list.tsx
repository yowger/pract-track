import type { Violation } from "@/types/violation"
import { capitalizeWords } from "../../../lib/utils"
import {
    AlertTriangle,
    User,
    Building,
    Flag,
    // MessageSquare,
} from "lucide-react"
import { getRelativeTime } from "@/lib/date-utils"
import { violationTypeMap } from "@/data/violations"

interface ViolationsFeedProps {
    violations: Violation[]
    limit?: number
    onViewDetails?: (violation: Violation) => void
}

export function ViolationsFeed({
    violations,
    limit = 5,
    onViewDetails,
}: ViolationsFeedProps) {
    if (!violations || violations.length === 0) {
        return (
            <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No violations reported</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {violations.slice(0, limit).map((violation) => (
                <div
                    key={violation.id}
                    onClick={() => onViewDetails?.(violation)}
                    className="group p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                >
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                    {violationTypeMap[
                                        violation.violationType
                                    ] || violation.violationType}
                                </h4>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-red-200 bg-red-50 text-red-700">
                                    <Flag className="w-3 h-3" />
                                    Reported
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-medium">
                                        {capitalizeWords(violation.name)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Building className="w-3.5 h-3.5" />
                                    <span>{violation.agencyName}</span>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {getRelativeTime(violation.createdAt)}
                        </span>
                    </div>

                    <div className="mb-2">
                        <div className="flex items-start gap-1.5">
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                {violation.remarks}
                            </p>
                        </div>
                    </div>

                    {/* <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-gray-500">
                            <div className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[120px]">
                                    {violation.agencyName}
                                </span>
                            </div>
                        </div>

                        <div className="text-gray-500 truncate max-w-[150px]">
                            by {violation.reportedBy.name}
                        </div>
                    </div> */}
                </div>
            ))}
        </div>
    )
}
