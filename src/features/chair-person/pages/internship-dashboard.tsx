import { useState, useEffect } from "react"
import type { DocumentSnapshot } from "firebase/firestore"
import type { AppUser } from "@/types/user"
import { getNumPages, getUsersWithStudentsPaginated } from "@/api/students"
import { Button } from "@/components/ui/button"

export default function InternshipDashboardPage() {
    const numPerPage = 50
    const [data, setData] = useState<AppUser[]>([])
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
    const [pages, setPages] = useState<number | null>(null)
    const [page, setPage] = useState<number>(1)
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(
        undefined
    )

    useEffect(() => {
        getNumPages({ numPerPage }).then((pages) => setPages(pages))
    }, [])

    useEffect(() => {
        const startAfterDoc = direction === "next" ? lastDoc : undefined
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined

        getUsersWithStudentsPaginated({
            direction,
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        }).then((data) => {
            setData(data.result)
            setFirstDoc(data.firstDoc)
            setLastDoc(data.lastDoc)
        })
    }, [page])

    const handlePreviousClick = () => {
        if (page === 1) return
        setDirection("prev")
        setPage((prev) => prev - 1)
    }

    const handleNextClick = () => {
        if (page === pages) return
        setDirection("next")
        setPage((prev) => prev + 1)
    }

    return (
        <div>
            <div className="grid gap-4">
                {data.map((product) => (
                    <div key={product.uid} className="flex">
                        {product.photoUrl && (
                            <img
                                src={product.photoUrl}
                                className="w-10 rounded-full"
                            />
                        )}
                        <div>{product.firstName}</div>
                        <div>{product.lastName}</div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-start space-x-2 p-4">
                <Button
                    className="btn btn-outline"
                    disabled={page === 1}
                    onClick={handlePreviousClick}
                >
                    Previous
                </Button>

                <span>
                    Page {page} of {pages}
                </span>

                <Button
                    className="btn btn-outline"
                    disabled={page === pages}
                    onClick={handleNextClick}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
