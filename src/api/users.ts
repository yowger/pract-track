import { doc, getDoc } from "firebase/firestore"

import type {
    AgencySupervisor,
    ChairPerson,
    PracticumAdviser,
    Profile,
    Student,
} from "@/components/types/user"
import { db } from "@/service/firebase/firebase"

export async function fetchUserProfile(uid: string) {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
        throw new Error("User profile not found")
    }

    return userSnap.data() as Profile
}

export async function fetchStudentData(uid: string): Promise<Student> {
    const docSnap = await getDoc(doc(db, "students", uid))

    if (!docSnap.exists()) throw new Error("Student data not found")

    return docSnap.data() as Student
}

export async function fetchPracticumAdviserData(
    uid: string
): Promise<PracticumAdviser> {
    const docSnap = await getDoc(doc(db, "practicum_advisers", uid))

    if (!docSnap.exists()) throw new Error("Practicum adviser data not found")

    return docSnap.data() as PracticumAdviser
}

export async function fetchChairPersonData(uid: string): Promise<ChairPerson> {
    const docSnap = await getDoc(doc(db, "chair_persons", uid))

    if (!docSnap.exists()) throw new Error("Chair person data not found")

    return docSnap.data() as ChairPerson
}

export async function fetchAgencySupervisorData(
    uid: string
): Promise<AgencySupervisor> {
    const docSnap = await getDoc(doc(db, "agency_supervisors", uid))

    if (!docSnap.exists()) throw new Error("Agency supervisor data not found")

    return docSnap.data() as AgencySupervisor
}
