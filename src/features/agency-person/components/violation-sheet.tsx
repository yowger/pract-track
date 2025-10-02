

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { formatDateSafe, formatTimeSafe } from "@/lib/date-utils"
import type { Violation } from "@/types/violation"
import { User, Building2, FileText, Calendar, Clock } from "lucide-react"
import { capitalizeWords } from "../../../lib/utils"
import { violationTypeMap } from "@/data/violations"

interface ViolationSideSheetProps {
    violation: Violation | null
    isOpen: boolean
    onClose: () => void
    onEdit?: (violation: Violation) => void
    onDelete?: (violation: Violation) => void
}

const violationTypeColors: Record<string, string> = {
    attendance: "bg-yellow-100 text-yellow-800",
    academic: "bg-purple-100 text-purple-800",
    behavior: "bg-pink-100 text-pink-800",
    dress_code: "bg-blue-100 text-blue-800",
    lateness: "bg-orange-100 text-orange-800",
    unauthorized_absence: "bg-red-100 text-red-800",
    professionalism: "bg-green-100 text-green-800",
    safety: "bg-indigo-100 text-indigo-800",
    misconduct: "bg-red-200 text-red-900",
    other: "bg-gray-100 text-gray-800",
}

export default function ViolationSideSheet({
    violation,
    isOpen,
    onClose,
}: ViolationSideSheetProps) {
    if (!violation) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                style={{ maxWidth: "28rem" }}
                className="overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        Violation Details
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 px-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {violation.name
                                    .split(" ")
                                    .map((n) => n[0].toUpperCase())
                                    .join("")}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {capitalizeWords(violation.name)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {violation.studentId}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                            Violation Type
                        </label>
                        <span
                            className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                                violationTypeColors[violation.violationType] ||
                                "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {violationTypeMap[violation.violationType] ||
                                violation.violationType}
                        </span>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <FileText size={14} />
                            Remarks
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {violation.remarks}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <Building2 size={14} />
                            Reporting Agency
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">
                                {violation.agencyName}
                            </p>
                            <p className="text-xs text-gray-600">
                                {violation.agencyId}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <User size={14} />
                            Reported By
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">
                                {capitalizeWords(violation.reportedBy.name)}
                            </p>
                            <p className="text-xs text-gray-600">
                                {violation.reportedBy.id}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Calendar size={14} />
                                Created
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-900">
                                    {formatDateSafe(violation.createdAt)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {formatTimeSafe(violation.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Clock size={14} />
                                Updated
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-900">
                                    {formatDateSafe(violation.updatedAt)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {formatTimeSafe(violation.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
