import { Match } from "@/interfaces/match";
import React, { createContext, useState } from "react";

interface MatchContextValue {
    matches: Match[]
    setMatches: React.Dispatch<React.SetStateAction<Match[]>>
}

export const MatchContext = createContext<MatchContextValue>({
    matches: [],
    setMatches: () => {}
});

export default function MatchesProvider ({ children }: { children: React.ReactNode }) {
    const [ matches, setMatches ] = useState<Match[]>([]);
    return (
        <MatchContext.Provider value={{ matches, setMatches }}>
            {children}
        </MatchContext.Provider>
    )
}