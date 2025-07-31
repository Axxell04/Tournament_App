type Sport = "Fútbol" | "Baloncesto";

export interface Tournament {
    id?: string
    name: string
    sport: Sport
    ownerId: string
    ownerName?: string
    active: boolean
    createdAt?: string
    finishedAt?: string | null
}