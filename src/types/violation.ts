import type { FieldValue, Timestamp } from "firebase/firestore"

export interface Violation {
    id: string
    studentId: string

    name: string
    violationType: string
    remarks: string
    agencyId: string
    agencyName: string
    reportedBy: {
        id: string
        name: string
    }

    createdAt: Date | Timestamp | FieldValue | null
    updatedAt: Date | Timestamp | FieldValue | null
}
