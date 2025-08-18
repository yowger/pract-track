import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import type {
    AgencySupervisor,
    AppUser,
    ChairPerson,
    PracticumAdviser,
    Profile,
    Student,
} from "@/types/user"
import { db } from "@/service/firebase/firebase"

export async function createUser(
    data: Omit<Profile, "createdAt" | "updatedAt">
): Promise<Profile | null> {
    const userRef = doc(db, "users", data.uid)

    await setDoc(userRef, {
        ...data,
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
    firstName: string
    lastName: string
    position: string
}): Promise<void> {
    const chairRef = doc(db, "chair_persons", data.uid)
    const userRef = doc(db, "users", data.uid)

    const displayName = `${data.firstName.toLowerCase()} ${data.lastName.toLowerCase()}`

    await Promise.all([
        setDoc(
            chairRef,
            {
                uid: data.uid,
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
                lastName: data.lastName,
                displayName,
                role: "chair_person",
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),
    ])
}

export async function createStudent(data: {
    uid: string
    firstName: string
    lastName: string
    studentID: string
    program: string
    yearLevel: string
    section: string
}) {
    const displayName = `${data.firstName.toLowerCase()} ${data.lastName.toLowerCase()}`

    await setDoc(
        doc(db, "users", data.uid),
        {
            firstName: data.firstName,
            displayName,
            lastName: data.lastName,
            role: "student",
            updatedAt: new Date(),
        },
        { merge: true }
    )

    await setDoc(
        doc(db, "students", data.uid),
        {
            studentID: data.studentID,
            program: data.program,
            yearLevel: data.yearLevel,
            section: data.section,
            status: "",
            assignAgencyID: "",
        },
        { merge: true }
    )
}

export async function createAgencySupervisor(data: {
    uid: string
    firstName: string
    lastName: string
    position: string
    agencyId?: string
}): Promise<void> {
    const supervisorRef = doc(db, "agency_supervisors", data.uid)
    const userRef = doc(db, "users", data.uid)

    const displayName = `${data.firstName.toLowerCase()} ${data.lastName.toLowerCase()}`

    await Promise.all([
        setDoc(
            supervisorRef,
            {
                uid: data.uid,
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
                lastName: data.lastName,
                displayName,
                role: "agency_supervisor",
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        ),
    ])
}

export async function fetchUserProfile(uid: string): Promise<Profile | null> {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    const userExist = userSnap.exists()

    if (!userExist) return null

    return userSnap.data() as Profile
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
