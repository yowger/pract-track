import { Timer, LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/service/firebase/firebase"

import RoleSwitcher from "@/features/auth/components/role-switcher"
import { Button } from "@/components/ui/button"

export default function RoleInitPage() {
    const handleSignOut = async () => {
        await signOut(auth)
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm md:max-w-lg lg:max-w-xl flex-col gap-6">
                {/* Header row with logo + sign out */}
                <div className="flex items-center justify-between w-full">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <Timer className="size-4" />
                        </div>
                        Prac track
                    </a>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSignOut}
                        title="Sign out"
                    >
                        <LogOut className="size-4" />
                    </Button>
                </div>

                <RoleSwitcher />
            </div>
        </div>
    )
}
