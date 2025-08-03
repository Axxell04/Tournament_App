export type BetPrediction = "1 > 2" | "1 < 2" | "1 === 2";

export interface Bet {
    id?: string
    id_match: string
    id_tournament: string
    id_user: string
    value: number
    prediction: BetPrediction
    won?: boolean
}