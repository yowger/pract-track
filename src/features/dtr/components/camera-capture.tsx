import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"

type CameraCaptureProps = {
    onCapture?: (imageDataUrl: string) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
    const webcamRef = useRef<Webcam>(null)

    const videoConstraints = {
        facingMode: facingMode,
    }

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot()
            if (imageSrc) {
                setCapturedImage(imageSrc)
                setShowCamera(false)

                if (onCapture) onCapture(imageSrc)
            }
        }
    }, [webcamRef, onCapture])

    const toggleFacingMode = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    }

    return (
        <div className="space-y-4">
            {!showCamera && !capturedImage && (
                <Button onClick={() => setShowCamera(true)} variant="default">
                    Take Picture
                </Button>
            )}

            {showCamera && (
                <div className="flex flex-col items-center space-y-2">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="rounded-md border border-gray-300"
                    />
                    <div className="flex gap-2">
                        <Button onClick={capture} variant="default">
                            Capture
                        </Button>
                        <Button
                            onClick={() => setShowCamera(false)}
                            variant="outline"
                            className="text-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button onClick={toggleFacingMode} variant="default">
                            Switch Camera
                        </Button>
                    </div>
                </div>
            )}

            {capturedImage && (
                <div className="flex flex-col items-center space-y-2">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="rounded-md border border-gray-300 max-w-full"
                    />
                    <Button
                        onClick={() => {
                            setCapturedImage(null)
                            setShowCamera(true)
                        }}
                        variant="destructive"
                    >
                        Retake
                    </Button>
                </div>
            )}
        </div>
    )
}
