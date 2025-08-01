export interface Match {
    id?: string
    id_tournament: string
    id_first_team: string
    id_second_team: string
    name_tournament: string
    name_first_team: string
    name_second_team: string
    plannedAt: string
    executed: boolean
    goals_first_team?: number | null
    goals_second_team?: number | null
    executedAt?: string | null
}