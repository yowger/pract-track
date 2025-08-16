import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import type {
    AgencySupervisor,
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

interface CreateUserParams {
    uid: string
    email: string
    role?: Role | null
}

export async function createUser({
    uid,
    email,
    role = null,
}: CreateUserParams): Promise<Profile | null> {
    const userRef = doc(db, "users", uid)

    await setDoc(userRef, {
        email,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    const snap = await getDoc(userRef)
    if (!snap.exists()) return null

    const data = snap.data()
    return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    } as Profile
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
