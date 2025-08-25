import { db } from "@/service/firebase/firebase"
import type { Student } from "@/types/user"
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    collection,
    getDocs,
    writeBatch,
} from "firebase/firestore"

import {} from "firebase/firestore"

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

export async function fetchAgencies(): Promise<Agency[]> {
    const querySnap = await getDocs(collection(db, "agencies"))

    return querySnap.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
            id: docSnap.id,
            name: data.name,
            address: data.address ?? undefined,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
        } as Agency
    })
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

export async function assignStudentsToAgency(
    studentIds: string[],
    agencyId: string,
    agencyName: string
) {
    const batch = writeBatch(db)

    studentIds.forEach((studentId) => {
        const studentRef = doc(db, "students", studentId)

        const updateData: Partial<Student> = {
            assignedAgencyID: agencyId,
            assignedAgencyName: agencyName,
            updatedAt: serverTimestamp(),
        }

        batch.update(studentRef, updateData)
    })

    await batch.commit()
}
