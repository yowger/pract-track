import type { Agency } from "@/api/agency"
import type { FieldValue, Timestamp } from "firebase/firestore"

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
    id: string
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
    assignedAgencyID: string | null
    assignedAgencyName: string | null
    assignedAdviserID: string | null
    assignedAdviserName: string | null
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
    assignedSchedule?: {
        id: string
        name: string
    }
    evaluations?: {
        evaluator: {
            id: string
            docID: string
            name: string
        }
        agency: {
            id: string
            name: string
        }
        createdAt: Date | Timestamp | FieldValue
        updatedAt: Date | Timestamp | FieldValue
    }[]
    evaluatedByAgencies?: string[]
    violationCount?: number
}

export interface PracticumAdviser {
    studentCount: number
    department: string
}

export interface ChairPerson {
    placeholder: ""
}

export interface AgencySupervisor {
    uid: string
    position: string
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}

export type AppUser =
    | (Profile & { role: "student" } & { studentData: Student })
    | (Profile & { role: "practicum_adviser" } & {
          adviserData: PracticumAdviser
      })
    | (Profile & { role: "chair_person" } & { chairData: ChairPerson })
    | (Profile & { role: "agency_supervisor" } & {
          supervisorData: AgencySupervisor
          companyData?: Agency
      })
    | (Profile & { role: null })

export function isStudent(
    user: AppUser
): user is Profile & { role: "student"; studentData: Student } {
    return user.role === "student"
}

export function isAgency(
    user: AppUser
): user is AppUser & { role: "agency_supervisor"; companyData?: Agency } {
    return user.role === "agency_supervisor"
}

export function isPracticumAdviser(user: AppUser): user is Profile & {
    role: "practicum_adviser"
    adviserData: PracticumAdviser
} {
    return user.role === "practicum_adviser"
}

export function isChairPerson(
    user: AppUser
): user is Profile & { role: "chair_person"; chairData: ChairPerson } {
    return user.role === "chair_person"
}
