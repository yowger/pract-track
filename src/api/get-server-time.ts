import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

export async function getServerTimeOffset(): Promise<number> {
    const tempRef = doc(db, "time", "temp")
    await setDoc(tempRef, { ts: serverTimestamp() })

    const snap = await getDoc(tempRef)
    const data = snap.data()

    if (!data?.ts) {
        throw new Error("Failed to fetch server time")
    }

    return data.ts.toMillis() - Date.now()
}

export async function getServerDate(): Promise<Date> {
    const offset = await getServerTimeOffset()
    return new Date(Date.now() + offset)
}
