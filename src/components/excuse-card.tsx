import { useState } from "react"
import { FileDown } from "lucide-react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

import { Button } from "@/components/ui/button"
import type { ExcuseRequest } from "@/types/excuse"
import { capitalizeWords } from "@/lib/utils"
import { Info, InfoLabel } from "./info"

interface ExcuseSheetContentProps {
    excuse: ExcuseRequest
    readOnly?: boolean
    onApprove?: (excuse: ExcuseRequest) => void
    onReject?: (excuse: ExcuseRequest) => void
}

export default function ExcuseSheetContent({
    excuse,
    readOnly = true,
    onApprove,
    onReject,
}: ExcuseSheetContentProps) {
    const {
        date,
        reason,
        status,
        createdAt,
        filesUrl,
        filesName,
        photosUrl,
        studentName,
        agencyName,
    } = excuse

    const [expanded, setExpanded] = useState(false)
    const toggleExpand = () => setExpanded((prev) => !prev)

    const formatCreatedAt =
        createdAt instanceof Date
            ? createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "-"
    const formattedTime =
        createdAt instanceof Date
            ? createdAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
              })
            : "-"
    const formattedDate =
        date instanceof Date
            ? date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "-"

    return (
        <div className="space-y-4 px-4">
            <div className="flex flex-col gap-4">
                <Info label="Student" value={capitalizeWords(studentName)} />
                <Info label="Date of Absence" value={formattedDate} />
                <Info label="Agency" value={agencyName} />
                <Info
                    label="Status"
                    value={status.charAt(0).toUpperCase() + status.slice(1)}
                />
                <Info
                    label="Submitted On"
                    value={`${formatCreatedAt} ${formattedTime}`}
                />
            </div>

            <div>
                <InfoLabel label="Reason of Excuse" />
                <p
                    className={`text-sm font-medium ${
                        expanded ? "" : "line-clamp-3"
                    }`}
                >
                    {reason}
                </p>
                {reason.split(" ").length > 20 && (
                    <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-gray-500 dark:text-gray-300 hover:underline font-normal"
                        onClick={toggleExpand}
                    >
                        {expanded ? "see less" : "see more"}
                    </Button>
                )}
            </div>

            {filesUrl && filesUrl.length > 0 && (
                <div className="flex flex-col gap-2">
                    <InfoLabel label="Attached Files" />
                    {filesUrl.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center bg-gray-100 dark:bg-gray-900 text-gray-600 px-2 py-1 rounded-md gap-1.5 w-full"
                        >
                            <span className="truncate dark:text-gray-400 text-xs w-full">
                                {filesName?.[idx] || `File ${idx + 1}`}
                            </span>
                            <a
                                href={file}
                                download
                                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-500 dark:text-blue-400"
                            >
                                <FileDown size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {photosUrl && photosUrl.length > 0 && (
                <div>
                    <InfoLabel label="Attached Photos" />
                    <div className="flex flex-wrap gap-2 mt-1">
                        {photosUrl.map((photo, idx) => (
                            <Zoom key={idx}>
                                <img
                                    src={photo}
                                    alt={`Photo ${idx + 1}`}
                                    className="h-16 w-16 object-cover rounded border cursor-pointer"
                                />
                            </Zoom>
                        ))}
                    </div>
                </div>
            )}

            {!readOnly && (onApprove || onReject) && (
                <div className="flex gap-2 pt-2">
                    {onApprove && (
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onApprove(excuse)}
                        >
                            Approve
                        </Button>
                    )}
                    {onReject && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onReject(excuse)}
                        >
                            Reject
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
