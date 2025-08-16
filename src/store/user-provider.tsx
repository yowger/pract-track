import { useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/service/firebase/firebase"
import { UserContext } from "@/store/user-context"
import type {
    AgencySupervisor,
    AppUser,
    BaseUser,
    ChairPerson,
    PracticumAdviser,
    Student,
} from "@/types/user"
import {
    fetchAgencySupervisorData,
    fetchChairPersonData,
    fetchPracticumAdviserData,
    fetchStudentData,
    fetchUserProfile,
} from "@/api/users"

const roleFetchers: Record<
    string,
    (
        uid: string
    ) => Promise<
        Student | PracticumAdviser | ChairPerson | AgencySupervisor | null
    >
> = {
    student: fetchStudentData,
    practicum_adviser: fetchPracticumAdviserData,
    chair_person: fetchChairPersonData,
    agency_supervisor: fetchAgencySupervisorData,
}

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

                if (!profile) {
                    setUser(null)
                    setLoading(false)

                    return
                }

                const baseUser: BaseUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "",
                    photoUrl: firebaseUser.photoURL || "",
                    profile,
                }

                const fetchedRole = roleFetchers[profile.role ?? ""]

                if (fetchedRole) {
                    const roleData = await fetchedRole(firebaseUser.uid)

                    if (!roleData) {
                        setUser({
                            ...baseUser,
                            profile: { ...profile, role: null },
                        })

                        return
                    }

                    setUser({
                        ...baseUser,
                        profile: { ...profile, role: profile.role },
                        [`${profile.role}Data`]: roleData,
                    } as AppUser)
                } else {
                    setUser({
                        ...baseUser,
                        profile: { ...profile, role: null },
                    })
                }
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
