import { createContext } from "react"

import type { AppUser } from "@/components/types/user"

export interface UserContextType {
    user: AppUser | null
    isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
