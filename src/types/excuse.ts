import type { FieldValue, Timestamp } from "firebase/firestore"

export interface ExcuseRequest {
    id: string
    studentId: string
    attendanceId: string | null
    title: string
    reason: string
    filesUrl?: string[]
    photosUrl?: string[]
    status: "pending" | "approved" | "rejected"
    reviewedBy?: string
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
