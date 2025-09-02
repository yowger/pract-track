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
    writeBatch,
    doc,
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
    assignedAgencyId?: string
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
    if (filter.assignedAgencyId)
        clauses.push(where("assignedAgencyID", "==", filter.assignedAgencyId))

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

interface StudentFilter {
    assignedAgencyID?: string
    status?: string
    scheduleId?: string
}

export async function getAllStudents(
    filter: StudentFilter = {}
): Promise<Student[]> {
    const studentsRef = collection(db, "students")
    const clauses: QueryConstraint[] = []

    if (filter.assignedAgencyID) {
        clauses.push(where("assignedAgencyID", "==", filter.assignedAgencyID))
    }

    if (filter.status) {
        clauses.push(where("status", "==", filter.status))
    }

    if (filter.scheduleId) {
        clauses.push(where("assignedSchedule.id", "==", filter.scheduleId))
    }

    const q = clauses.length > 0 ? query(studentsRef, ...clauses) : studentsRef
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Student),
    }))
}

interface UpdateStudentsScheduleParams {
    studentIds: string[]
    scheduleId: string
    newName: string
}

export async function updateStudentsScheduleByIds({
    studentIds,
    scheduleId,
    newName,
}: UpdateStudentsScheduleParams) {
    if (!studentIds.length) return

    const studentsRef = collection(db, "students")
    const q = query(studentsRef, where("studentID", "in", studentIds))
    const snap = await getDocs(q)

    if (snap.empty) {
        console.log("No matching students found for the given IDs.")
        return
    }

    const batch = writeBatch(db)

    snap.forEach((studentDoc) => {
        const studentRef = doc(db, "students", studentDoc.id)
        batch.update(studentRef, {
            assignedSchedule: {
                id: scheduleId,
                name: newName,
            },
        })
    })

    await batch.commit()
}
