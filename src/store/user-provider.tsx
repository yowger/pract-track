import { useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/service/firebase/firebase"
import { UserContext } from "@/store/user-context"
import type { AppUser, Profile } from "@/types/user"
import {
    fetchAgencySupervisorData,
    fetchChairPersonData,
    fetchPracticumAdviserData,
    fetchStudentData,
    fetchUserProfile,
} from "@/api/users"

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | Profile | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("🚀 ~ UserProvider ~ firebaseUser:", firebaseUser)
            if (!firebaseUser) {
                setUser(null)
                setLoading(false)

                return
            }

            try {
                const profile = await fetchUserProfile(firebaseUser.uid)
                let fullUser: AppUser | Profile | null = null

                const baseUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName,
                    photoUrl: firebaseUser.photoURL,
                    profile,
                    role: null,
                }

                console.log("cool")

                switch (profile?.role) {
                    case "student": {
                        const studentData = await fetchStudentData(
                            firebaseUser.uid
                        )

                        if (!studentData) {
                            fullUser = profile

                            return
                        }

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

                        if (!adviserData) {
                            fullUser = profile

                            return
                        }

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

                        if (!chairData) {
                            fullUser = profile

                            return
                        }

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

                        if (!supervisorData) {
                            fullUser = profile

                            return
                        }

                        fullUser = {
                            ...baseUser,
                            profile: { ...profile, role: "agency_supervisor" },
                            supervisorData,
                        }
                        break
                    }
                    default:
                        console.log("cool 2")
                        fullUser = profile
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
