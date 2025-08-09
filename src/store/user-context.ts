import { createContext } from "react"

export interface Profile {
    email: string
    role: string
    createdAt: Date
}

export interface AppUser {
    uid: string
    email: string | null
    displayName: string | null
    photoUrl: string | null
    profile: Profile | null
}

export interface UserContextType {
    user: AppUser | null
    isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
