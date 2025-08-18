import {
    collection,
    getDocs,
    limit,
    query,
    startAfter,
    endBefore,
    limitToLast,
    where,
    orderBy,
    DocumentSnapshot,
    getCountFromServer,
    QueryConstraint,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"
import { type Student } from "@/types/user"

interface StudentFilter {
    firstName?: string
    lastName?: string
    program?: string
    yearLevel?: string
    section?: string
    status?: string
}

interface GetUsersPaginatedParams {
    direction?: "next" | "prev"
    numPerPage?: number
    startAfterDoc?: DocumentSnapshot
    endBeforeDoc?: DocumentSnapshot
    filter?: StudentFilter
}

export async function getStudentsPaginated({
    direction = "next",
    numPerPage = 20,
    startAfterDoc,
    endBeforeDoc,
    filter = {},
}: GetUsersPaginatedParams) {
    const studentsCollection = collection(db, "students")

    const clauses: QueryConstraint[] = []

    if (filter.firstName) {
        const lowerFirst = filter.firstName.toLowerCase()
        clauses.push(
            where("firstName", ">=", lowerFirst),
            where("firstName", "<", lowerFirst + "\uf8ff")
        )
    }

    if (filter.lastName) {
        const lowerLast = filter.lastName.toLowerCase()
        clauses.push(
            where("lastName", ">=", lowerLast),
            where("lastName", "<", lowerLast + "\uf8ff")
        )
    }

    if (filter.program)
        clauses.push(where("program", "==", filter.program.toLowerCase()))
    if (filter.yearLevel)
        clauses.push(where("yearLevel", "==", filter.yearLevel.toLowerCase()))
    if (filter.section)
        clauses.push(where("section", "==", filter.section.toLowerCase()))
    if (filter.status)
        clauses.push(where("status", "==", filter.status.toLowerCase()))

    const baseQuery = query(
        studentsCollection,
        ...clauses,
        orderBy("createdAt", "desc")
    )

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

    const studentSnapshot = await getDocs(paginatedQuery)
    const countSnap = await getCountFromServer(baseQuery)

    const students: Student[] = studentSnapshot.docs.map(
        (doc) => ({ ...doc.data(), uid: doc.id } as unknown as Student)
    )

    const firstDoc = studentSnapshot.docs[0]
    const lastDoc = studentSnapshot.docs[studentSnapshot.docs.length - 1]

    return {
        result: students,
        firstDoc,
        lastDoc,
        totalItems: countSnap.data().count,
    }
}
