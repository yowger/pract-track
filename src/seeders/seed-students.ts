import { db } from "@/service/firebase/firebase"
import {
    writeBatch,
    doc,
    serverTimestamp,
    FieldValue,
} from "firebase/firestore"
import { faker } from "@faker-js/faker"
import type { Profile, Student } from "@/types/user"

export type NewProfile = Omit<Profile, "createdAt" | "updatedAt"> & {
    createdAt: FieldValue
    updatedAt: FieldValue
}

function generateFakeUserAndStudent(): { user: NewProfile; student: Student } {
    const uid = faker.string.uuid()

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const displayName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`

    const user: NewProfile = {
        uid,
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        displayName,
        photoUrl: faker.image.avatar(),
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }

    const student: Student = {
        studentID: faker.string.alphanumeric(8).toUpperCase(),
        program: faker.helpers.arrayElement(["BSIT", "BSCS", "BSBA"]),
        yearLevel: faker.number.int({ min: 1, max: 4 }).toString(),
        section: faker.helpers.arrayElement(["A", "B", "C"]),
        status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
        assignedAgencyID: "",
    }

    return { user, student }
}

export async function seedStudents(count = 20): Promise<void> {
    const batch = writeBatch(db)

    for (let i = 0; i < count; i++) {
        const { user, student } = generateFakeUserAndStudent()

        const userRef = doc(db, "users", user.uid)
        const studentRef = doc(db, "students", user.uid)

        batch.set(userRef, user)
        batch.set(studentRef, student)
    }

    await batch.commit()
    console.log(`${count} users + students seeded successfully!`)
}
