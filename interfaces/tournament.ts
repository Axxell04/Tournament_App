type Sport = "Fútbol" | "Baloncesto";

export interface Tournament {
    id: number
    name: string
    sport: Sport
    creator: string
    active: boolean
    createdAt?: string
    finishedAt?: string | null
}

export interface NewTournament{
    name: string
    sport: Sport
    creator: string
}