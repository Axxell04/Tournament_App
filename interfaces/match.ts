export interface Match {
    id: number
    id_tournament: number
    id_first_team: number
    id_second_team: number
    goals_first_team?: number | null
    goals_second_team?: number | null
    plannedAt?: string | null
    executedAt?: string | null
    executed: boolean
}

export interface NewMatch {
    id_tournament: number
    id_first_team: number
    id_second_team: number
    plannedAt: string
}