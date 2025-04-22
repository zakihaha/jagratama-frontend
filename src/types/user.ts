export type User = {
    id: string
    name: string
    email: string
    role: {
        id: number
        name: string
    }
    position: {
        id: number
        name: string
    }
}
