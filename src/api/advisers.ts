import {
    collection,
    getDocs,
    query,
    where,
    Timestamp,
    type DocumentData,
    doc,
    serverTimestamp,
    setDoc,
    getDoc,
} from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { AppUser } from "@/types/user"

export async function getPracticumAdvisers(): Promise<AppUser[]> {
    const colRef = collection(db, "users")

    const q = query(colRef, where("role", "==", "practicum_adviser"))

    const snapshot = await getDocs(q)

    const advisers: AppUser[] = snapshot.docs.map((doc) => {
        const d = doc.data() as DocumentData

        return {
            uid: doc.id,
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            displayName: d.displayName ?? null,
            photoUrl: d.photoUrl ?? null,
            role: d.role,
            createdAt:
                d.createdAt instanceof Timestamp
                    ? d.createdAt
                    : Timestamp.fromDate(new Date()),
            updatedAt:
                d.updatedAt instanceof Timestamp
                    ? d.updatedAt
                    : Timestamp.fromDate(new Date()),
            adviserData: {
                department: d.adviserData?.department ?? "",
                studentCount: d.adviserData?.studentCount ?? 0,
            },
        } as AppUser
    })

    return advisers
}

export interface CreatePracticumAdviserInput {
    uid: string
    firstName: string
    lastName: string
    email: string
    displayName?: string | null
    photoUrl?: string | null
    department: string
}

export async function createPracticumAdviser(
    data: Partial<CreatePracticumAdviserInput>
): Promise<AppUser> {
    const usersRef = collection(db, "users")
    const userDoc = doc(usersRef, data.uid)

    const payload = {
        uid: data.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        photoUrl: data.photoUrl ?? null,
        role: "practicum_adviser",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        adviserData: {
            department: data.department,
            studentCount: 0,
        },
    }

    await setDoc(userDoc, payload, { merge: true })

    return payload as AppUser
}

export async function getPracticumAdviser(
    uid: string
): Promise<AppUser | null> {
    const userRef = doc(db, "users", uid)
    const snap = await getDoc(userRef)

    if (!snap.exists()) {
        return null
    }

    const d = snap.data() as DocumentData

    return {
        uid: snap.id,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        displayName: d.displayName ?? null,
        photoUrl: d.photoUrl ?? null,
        role: d.role,
        createdAt:
            d.createdAt instanceof Timestamp
                ? d.createdAt
                : Timestamp.fromDate(new Date()),
        updatedAt:
            d.updatedAt instanceof Timestamp
                ? d.updatedAt
                : Timestamp.fromDate(new Date()),
        adviserData: {
            department: d.adviserData?.department ?? "",
            studentCount: d.adviserData?.studentCount ?? 0,
        },
    } as AppUser
}
