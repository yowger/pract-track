import { useEffect, useState, useCallback } from "react"

type PermissionState = "granted" | "denied" | "prompt" | "unsupported"

export function useGeolocationPermission() {
    const [permission, setPermission] = useState<PermissionState>("prompt")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!navigator.permissions) {
            setPermission("unsupported")
            return
        }
        navigator.permissions
            .query({ name: "geolocation" })
            .then((status) => {
                setPermission(status.state as PermissionState)
                status.onchange = () =>
                    setPermission(status.state as PermissionState)
            })
            .catch(() => setPermission("unsupported"))
    }, [])

    const requestPermission = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.")
            return
        }
        navigator.geolocation.getCurrentPosition(
            () => {
                setPermission("granted")
                setError(null)
            },
            (err) => {
                setError(err.message || "Permission denied.")
                setPermission("denied")
            }
        )
    }, [])

    return { permission, error, requestPermission }
}
