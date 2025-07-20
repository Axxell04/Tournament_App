type Sport = "Fútbol" | "Baloncesto";

export interface Tournament {
    id: number
    name: string
    sport: Sport
    creator: string
    active: boolean
}