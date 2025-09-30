import { useEffect } from "react"
import { toast } from "sonner"
import Zoom from "react-medium-image-zoom"
import { useParams } from "react-router-dom"
import "react-medium-image-zoom/dist/styles.css"

import { useExcuseRequest } from "@/api/hooks/use-get-excuse-request"
import { Badge } from "@/components/ui/badge"

export default function ExcuseDetailPage() {
    const { excuseId } = useParams()
    console.log("🚀 ~ ExcuseDetailPage ~ excuseId:", excuseId)

    const {
        data: excuse,
        loading,
        error,
    } = useExcuseRequest({ id: excuseId || "" }, { enabled: !!excuseId })

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Something went wrong")
        }
    }, [error])

    if (loading) return <p>Loading...</p>

    if (!excuse) return <p>Excuse not found</p>

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{excuse.title}</h1>
                <Badge>{excuse.status}</Badge>
            </div>

            <div>
                <h2 className="font-semibold">Reason</h2>
                <p>{excuse.reason}</p>
            </div>

            {excuse.filesUrl?.length ? (
                <div>
                    <h2 className="font-semibold">Files</h2>
                    <ul className="list-disc list-inside">
                        {excuse.filesUrl.map((url, i) => (
                            <li key={i}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    File {i + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {excuse.photosUrl?.length ? (
                <div>
                    <h2 className="font-semibold">Photos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {excuse.photosUrl.map((url, i) => (
                            <Zoom key={i}>
                                <img
                                    src={url}
                                    alt={`Photo ${i + 1}`}
                                    className="rounded-lg border cursor-zoom-in"
                                />
                            </Zoom>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
