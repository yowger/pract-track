import { useState } from "react"

interface UploadResult {
    url: string
    public_id: string
    format: string
    resource_type: string
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_CLOUD_UPLOAD_PRESET

export function useCloudinaryUpload() {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<UploadResult | null>(null)

    const upload = async (file: File) => {
        setUploading(true)
        setError(null)
        setResult(null)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
                { method: "POST", body: formData }
            )

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setResult({
                url: data.secure_url,
                public_id: data.public_id,
                format: data.format,
                resource_type: data.resource_type,
            })

            return data
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Upload error")
            }

            setError("Upload error")

            throw err
        } finally {
            setUploading(false)
        }
    }

    return { upload, uploading, error, result }
}
