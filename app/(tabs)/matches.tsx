import MatchCard from "@/components/MatchCard";
import MatchModal from "@/components/modals/MatchModal";
import { MatchContext } from "@/context-providers/MatchesProvider";
import { Match } from "@/interfaces/match";
import { DBService } from "@/services/db-service";
import { CalendarPlus } from "@tamagui/lucide-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { Button, ScrollView, XStack, YStack } from "tamagui";

export default function Matches () {
    const db = useSQLiteContext();
    const { matches, setMatches } = useContext(MatchContext);

    const [ viewMode, setViewMode ] = useState<"disputed" | "next">("disputed");
    const [ modalMatchVisible, setModalMatchVisible ] = useState(false);
    const [ modalMatchMode, setModalMatchMode ] = useState<"add" | "edit" | "solve">("add");
    const [ matchSelected, setMatchSelected ] = useState<Match | undefined>();

    // Toggle functions
    function toggleViewMode (mode: "disputed" | "next") {
        setViewMode(mode);
    }

    function toggleModalMatchVisible (visible?: boolean) {
        if (typeof visible !== "undefined") {
            setModalMatchVisible(visible);
        } else {
            setModalMatchVisible(!modalMatchVisible);
        }
    }

    // Selection Functions
    function selectThisMatch (match: Match | undefined) {
        setMatchSelected(match);
    }

    useEffect(() => {
        const loadMatches = async () => {
            const dbService = new DBService(db);
            const resMatches = await dbService.getMatches();
            setMatches(resMatches);
        };
        loadMatches();
    }, [viewMode, db, setMatches])

    return (
        <YStack bg={"$background"} flex={1} p={20}>
            <YStack flex={1} width={"100%"} borderWidth={1} borderColor={"$borderColor"} self={"center"} rounded={"$7"}>
                <XStack justify={"space-around"} p={10} pb={5} gap={5}>
                    <Button grow={viewMode === "disputed" ? 1 : 0 } rounded={"$6"} onPress={() => toggleViewMode("disputed")}
                        chromeless={viewMode === "disputed" ? false : true}
                        opacity={viewMode === "disputed" ? 1 : 0.7}
                    >
                        Disputados
                    </Button>
                    <Button grow={viewMode === "next" ? 1 : 0} rounded={"$6"} onPress={() => toggleViewMode("next")}
                        chromeless={viewMode === "next" ? false : true}
                        opacity={viewMode === "next" ? 1 : 0.7}
                    >
                        Próximos
                    </Button>
                </XStack>
                <YStack p={10} pt={5} flex={1}>
                    <ScrollView bg={"$borderColorFocus"} rounded={"$6"}>
                        <YStack flex={1} grow={1}  gap={10} p={5}>
                            {matches.map((match) => {
                                if (viewMode === "next" && !match.executed) {
                                    return (
                                        <MatchCard match={match}
                                            matchSelected={matchSelected}
                                            selectThisMatch={selectThisMatch}
                                            setModalMatchMode={setModalMatchMode}
                                            toggleModalMatchVisible={toggleModalMatchVisible}
                                            key={match.id+match.id_first_team+match.id_tournament}                             
                                        />
                                    )
                                } else if (viewMode === "disputed" && match.executed) {
                                    return (
                                        <MatchCard match={match}
                                            matchSelected={matchSelected}
                                            selectThisMatch={selectThisMatch}
                                            setModalMatchMode={setModalMatchMode}
                                            toggleModalMatchVisible={toggleModalMatchVisible}
                                            key={match.id+match.id_first_team+match.id_tournament}                             
                                        />
                                    )                                    
                                }
                            }
                            )}
                        </YStack>
                    </ScrollView>
                </YStack>
            </YStack>
            <XStack mt={"auto"} pt={20} gap={20} justify={"center"}>
                <Button
                    icon={<CalendarPlus size={20} />}
                    onPress={() => {
                        setModalMatchMode("add");
                        toggleModalMatchVisible(true);
                    }}
                >
                    Añadir
                </Button>
            </XStack>

            <MatchModal 
                visible={modalMatchVisible} 
                toggleModal={toggleModalMatchVisible} 
                matchSelected={matchSelected}
                mode={modalMatchMode}
                setMatchSelected={setMatchSelected}
            />
        </YStack>
    )
}