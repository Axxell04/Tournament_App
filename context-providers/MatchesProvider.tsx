import { Match } from "@/interfaces/match";
import React, { createContext, useState } from "react";

interface MatchContextValue {
    matches: Match[]
    setMatches: React.Dispatch<React.SetStateAction<Match[]>>
    matchSelected?: Match
    setMatchSelected: React.Dispatch<React.SetStateAction<Match | undefined>>
}

export const MatchContext = createContext<MatchContextValue>({
    matches: [],
    setMatches: () => {},
    matchSelected: undefined,
    setMatchSelected: () => {}
});

export default function MatchesProvider ({ children }: { children: React.ReactNode }) {
    const [ matches, setMatches ] = useState<Match[]>([]);
    const [ matchSelected, setMatchSelected ] = useState<Match | undefined>();
    return (
        <MatchContext.Provider value={{ matches, setMatches, matchSelected, setMatchSelected }}>
            {children}
        </MatchContext.Provider>
    )
}