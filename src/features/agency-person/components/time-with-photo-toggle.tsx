import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

export function TimeWithPhotoToggle({
    value,
    onChange,
    photoActive,
    onTogglePhoto,
    disabled,
}: {
    value: string
    onChange: (val: string) => void
    photoActive: boolean
    onTogglePhoto: () => void
    disabled: boolean
}) {
    return (
        <div className="flex items-center gap-2 w-44">
            <Input
                type="time"
                className="w-fit"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
            <Button
                variant="outline"
                size="icon"
                className={`size-8 transition-colors ${
                    photoActive ? "border-blue-300" : ""
                }`}
                type="button"
                disabled={disabled}
                onClick={onTogglePhoto}
            >
                <Camera
                    className={`w-4 h-4 transition-colors ${
                        photoActive ? "text-blue-500" : "text-slate-400"
                    } ${disabled ? "opacity-50" : ""}`}
                />
            </Button>
        </div>
    )
}
