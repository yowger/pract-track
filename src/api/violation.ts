import {
    collection,
    doc,
    serverTimestamp,
    writeBatch,
    increment,
    where,
    query,
    orderBy,
    getDocs,
    Timestamp,
    DocumentSnapshot,
    limit,
    startAfter,
} from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { Violation } from "@/types/violation"

export type ViolationInput = Omit<Violation, "id" | "createdAt" | "updatedAt">

export async function reportViolation(data: ViolationInput) {
    const batch = writeBatch(db)

    const violationRef = doc(collection(db, "violations"))
    batch.set(violationRef, {
        studentId: data.studentId,
        name: data.name,
        violationType: data.violationType,
        remarks: data.remarks || null,
        agencyId: data.agencyId,
        agencyName: data.agencyName,
        reportedBy: {
            id: data.reportedBy.id,
            name: data.reportedBy.name,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    const studentRef = doc(db, "students", data.studentId)
    batch.update(studentRef, {
        violationCount: increment(1),
        updatedAt: serverTimestamp(),
    })

    await batch.commit()

    return violationRef.id
}
type ViolationFilters = {
    agencyId?: string
    studentId?: string
    limitCount?: number
}

export async function getViolations(filters: ViolationFilters = {}) {
    const { agencyId, studentId, limitCount } = filters
    const violationsRef = collection(db, "violations")

    const conditions = []
    if (agencyId) {
        conditions.push(where("agencyId", "==", agencyId))
    }
    if (studentId) {
        conditions.push(where("studentId", "==", studentId))
    }

    let q = query(violationsRef, ...conditions, orderBy("createdAt", "desc"))

    if (limitCount) {
        q = query(
            violationsRef,
            ...conditions,
            orderBy("createdAt", "desc"),
            limit(limitCount)
        )
    }

    const snapshot = await getDocs(q)

    const violations: Violation[] = snapshot.docs.map((doc) => {
        const data = doc.data()

        return {
            id: doc.id,
            studentId: data.studentId,
            name: data.name,
            violationType: data.violationType,
            remarks: data.remarks,
            agencyId: data.agencyId,
            agencyName: data.agency?.name,
            reportedBy: data.reportedBy,
            createdAt:
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt,
            updatedAt:
                data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
        } as Violation
    })

    return violations
}

export interface PaginatedViolationsResult {
    violations: Violation[]
    lastDoc: DocumentSnapshot | null
}

export async function getViolationsPaginated(
    filters: ViolationFilters = {},
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot
): Promise<PaginatedViolationsResult> {
    const violationsRef = collection(db, "violations")

    const conditions = []
    if (filters.agencyId) {
        conditions.push(where("agencyId", "==", filters.agencyId))
    }
    if (filters.studentId) {
        conditions.push(where("studentId", "==", filters.studentId))
    }

    let q = query(
        violationsRef,
        ...conditions,
        orderBy("createdAt", "desc"),
        limit(pageSize)
    )

    if (lastDoc) {
        q = query(
            violationsRef,
            ...conditions,
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(pageSize)
        )
    }

    const snapshot = await getDocs(q)

    const violations: Violation[] = snapshot.docs.map((doc) => {
        const data = doc.data()

        return {
            id: doc.id,
            studentId: data.studentId,
            name: data.name,
            violationType: data.violationType,
            remarks: data.remarks,
            agencyId: data.agencyId,
            agencyName: data.agencyName,
            reportedBy: data.reportedBy,
            createdAt:
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt,
            updatedAt:
                data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
        } as Violation
    })

    return {
        violations,
        lastDoc:
            snapshot.docs.length > 0
                ? snapshot.docs[snapshot.docs.length - 1]
                : null,
    }
}
