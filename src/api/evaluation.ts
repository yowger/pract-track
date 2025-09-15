import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { Evaluation } from "@/types/evaluation"

export async function createEvaluation(data: Evaluation) {
    const docRef = await addDoc(collection(db, "evaluations"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    return { id: docRef.id, ...data }
}

type FilterOptions = {
    agencyId?: string
    studentId?: string
    evaluatorId?: string
    limitCount?: number
}

export async function getEvaluations(filters: FilterOptions = {}) {
    const evaluationsRef = collection(db, "evaluations")

    const conditions = []
    if (filters.agencyId) {
        conditions.push(where("agency.id", "==", filters.agencyId))
    }
    if (filters.studentId) {
        conditions.push(where("student.id", "==", filters.studentId))
    }
    if (filters.evaluatorId) {
        conditions.push(where("evaluator.id", "==", filters.evaluatorId))
    }

    let q = query(evaluationsRef, ...conditions, orderBy("createdAt", "desc"))

    if (filters.limitCount) {
        q = query(q, limit(filters.limitCount))
    }

    const snapshot = await getDocs(q)

    const evaluations: (Evaluation & { id: string })[] = snapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Evaluation & { id: string })
    )

    return evaluations
}

export async function getEvaluation(uid: string) {
    const evaluationRef = doc(db, "evaluations", uid)
    const snapshot = await getDoc(evaluationRef)

    if (!snapshot.exists()) {
        return null
    }

    return { id: snapshot.id, ...snapshot.data() } as Evaluation & {
        id: string
    }
}
