import { useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/service/firebase/firebase"
import { UserContext, type AppUser, type Profile } from "@/store/user-context"

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid)
                const docSnap = await getDoc(docRef)

                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoUrl: currentUser.photoURL,
                    profile: docSnap.exists()
                        ? (docSnap.data() as Profile)
                        : null,
                })
            } else {
                setUser(null)
            }

            setLoading(false)
        })

        return unsubscribe
    }, [])

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}
