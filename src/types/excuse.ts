import type { FieldValue, Timestamp } from "firebase/firestore"

export interface ExcuseRequest {
    id: string
    date: Date | Timestamp | FieldValue
    studentId: string
    studentName: string
    attendanceId: string | null
    agencyId: string
    agencyName: string
    title: string
    reason: string
    filesUrl?: string[]
    filesName?: string[]
    photosUrl?: string[]
    status: "pending" | "approved" | "rejected"
    reviewedBy?: string
    reviewedByName?: string
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
