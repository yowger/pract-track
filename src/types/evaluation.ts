export type Evaluation = {
    student: {
        id: string
        name: string
    }
    evaluator: {
        id: string
        name: string
        role: string
    }
    agency: {
        id: string
        name: string
        address: string
    }
    ratings: Record<string, number>
    comments?: string
    createdAt?: Date
    updatedAt?: Date
}
