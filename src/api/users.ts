import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import type {
    AgencySupervisor,
    AppUser,
    ChairPerson,
    PracticumAdviser,
    Profile,
    Role,
    Student,
} from "@/types/user"
import { db } from "@/service/firebase/firebase"

export async function fetchUserProfile(uid: string): Promise<Profile | null> {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    const userExist = userSnap.exists()

    if (!userExist) return null

    return userSnap.data() as Profile
}

export async function createUser(data: {
    uid: string
    email: string
    role?: Role
}): Promise<Profile | null> {
    const userRef = doc(db, "users", data.uid)

    await setDoc(userRef, {
        email: data.email,
        role: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    const snap = await getDoc(userRef)
    if (!snap.exists()) return null

    const newData = snap.data()

    return {
        ...newData,
        createdAt: newData.createdAt.toDate(),
        updatedAt: newData.updatedAt.toDate(),
    } as Profile
}

export async function createChairperson(data: {
    uid: string
    username: string
    firstName: string
    middleName?: string
    lastName: string
    position: string
}): Promise<void> {
    const chairRef = doc(db, "chair_persons", data.uid)
    const userRef = doc(db, "users", data.uid)

    await Promise.all([
        setDoc(
            chairRef,
            {
                uid: data.uid,
                username: data.username,
                position: data.position,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),

        setDoc(
            userRef,
            {
                firstName: data.firstName,
                middleName: data.middleName ?? null,
                lastName: data.lastName,
                role: "chair_person",
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),
    ])
}

export async function createAgencySupervisor(data: {
    uid: string
    username: string
    firstName: string
    middleName?: string
    lastName: string
    position: string
    agencyId?: string
}): Promise<void> {
    const supervisorRef = doc(db, "agency_supervisors", data.uid)
    const userRef = doc(db, "users", data.uid)

    await Promise.all([
        setDoc(
            supervisorRef,
            {
                uid: data.uid,
                username: data.username,
                position: data.position,
                agencyId: data.agencyId ?? null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),

        setDoc(
            userRef,
            {
                firstName: data.firstName,
                middleName: data.middleName ?? null,
                lastName: data.lastName,
                role: "agency_supervisor",
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),
    ])
}

export async function fetchStudentData(uid: string): Promise<Student | null> {
    const studentRef = doc(db, "students", uid)
    const docSnap = await getDoc(studentRef)
    const studentExist = docSnap.exists()

    if (!studentExist) return null

    return docSnap.data() as Student
}

export async function fetchPracticumAdviserData(
    uid: string
): Promise<PracticumAdviser | null> {
    const docSnap = await getDoc(doc(db, "practicum_advisers", uid))

    if (!docSnap.exists()) return null

    return docSnap.data() as PracticumAdviser
}

export async function fetchChairPersonData(
    uid: string
): Promise<ChairPerson | null> {
    const docSnap = await getDoc(doc(db, "chair_persons", uid))

    if (!docSnap.exists()) return null

    return docSnap.data() as ChairPerson
}

export async function fetchAgencySupervisorData(
    uid: string
): Promise<AgencySupervisor | null> {
    const docSnap = await getDoc(doc(db, "agency_supervisors", uid))

    if (!docSnap.exists()) return null

    return docSnap.data() as AgencySupervisor
}

export function isAppUser(u: AppUser | Profile | null): u is AppUser {
    const result = !!u && "profile" in u
    console.log("isAppUser?", result, u)
    return result
}
