import { db } from "@/service/firebase/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

export interface Agency {
    id: string
    name: string
    address?: string
    ownerId: string
    ownerName: string
    createdAt?: Date
    updatedAt?: Date
}

export async function fetchAgency(ownerId: string): Promise<Agency | null> {
    const agencyRef = doc(db, "agencies", ownerId)
    const agencySnap = await getDoc(agencyRef)

    if (!agencySnap.exists()) return null

    const data = agencySnap.data()

    return {
        id: agencySnap.id,
        name: data.name,
        address: data.address ?? undefined,
        ownerId: data.ownerId,
        ownerName: data.ownerName,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
    }
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
