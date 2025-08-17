import { db } from "@/service/firebase/firebase"
import { writeBatch, doc } from "firebase/firestore"
import { faker } from "@faker-js/faker"

interface Student {
    uid: string
    username: string
    firstName: string
    middleName?: string
    lastName: string
    studentID: string
    program: string
    yearLevel: string
    section: string
}

function generateFakeStudents(count: number): Student[] {
    return Array.from({ length: count }, () => {
        const uid = faker.string.uuid()
        return {
            uid,
            username: faker.internet.displayName(),
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            studentID: faker.string.alphanumeric(8).toUpperCase(),
            program: faker.helpers.arrayElement(["BSIT", "BSCS", "BSBA"]),
            yearLevel: faker.number.int({ min: 1, max: 4 }).toString(),
            section: faker.helpers.arrayElement(["A", "B", "C"]),
        }
    })
}

export async function seedStudents(count = 20): Promise<void> {
    const batch = writeBatch(db)

    const studentsData = generateFakeStudents(count)

    studentsData.forEach((student) => {
        const ref = doc(db, "students", student.uid)
        batch.set(ref, student)
    })

    await batch.commit()
    console.log(`${count} students seeded successfully!`)
}
