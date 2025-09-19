// import { useState } from "react"
// import { QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"

// import { isStudent } from "@/types/user"
// import { getStudentsPaginated } from "@/api/students"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// export default function StudentManagerDashboardPage() {
//     const PAGE_SIZE = 10

//     // const [students, setStudents] = useState<AppUser[]>([])
//     // const [firstDoc, setFirstDoc] =
//     //     useState<QueryDocumentSnapshot<DocumentData> | null>(null)
//     // const [lastDoc, setLastDoc] =
//     //     useState<QueryDocumentSnapshot<DocumentData> | null>(null)
//     // const [prevDocs, setPrevDocs] = useState<
//     //     QueryDocumentSnapshot<DocumentData>[]
//     // >([])
//     const [loading, setLoading] = useState(false)
//     const [search, setSearch] = useState("")

//     const {  } = getStudentsPaginated({
//         numPerPage: PAGE_SIZE,
//         filter: {
//             status: undefined,
//             program: undefined,
//             yearLevel: undefined,
//         },
//     })

//     async function loadStudents(next = true) {
//         if (loading) return
//         setLoading(true)

//         setStudents(data)

//         // if (next) {
//         //     if (newLastDoc) setPrevDocs((prev) => [...prev, newLastDoc])
//         // } else {
//         //     setPrevDocs((prev) => prev.slice(0, prev.length - 1))
//         // }

//         setLoading(false)
//     }

//     // useEffect(() => {
//     //     loadStudents(true)
//     // }, [search])

//     const filteredStudents = students.filter((s) =>
//         s.displayName?.toLowerCase().includes(search.toLowerCase())
//     )

//     return (
//         <div className="space-y-6 p-6">
//             {/* Dashboard cards */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Total Students</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-2xl font-bold">{students.length}</p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Active</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-2xl font-bold">
//                             {
//                                 students.filter(
//                                     (s) =>
//                                         isStudent(s) &&
//                                         s.studentData?.status === "active"
//                                 ).length
//                             }
//                         </p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Pending Agency</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-2xl font-bold">
//                             {
//                                 students.filter(
//                                     (s) =>
//                                         isStudent(s) &&
//                                         s.studentData?.status ===
//                                             "pending-agency"
//                                 ).length
//                             }
//                         </p>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Absent Today</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-2xl font-bold">8</p>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Filters / Search */}
//             <div className="flex items-center justify-between">
//                 <Input
//                     placeholder="Search students..."
//                     className="max-w-sm"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button>Add Student</Button>
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Student List</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead>Course</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead className="text-right">
//                                     Actions
//                                 </TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {filteredStudents.map((student) => (
//                                 <TableRow key={student.uid}>
//                                     <TableCell>{student.displayName}</TableCell>
//                                     <TableCell>
//                                         {isStudent(student) &&
//                                             student.studentData?.program}
//                                     </TableCell>
//                                     <TableCell>
//                                         {isStudent(student) &&
//                                             student.studentData?.status}
//                                     </TableCell>
//                                     <TableCell className="text-right space-x-2">
//                                         <Button size="sm" variant="outline">
//                                             View
//                                         </Button>
//                                         <Button size="sm">Assign</Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>

//                     {/* Next / Previous */}
//                     <div className="flex justify-center mt-4 space-x-2">
//                         <Button
//                             onClick={() => loadStudents(false)}
//                             disabled={prevDocs.length < 2 || loading}
//                         >
//                             Previous
//                         </Button>
//                         <Button
//                             onClick={() => loadStudents(true)}
//                             disabled={!lastDoc || loading}
//                         >
//                             Next
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

export default function StudentManagerDashboard() {
    return <div>Student manager dashboard</div>
}
