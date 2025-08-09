export type Role =
    | "student"
    | "practicum_adviser"
    | "chair_person"
    | "agency_supervisor"

export interface Profile {
    email: string
    role: Role
    createdAt: Date
    updatedAt: Date
}

export interface BaseUser {
    uid: string
    email: string
    displayName: string | null
    photoUrl: string | null
    profile: Profile
}

export interface Student {
    studentID: string
    program: string
    yearLevel: string
    section: string
    status: string
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
    | (BaseUser & {
          profile: Profile & { role: "student" }
          studentData: Student
      })
    | (BaseUser & {
          profile: Profile & { role: "practicum_adviser" }
          adviserData: PracticumAdviser
      })
    | (BaseUser & {
          profile: Profile & { role: "chair_person" }
          chairData: ChairPerson
      })
    | (BaseUser & {
          profile: Profile & { role: "agency_supervisor" }
          supervisorData: AgencySupervisor
      })
