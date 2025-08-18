import {
    collection,
    getDocs,
    getDoc,
    doc,
    limit,
    query,
    startAfter,
    endBefore,
    limitToLast,
    where,
    orderBy,
    type DocumentData,
    QueryDocumentSnapshot,
    DocumentSnapshot,
    getCountFromServer,
    Query,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"
import { type AppUser, type Profile, type Student } from "@/types/user"

interface GetUsersWithStudentsOptions {
    pageSize?: number
    cursorDoc?: QueryDocumentSnapshot<DocumentData> | null
    previous?: boolean
    filters?: {
        program?: string
        yearLevel?: string
        status?: string
    }
}

export async function getUsersWithStudents({
    pageSize = 10,
    cursorDoc = null,
    previous = false,
    filters = {},
}: GetUsersWithStudentsOptions): Promise<{
    data: AppUser[]
    firstDoc: QueryDocumentSnapshot<DocumentData> | null
    lastDoc: QueryDocumentSnapshot<DocumentData> | null
}> {
    const usersRef = collection(db, "users")

    let q = query(
        usersRef,
        where("role", "==", "student"),
        orderBy("createdAt", "desc")
    )

    if (filters.program) {
        q = query(q, where("program", "==", filters.program))
    }
    if (filters.yearLevel) {
        q = query(q, where("yearLevel", "==", filters.yearLevel))
    }
    if (filters.status) {
        q = query(q, where("status", "==", filters.status))
    }

    if (cursorDoc) {
        if (previous) {
            q = query(q, endBefore(cursorDoc), limitToLast(pageSize))
        } else {
            q = query(q, startAfter(cursorDoc), limit(pageSize))
        }
    } else {
        q = query(q, limit(pageSize))
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) {
        return { data: [], firstDoc: null, lastDoc: null }
    }

    const profiles: Profile[] = snapshot.docs.map(
        (doc) => ({ ...doc.data(), uid: doc.id } as Profile)
    )

    const studentMap: Record<string, Student> = {}
    await Promise.all(
        profiles.map(async (profile) => {
            const studentSnap = await getDoc(doc(db, "students", profile.uid))
            if (studentSnap.exists()) {
                studentMap[profile.uid] = studentSnap.data() as Student
            }
        })
    )

    const users: AppUser[] = profiles.map((profile) => ({
        ...profile,
        role: "student",
        studentData: studentMap[profile.uid],
    }))

    return {
        data: users,
        firstDoc: snapshot.docs[0],
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    }
}

interface GetUsersPaginatedParams {
    cursor?: QueryDocumentSnapshot<DocumentData> | null
    direction?: "next" | "prev"
    startAfterDoc?: DocumentSnapshot
    endBeforeDoc?: DocumentSnapshot
    numPerPage?: number
    searchText?: string
}

export async function getUsersWithStudentsPaginated({
    direction = "next",
    numPerPage = 20,
    startAfterDoc,
    endBeforeDoc,
    searchText,
}: GetUsersPaginatedParams) {
    const usersCollection = collection(db, "users")

    let baseQuery = query(
        usersCollection,
        where("role", "==", "student"),
        orderBy("createdAt", "desc")
    )

    if (searchText) {
        const lower = searchText.toLowerCase()
        baseQuery = query(
            usersCollection,
            where("role", "==", "student"),
            where("displayNameLower", ">=", lower),
            where("displayNameLower", "<", lower + "\uf8ff"),
            orderBy("displayNameLower")
        )
    }

    let paginatedQuery
    if (direction === "next") {
        paginatedQuery = startAfterDoc
            ? query(baseQuery, startAfter(startAfterDoc), limit(numPerPage))
            : query(baseQuery, limit(numPerPage))
    } else {
        paginatedQuery = endBeforeDoc
            ? query(baseQuery, endBefore(endBeforeDoc), limitToLast(numPerPage))
            : query(baseQuery, limitToLast(numPerPage))
    }

    const userSnapshot = await getDocs(paginatedQuery)

    const profiles: Profile[] = userSnapshot.docs.map(
        (doc) => ({ ...doc.data(), uid: doc.id } as Profile)
    )

    const uids = profiles.map((p) => p.uid)
    const studentDocs: QueryDocumentSnapshot<Student>[] = []

    const chunks = chunkArray(uids, 10)
    for (const chunk of chunks) {
        const studentsQuery = query(
            collection(db, "students"),
            where("userId", "in", chunk)
        )
        const studentSnap = await getDocs(studentsQuery)
        studentDocs.push(
            ...(studentSnap.docs as QueryDocumentSnapshot<Student>[])
        )
    }

    const studentMap: Map<string, Student> = new Map(
        studentDocs.map((studentDoc) => [studentDoc.id, studentDoc.data()])
    )

    const profilesWithStudents: AppUser[] = profiles.map((profile) => ({
        ...profile,
        role: "student",
        studentData: studentMap.get(profile.uid) as Student,
    }))

    const firstDoc = userSnapshot.docs[0]
    const lastDoc = userSnapshot.docs[userSnapshot.docs.length - 1]

    return { result: profilesWithStudents, firstDoc, lastDoc }
}

interface GetNumPages {
    numPerPage: number
    searchText?: string
}

export async function getNumPages({
    numPerPage,
    searchText,
}: GetNumPages): Promise<number> {
    const usersCollection = collection(db, "users")

    let q: Query = query(usersCollection, where("role", "==", "student"))

    if (searchText) {
        const lower = searchText.toLowerCase()
        q = query(
            usersCollection,
            where("role", "==", "student"),
            where("displayNameLower", ">=", lower),
            where("displayNameLower", "<", lower + "\uf8ff")
        )
    }

    const countSnap = await getCountFromServer(q)
    const numPages = Math.ceil(countSnap.data().count / numPerPage)

    return numPages
}

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize))
    }
    return chunks
}
