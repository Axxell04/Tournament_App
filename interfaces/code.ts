export interface Code {
    id?: string
    ownerId: string
    claimedId?: string
    text: string
    value: number
    claimed: boolean
    createdAt: string
}