import { CustomBadge } from "@/components/custom-badge"
import type { ExcuseRequest } from "@/types/excuse"
import { Calendar, FileText, User, Building, Image } from "lucide-react"
import { capitalizeWords } from "../../../lib/utils"
import { formatDate, getRelativeTime } from "@/lib/date-utils"
import { toDateSafe } from "../../../lib/date-utils"

interface ExcuseRequestsFeedProps {
    excuses: ExcuseRequest[]
    limit?: number
    onViewDetails?: (excuse: ExcuseRequest) => void
}

export function ExcuseRequestsFeed({
    excuses,
    limit = 5,
    onViewDetails,
}: ExcuseRequestsFeedProps) {
    if (!excuses || excuses.slice(0, limit).length === 0) {
        return (
            <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                    No excuse requests found
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {excuses.slice(0, limit).map((request) => (
                <div
                    key={request.id}
                    onClick={() => onViewDetails?.(request)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                    {request.title}
                                </h3>
                                <CustomBadge
                                    variant={
                                        request.status === "pending"
                                            ? "yellow"
                                            : request.status === "approved"
                                            ? "green"
                                            : "red"
                                    }
                                >
                                    {request.status}
                                </CustomBadge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-medium">
                                        {capitalizeWords(request.studentName)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Building className="w-3.5 h-3.5" />
                                    <span>{request.agencyName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                        {request.date
                                            ? formatDate(
                                                  toDateSafe(request.date)!
                                              )
                                            : "N/A"}
                                    </span>
                                </div>
                                {request.filesUrl &&
                                    request.filesUrl.length > 0 && (
                                        <span className="inline-flex items-center gap-1 text-blue-600">
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>
                                                {request.filesUrl.length}
                                            </span>
                                        </span>
                                    )}
                                {request.photosUrl &&
                                    request.photosUrl.length > 0 && (
                                        <span className="inline-flex items-center gap-1 text-purple-600">
                                            <Image className="w-3.5 h-3.5" />
                                            <span>
                                                {request.photosUrl.length}
                                            </span>
                                        </span>
                                    )}
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {getRelativeTime(request.createdAt)}
                        </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2">
                        {request.reason}
                    </p>

                    {/* <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs">
                            {request.filesUrl &&
                                request.filesUrl.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-blue-600">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>{request.filesUrl.length}</span>
                                    </span>
                                )}
                            {request.photosUrl &&
                                request.photosUrl.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-purple-600">
                                        <Image className="w-3.5 h-3.5" />
                                        <span>{request.photosUrl.length}</span>
                                    </span>
                                )}
                        </div>

                        <button
                            onClick={() => onViewDetails?.(request)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View Details
                        </button>
                    </div> */}
                </div>
            ))}
        </div>
    )
}
