import { Tournament } from "@/interfaces/tournament";
import React, { createContext, useState } from "react";

interface TournamentContextValue {
    tournaments: Tournament[]
    setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>
}

export const TournametContext = createContext<TournamentContextValue>({
    tournaments: [],
    setTournaments: () => {}
});

export default function TournamentsProvider ({ children }: { children: React.ReactNode }) {
    const [ tournaments, setTournaments ] = useState<Tournament[]>([]);
    return (
        <TournametContext.Provider value={{ tournaments, setTournaments }}>
            {children}
        </TournametContext.Provider>
    )
}