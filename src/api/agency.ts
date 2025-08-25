import { db } from "@/service/firebase/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

export interface Agency {
    uid: string
    name: string
    address?: string
}

export async function fetchAgency(uid: string): Promise<Agency | null> {
    const agencyRef = doc(db, "agencies", uid)
    const agencySnap = await getDoc(agencyRef)

    if (!agencySnap.exists()) return null

    return { uid: agencySnap.id, ...agencySnap.data() } as Agency
}

export async function createAgency(data: {
    name: string
    address?: string
    ownerId: string
    ownerName: string
}): Promise<void> {
    const agencyRef = doc(db, "agencies", data.ownerId)

    await setDoc(
        agencyRef,
        {
            name: data.name,
            address: data.address ?? null,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    )
}
