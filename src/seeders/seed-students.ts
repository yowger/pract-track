// import { db } from "@/service/firebase/firebase"
// import {
//     writeBatch,
//     doc,
//     serverTimestamp,
//     FieldValue,
// } from "firebase/firestore"
// import { faker } from "@faker-js/faker"
// import type { Profile, Student } from "@/types/user"

// export type NewProfile = Omit<Profile, "createdAt" | "updatedAt"> & {
//     createdAt: FieldValue
//     updatedAt: FieldValue
// }

// export type NewStudent = Omit<Student, "createdAt" | "updatedAt"> & {
//     createdAt: FieldValue
//     updatedAt: FieldValue
// }

// function generateFakeUserAndStudent(): {
//     user: NewProfile
//     student: NewStudent
// } {
//     const uid = faker.string.uuid()

//     const firstName = faker.person.firstName().toLowerCase()
//     const lastName = faker.person.lastName().toLowerCase()

//     const displayName = `${firstName} ${lastName}`.toLowerCase()

//     const user: NewProfile = {
//         uid,
//         firstName,
//         lastName,
//         email: faker.internet.email({ firstName, lastName }).toLowerCase(),
//         displayName,
//         photoUrl: faker.image.avatar(),
//         role: "student",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//     }

//     const student: NewStudent = {
//         uid,
//         studentID: faker.string.alphanumeric(8).toLowerCase(),
//         program: faker.helpers.arrayElement(["bsit", "bscs", "bsba"]),
//         yearLevel: faker.number
//             .int({ min: 1, max: 4 })
//             .toString()
//             .toLowerCase(),
//         section: faker.helpers.arrayElement(["a", "b", "c"]),
//         status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
//         assignedAgencyID: "",
//         firstName,
//         lastName,
//         email: user.email,
//         displayName,
//         photoUrl: user.photoUrl,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//     }

//     return { user, student }
// }

// export async function seedStudents(count = 20): Promise<void> {
//     const batch = writeBatch(db)

//     for (let i = 0; i < count; i++) {
//         const { user, student } = generateFakeUserAndStudent()

//         const userRef = doc(db, "users", user.uid)
//         const studentRef = doc(db, "students", user.uid)

//         batch.set(userRef, user)
//         batch.set(studentRef, student)
//     }

//     await batch.commit()
//     console.log(`${count} users + students seeded successfully!`)
// }
