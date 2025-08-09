import { useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/service/firebase/firebase"
import { UserContext } from "@/store/user-context"
import type { AppUser } from "@/components/types/user"
import {
    fetchAgencySupervisorData,
    fetchChairPersonData,
    fetchPracticumAdviserData,
    fetchStudentData,
    fetchUserProfile,
} from "@/api/users"

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null)
                setLoading(false)
                return
            }

            try {
                const profile = await fetchUserProfile(firebaseUser.uid)

                const baseUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName,
                    photoUrl: firebaseUser.photoURL,
                    profile,
                }

                let fullUser: AppUser | null = null

                switch (profile.role) {
                    case "student": {
                        const studentData = await fetchStudentData(
                            firebaseUser.uid
                        )
                        fullUser = {
                            ...baseUser,
                            profile: { ...profile, role: "student" },
                            studentData,
                        }
                        break
                    }
                    case "practicum_adviser": {
                        const adviserData = await fetchPracticumAdviserData(
                            firebaseUser.uid
                        )
                        fullUser = {
                            ...baseUser,
                            profile: { ...profile, role: "practicum_adviser" },
                            adviserData,
                        }
                        break
                    }
                    case "chair_person": {
                        const chairData = await fetchChairPersonData(
                            firebaseUser.uid
                        )
                        fullUser = {
                            ...baseUser,
                            profile: { ...profile, role: "chair_person" },
                            chairData,
                        }
                        break
                    }
                    case "agency_supervisor": {
                        const supervisorData = await fetchAgencySupervisorData(
                            firebaseUser.uid
                        )
                        fullUser = {
                            ...baseUser,
                            profile: { ...profile, role: "agency_supervisor" },
                            supervisorData,
                        }
                        break
                    }
                    default:
                        fullUser = null
                }

                setUser(fullUser)
            } catch (error) {
                console.error("Error loading user data", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        })

        return unsubscribe
    }, [])

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}
