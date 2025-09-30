import { toast } from "sonner"

import { useCloudinaryBulkUpload } from "@/api/hooks/use-upload-bulk"
import { useUser } from "@/hooks/use-user"
import { useCreateExcuseRequest } from "@/api/hooks/use-create-excuse"
import { ExcuseForm, type ExcuseFormValues } from "../components/excuse-form"

export default function Excuse() {
    const { user } = useUser()
    const { upload, uploading } = useCloudinaryBulkUpload()
    const { handleCreateExcuseRequest, loading, error } =
        useCreateExcuseRequest()

    async function handleSubmit(data: ExcuseFormValues) {
        if (!user) return
        try {
            const fileUploadsUrls: string[] = []
            const photoUploadsUrls: string[] = []
            
            if (data.files && data.files.length > 0) {
                const uploadedFiles = await upload(data.files)
                fileUploadsUrls.push(...uploadedFiles.map((f) => f.url))
            }

            if (data.photos && data.photos.length > 0) {
                const photoUploads = await upload(data.photos)
                photoUploadsUrls.push(...photoUploads.map((p) => p.url))
            }

            await handleCreateExcuseRequest({
                studentId: user.uid,
                attendanceId: null,
                title: data.title,
                reason: data.reason,
                filesUrl: fileUploadsUrls,
                photosUrl: photoUploadsUrls,
            })

            toast.success("Excuse request submitted successfully!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to submit excuse request. Please try again.")
        }
    }

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        File Excuse
                    </h1>
                    <p className="text-muted-foreground">
                        File an excuse for your absence.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <ExcuseForm
                        onSubmit={handleSubmit}
                        loading={uploading || loading}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
