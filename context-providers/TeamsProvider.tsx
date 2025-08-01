import { Team } from "@/interfaces/team";
import React, { createContext, useState } from "react";

interface TeamContextValue {
    teams: Team[]
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>
}

export const TeamContext = createContext<TeamContextValue>({
    teams: [],
    setTeams: () => {}
});

export default function TeamsProvider ({ children }: { children: React.ReactNode }) {
    const [ teams, setTeams ] = useState<Team[]>([]);
    return (
        <TeamContext.Provider value={{ teams, setTeams }}>
            {children}
        </TeamContext.Provider>
    )
}