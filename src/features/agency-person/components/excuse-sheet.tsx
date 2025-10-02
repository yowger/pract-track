import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { formatDateSafe, formatTimeSafe } from "@/lib/date-utils"
import type { ExcuseRequest } from "@/types/excuse"
import {
    User,
    Building2,
    FileText,
    Calendar,
    Clock,
    Paperclip,
    Image,
    CheckCircle2,
    XCircle,
    Loader2,
    Download,
    File,
} from "lucide-react"
import { capitalizeWords } from "@/lib/utils"

interface ExcuseSideSheetProps {
    excuse: ExcuseRequest | null
    isOpen: boolean
    onClose: () => void
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
}

export default function ExcuseSideSheet({
    excuse,
    isOpen,
    onClose,
}: ExcuseSideSheetProps) {
    if (!excuse) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                style={{ maxWidth: "28rem" }}
                className="overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        Excuse Request Details
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 px-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {excuse.studentName
                                    .split(" ")
                                    .map((n) => n[0]?.toUpperCase())
                                    .join("")}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {capitalizeWords(excuse.studentName)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {excuse.studentId}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                            Title
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {excuse.title}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <FileText size={14} />
                            Reason
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {excuse.reason}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <Building2 size={14} />
                            Agency
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">
                                {excuse.agencyName}
                            </p>
                            <p className="text-xs text-gray-600">
                                {excuse.agencyId}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                            Status
                        </label>
                        <span
                            className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${
                                statusColors[excuse.status] ||
                                "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {excuse.status === "pending" && (
                                <Loader2 size={14} />
                            )}
                            {excuse.status === "approved" && (
                                <CheckCircle2 size={14} />
                            )}
                            {excuse.status === "rejected" && (
                                <XCircle size={14} />
                            )}
                            {capitalizeWords(excuse.status)}
                        </span>
                    </div>

                    {excuse.reviewedByName && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <User size={14} />
                                Reviewed By
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {capitalizeWords(excuse.reviewedByName)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {excuse.reviewedBy}
                                </p>
                            </div>
                        </div>
                    )}

                    {excuse.filesUrl?.length ? (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Paperclip size={14} />
                                Files
                            </label>
                            <ul className="space-y-2">
                                {excuse.filesUrl.map((url, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-1 py-0.5 hover:shadow-sm transition"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <File
                                                size={16}
                                                className="text-gray-500 shrink-0"
                                            />
                                            <span className="truncate text-xs text-gray-800">
                                                {excuse.filesName?.[i] ||
                                                    `File ${i + 1}`}
                                            </span>
                                        </div>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-3 p-1.5 rounded-lg hover:bg-gray-200 transition"
                                        >
                                            <Download
                                                size={16}
                                                className="text-gray-600"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {excuse.photosUrl?.length ? (
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Image size={14} />
                                Photos
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {excuse.photosUrl.map((url, i) => (
                                    <Zoom key={i}>
                                        <img
                                            src={url}
                                            alt={`Photo ${i + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg border cursor-pointer"
                                        />
                                    </Zoom>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                <Calendar size={14} />
                                Created
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-900">
                                    {formatDateSafe(excuse.createdAt)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {formatTimeSafe(excuse.createdAt)}
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
                                    {formatDateSafe(excuse.updatedAt)}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {formatTimeSafe(excuse.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
