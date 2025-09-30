import { useState } from "react"
import { FileDown } from "lucide-react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ExcuseRequest } from "@/types/excuse"
import { capitalizeWords } from "@/lib/utils"

interface ExcuseCardProps {
    excuse: ExcuseRequest
    readOnly?: boolean
    onApprove?: (excuse: ExcuseRequest) => void
    onReject?: (excuse: ExcuseRequest) => void
}

export default function ExcuseCard({
    excuse,
    readOnly = true,
    onApprove,
    onReject,
}: ExcuseCardProps) {
    const {
        date,
        title,
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
                  month: "short",
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
                  month: "short",
                  day: "numeric",
              })
            : "-"

    return (
        <Card className="shadow-sm border">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{title}</CardTitle>
                    <Badge
                        className="px-3 py-1 text-sm"
                        variant={
                            status === "approved"
                                ? "default"
                                : status === "rejected"
                                ? "destructive"
                                : "secondary"
                        }
                    >
                        {status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    <InfoItem
                        label="Student"
                        value={capitalizeWords(studentName)}
                    />
                    <InfoItem label="Date of Absence" value={formattedDate} />
                    <InfoItem label="Agency" value={agencyName} />
                    <InfoItem
                        label="Submitted"
                        value={formatCreatedAt + " " + formattedTime}
                    />
                </div>

                <div>
                    <h3 className="text-muted-foreground text-sm">
                        Reason of excuse
                    </h3>
                    <p className={`text-sm ${expanded ? "" : "line-clamp-3"}`}>
                        {reason}
                    </p>
                    {reason.split(" ").length > 20 && (
                        <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-gray-600 hover:underline"
                            onClick={toggleExpand}
                        >
                            {expanded ? "See less" : "See more"}
                        </Button>
                    )}
                </div>

                {filesUrl && filesUrl.length > 0 && (
                    <div>
                        <span className="text-muted-foreground text-sm">
                            Attached Files
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {filesUrl.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center bg-gray-100 text-muted-foreground px-2 py-1 rounded-md gap-1.5 text-sm"
                                >
                                    <span className="truncate w-28">
                                        {filesName?.[idx] || `File ${idx + 1}`}
                                    </span>

                                    <a
                                        href={file}
                                        download
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FileDown size={16} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {photosUrl && photosUrl.length > 0 && (
                    <div>
                        <span className="text-muted-foreground text-sm">
                            Attached Photos:
                        </span>
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
            </CardContent>
        </Card>
    )
}

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
    <div>
        <span className="text-muted-foreground text-sm">{label}</span>
        <p className="font-medium text-sm text-gray-800">{value || "-"}</p>
    </div>
)
