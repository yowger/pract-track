import type { Timestamp } from "firebase/firestore"

export type Role =
    | "student"
    | "practicum_adviser"
    | "chair_person"
    | "agency_supervisor"
    | null

export interface Profile {
    uid: string
    firstName: string
    lastName: string
    email: string
    displayName: string | null
    photoUrl: string | null
    role: Role
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface Student {
    uid: string
    studentID: string
    program: string
    yearLevel: string
    section: string
    status: string
    firstName: string
    lastName: string
    email: string
    displayName: string | null
    photoUrl: string | null
    assignedAgencyID: string
}

export interface PracticumAdviser {
    department: string
}

export interface ChairPerson {
    placeholder: ""
}

export interface AgencySupervisor {
    position: string
}

export type AppUser =
    | (Profile & { role: "student" } & { studentData: Student })
    | (Profile & { role: "practicum_adviser" } & {
          adviserData: PracticumAdviser
      })
    | (Profile & { role: "chair_person" } & { chairData: ChairPerson })
    | (Profile & { role: "agency_supervisor" } & {
          supervisorData: AgencySupervisor
      })
    | (Profile & { role: null })

export function isStudent(
    user: AppUser
): user is Profile & { role: "student"; studentData: Student } {
    return user.role === "student"
}
