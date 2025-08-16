import { createContext } from "react"

import type { AppUser, Profile } from "@/types/user"

export interface UserContextType {
    user: AppUser | null | Profile
    isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
