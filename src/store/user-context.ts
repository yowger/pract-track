import { createContext } from "react"

import type { AppUser } from "@/types/user"

export interface UserContextType {
    user: AppUser | null
    setUser: (user: AppUser | null) => void
    isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
