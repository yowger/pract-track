import { Timer } from "lucide-react"

import RoleSwitcher from "@/features/auth/components/role"

export default function RoleInitPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm md:max-w-lg lg:max-w-xl flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Timer className="size-4" />
                    </div>
                    Prac track
                </a>

                <RoleSwitcher />
            </div>
        </div>
    )
}
