import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Match } from "@/interfaces/match";
import { Tournament } from "@/interfaces/tournament";
import { CalendarCheck2, CalendarCog } from "@tamagui/lucide-icons";
import React, { useContext, useEffect, useState } from "react";
import { Button, Paragraph, XStack, YStack } from "tamagui";

interface Props {
    match: Match
    matchSelected?: Match
    selectThisMatch: (match: Match | undefined) => void;
    setModalMatchMode: React.Dispatch<React.SetStateAction<"add" | "edit" | "solve">>
    toggleModalMatchVisible: (visible?: boolean) => void
    myTournaments: Tournament[]
}

export default function MatchCard ({ match, matchSelected, selectThisMatch, setModalMatchMode, toggleModalMatchVisible, myTournaments }: Props) {
    const { auth, firestore } = useContext(FirebaseContext);
    // const [ tournament, setTournament ] = useState<Tournament | undefined | null>();
    // const [ firstTeam, setFirstTeam ] = useState<Team | undefined | null>();
    // const [ secondTeam, setSecondTeam ] = useState<Team | undefined | null>();

    const [ isSelected, setIsSelected ] = useState(false);
    const [ isMyTournament, setIsMyTournament ] = useState(false);

    // Request's state
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (matchSelected) {
            setIsSelected(match.id === matchSelected.id);
        } else {
            setIsSelected(false);
        }
    }, [matchSelected, match])

    useEffect(() => {
        if (myTournaments.find(t => t.id === match.id_tournament)) {
            setIsMyTournament(true);
        } else {
            setIsMyTournament(false);        
        }
    }, [match, myTournaments])

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
                <YStack items={"center"}>
                    <Paragraph opacity={0.7} select={"none"} numberOfLines={1} maxW={"100%"}>
                        {match.name_tournament}
                    </Paragraph>                    
                </YStack>
                <XStack flex={1}>
                    <XStack grow={1}>
                        <XStack items={"center"} justify={"center"} width={"50%"}>
                            <YStack items={"center"}>
                                <Paragraph select={"none"}>
                                    {match.name_first_team}
                                </Paragraph>
                                <Paragraph fontSize={25} opacity={0.8} select={"none"}>
                                    {match.goals_first_team === undefined ? "-" : match.goals_first_team}
                                </Paragraph>
                            </YStack>
                        </XStack>
                        <XStack items={"center"} justify={"center"} width={"50%"} >
                            <YStack items={"center"}>
                                <Paragraph select={"none"}>
                                    {match.name_second_team}
                                </Paragraph>
                                <Paragraph fontSize={25} opacity={0.8} select={"none"}>
                                    {match.goals_second_team === undefined ? "-" : match.goals_second_team}
                                </Paragraph>
                            </YStack>
                        </XStack>
                    </XStack>                    
                </XStack>
                <YStack items={"center"} grow={0} >
                    <Paragraph opacity={0.5} select={"none"} fontSize={12}>
                        {match.plannedAt ?? "DD-MM-AA"}
                    </Paragraph>                    
                </YStack>
                {(isSelected && isMyTournament && !match.executed) && 
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