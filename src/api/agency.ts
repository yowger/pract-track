import { db } from "@/service/firebase/firebase"
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    collection,
    getDocs,
    writeBatch,
    query,
    orderBy,
    limit,
    increment,
} from "firebase/firestore"

import {} from "firebase/firestore"

export interface Agency {
    id: string
    name: string
    address?: string
    ownerId: string
    ownerName: string
    studentCount?: number
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

export async function searchAgencies(
    search: string,
    limitCount = 10
): Promise<Agency[]> {
    const agenciesCol = collection(db, "agencies")

    const q = query(
        agenciesCol,
        orderBy("createdAt", "desc"),
        limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const results: Agency[] = []

    snapshot.forEach((doc) => {
        const data = doc.data()
        if (!search || data.name.toLowerCase().includes(search.toLowerCase())) {
            results.push({
                id: doc.id,
                name: data.name,
                address: data.address ?? undefined,
                ownerId: data.ownerId,
                ownerName: data.ownerName,
                createdAt: data.createdAt?.toDate?.(),
                updatedAt: data.updatedAt?.toDate?.(),
            })
        }
    })

    return results
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

export async function assignStudentsToAgency(data: {
    studentIds: string[]
    agencyId: string
    agencyName: string
}) {
    const { studentIds, agencyId, agencyName } = data

    const batch = writeBatch(db)

    studentIds.forEach((studentId) => {
        const studentRef = doc(db, "students", studentId)

        batch.update(studentRef, {
            assignedAgencyID: agencyId,
            assignedAgencyName: agencyName,
            updatedAt: serverTimestamp(),
        })
    })

    const agencyRef = doc(db, "agencies", agencyId)
    batch.update(agencyRef, {
        studentCount: increment(studentIds.length),
    })

    await batch.commit()
}
