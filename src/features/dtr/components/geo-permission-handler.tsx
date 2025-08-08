import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type PermissionState =
    | "loading"
    | "granted"
    | "denied"
    | "prompt"
    | "unsupported"

export default function GeoPermissionHandler({
    onPermissionGranted,
    onPermissionDenied,
    onPermissionPrompt,
}: {
    onPermissionGranted: () => void
    onPermissionDenied: () => void
    onPermissionPrompt: () => void
}) {
    const [permission, setPermission] = useState<PermissionState>("loading")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!navigator.permissions) {
            setPermission("unsupported")
            setError(
                "Your browser does not support the Permissions API. Please allow location access manually."
            )
            return
        }

        navigator.permissions
            .query({ name: "geolocation" })
            .then((result) => {
                setPermission(result.state as PermissionState)
                updateCallbacks(result.state as PermissionState)

                result.onchange = () => {
                    setPermission(result.state as PermissionState)
                    updateCallbacks(result.state as PermissionState)
                }
            })
            .catch(() => {
                setError("Failed to query permission status.")
            })

        function updateCallbacks(state: PermissionState) {
            if (state === "granted") {
                onPermissionGranted()
            } else if (state === "denied") {
                onPermissionDenied()
            } else if (state === "prompt") {
                onPermissionPrompt()
            }
        }
    }, [onPermissionDenied, onPermissionGranted, onPermissionPrompt])

    function requestGeolocation() {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.")
            return
        }

        navigator.geolocation.getCurrentPosition(
            () => {
                setError(null)
            },
            (err) => {
                setError(err.message || "Failed to get location")
            }
        )
    }

    if (permission === "loading") {
        return null
    }

    if (permission === "denied") {
        return (
            <Alert variant="destructive" className="flex flex-col gap-4">
                <AlertTitle>Location Permission Denied</AlertTitle>
                <AlertDescription>
                    Location permission has been denied. To enable, please
                    change your browser settings and allow location access for
                    this site.
                </AlertDescription>
                <Button
                    onClick={() => window.location.reload()}
                    variant="destructive"
                    className="self-start"
                >
                    Reload page after changing settings
                </Button>
            </Alert>
        )
    }

    if (permission === "prompt") {
        return (
            <Alert variant="destructive" className="flex flex-col gap-4">
                <AlertTitle>Location Permission Required</AlertTitle>
                <AlertDescription>
                    Please allow location access when your browser prompts you
                    to enable geolocation.
                </AlertDescription>
                <Button
                    onClick={requestGeolocation}
                    variant="outline"
                    className="self-start"
                >
                    Request Location Permission
                </Button>

                {error && <p className="mt-2 text-destructive">{error}</p>}
            </Alert>
        )
    }

    if (permission === "unsupported") {
        return (
            <Alert variant="default">
                <AlertTitle>Permissions API Not Supported</AlertTitle>
                <AlertDescription>
                    Your browser does not support the Permissions API. Please
                    ensure location permission is granted manually.
                </AlertDescription>
            </Alert>
        )
    }

    return null
}
