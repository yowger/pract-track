import { addDoc, collection, serverTimestamp } from "firebase/firestore"

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
