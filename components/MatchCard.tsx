import { Match } from "@/interfaces/match";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { DBService } from "@/services/db-service";
import { CalendarCheck2, CalendarCog } from "@tamagui/lucide-icons";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Button, Paragraph, XStack, YStack } from "tamagui";

interface Props {
    match: Match
    matchSelected?: Match
    selectThisMatch: (match: Match | undefined) => void;
    setModalMatchMode: React.Dispatch<React.SetStateAction<"add" | "edit" | "solve">>
    toggleModalMatchVisible: (visible?: boolean) => void
}

export default function MatchCard ({ match, matchSelected, selectThisMatch, setModalMatchMode, toggleModalMatchVisible }: Props) {
    const db = useSQLiteContext()
    const [ tournament, setTournament ] = useState<Tournament | undefined | null>();
    const [ firstTeam, setFirstTeam ] = useState<Team | undefined | null>();
    const [ secondTeam, setSecondTeam ] = useState<Team | undefined | null>();

    const [ isSelected, setIsSelected ] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const dbService = new DBService(db);
            setTournament(await dbService.getTournamentById(match.id_tournament));
            setFirstTeam(await dbService.getTeamById(match.id_first_team));
            setSecondTeam(await dbService.getTeamById(match.id_second_team));
        }
        loadData();
    }, [db, match])

    useEffect(() => {
        if (matchSelected) {
            setIsSelected(match.id === matchSelected.id);
        } else {
            setIsSelected(false);
        }
    }, [matchSelected, match])

    return (
        <Button bg={"$background08"} rounded={"$6"} p={15} py={10} height={"min-content"}
            onPress={() => {
                if (isSelected) {
                    selectThisMatch(undefined);
                } else {
                    selectThisMatch(match);
                }
                // setModalMatchMode("edit");
                // toggleModalMatchVisible(true);
            }}
        >
            <YStack width={"100%"}>                
                <XStack justify={"center"}>
                    <Paragraph opacity={0.7} select={"none"} numberOfLines={1} maxW={"100%"}>
                        {tournament?.name ?? "Nombre del torneo"}
                    </Paragraph>
                </XStack>
                <XStack flex={1}>
                    <XStack gap={20} grow={1} justify={"center"}>
                        <YStack items={"center"}>
                            <Paragraph select={"none"}>
                                {firstTeam?.name ?? "Equipo 1"}
                            </Paragraph>
                            <Paragraph fontSize={25} opacity={0.8} select={"none"}>
                                {match.goals_first_team === null ? "-" : match.goals_first_team}
                            </Paragraph>
                        </YStack>
                        <YStack items={"center"}>
                            <Paragraph select={"none"}>
                                {secondTeam?.name ?? "Equipo 2"}
                            </Paragraph>
                            <Paragraph fontSize={25} opacity={0.8} select={"none"}>
                                {match.goals_second_team === null ? "-" : match.goals_second_team}
                            </Paragraph>
                        </YStack>
                    </XStack>
                    <YStack items={"center"} grow={0} >
                        <Paragraph opacity={0.7} select={"none"}>
                            {match.plannedAt ?? "AA-MM-DD"}
                        </Paragraph>                    
                    </YStack>
                </XStack>
                {isSelected && 
                <XStack gap={10} mt={5}>
                    <Button 
                        icon={<CalendarCog size={20} />}
                        grow={1}
                        onPress={() => {
                            setModalMatchMode("edit");
                            toggleModalMatchVisible(true);
                        }}
                    >
                        Modificar
                    </Button>
                    <Button
                        icon={<CalendarCheck2 size={20} />}
                        grow={1}
                        onPress={() => {
                            setModalMatchMode("solve");
                            toggleModalMatchVisible(true);
                        }}
                    >
                        Disputar
                    </Button>
                </XStack>                
                }
            </YStack>

        </Button>
    )
}