import { MatchContext } from "@/context-providers/MatchesProvider";
import { TeamContext } from "@/context-providers/TeamsProvider";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Match, NewMatch } from "@/interfaces/match";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { DBService } from "@/services/db-service";
import { Trash, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import { Adapt, Button, Input, Label, Paragraph, Select, Sheet, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
    mode?: "add" | "edit" | "solve"
    // tournamentSelected?: Tournament
    // setTournametSelected?: React.Dispatch<React.SetStateAction<Tournament | undefined>>
    matchSelected?: Match
    setMatchSelected?: React.Dispatch<React.SetStateAction<Match | undefined>>
}

export default function MatchModal ({visible, toggleModal, mode="add", matchSelected, setMatchSelected }: Props) {
    const db = useSQLiteContext();
    const { setTournaments, tournaments } = useContext(TournametContext);
    const { teams, setTeams } = useContext(TeamContext);
    const { matches, setMatches } = useContext(MatchContext);

    // Estados de edición
    const [ tournamentId, setTournamentId ] = useState("");
    const [ firstTeamId, setFirstTeamId ] = useState("");
    const [ secondTeamId, setSecondTeamId ] = useState("");
    const [ plannedAt, setPlannedAt ] = useState("");
    // Estados de disputa
    const [ tournament, setTournament] = useState<Tournament | undefined>();
    const [ firstTeam, setFirstTeam ] = useState<Team | undefined>();
    const [ secondTeam, setSecondTeam ] = useState<Team | undefined>();
    const [ goalsFirstTeam, setGoalsFirstTeam ] = useState("0");
    const [ goalsSecondTeam, setGoalsSecondTeam ] = useState("0");


    useEffect(() => {
        if (mode === "add") {
            setTournamentId("");
            setFirstTeamId("");
            setSecondTeamId("");
            setPlannedAt("");
        }
    }, [mode])
    
    useEffect(() => {
        const loadTournaments = async () => {
            const dbService = new DBService(db);
            const data = await dbService.getTournaments();
            setTournaments(data);
        };
        loadTournaments();
    }, [db, setTournaments, mode])

    // Lógica reactiva del formulario de edición
    useEffect(() => {
        if (matchSelected && mode === "edit" && visible) {
            setTournamentId(matchSelected.id_tournament.toString());
            setPlannedAt(matchSelected.plannedAt ?? "");
        } 
    }, [mode, visible, matchSelected])

    // Lógica reactiva del formulario de disputa
    useEffect(() => {
        if (matchSelected && mode === "solve" && visible) {
            setTournamentId(matchSelected.id_tournament.toString());
            const loadFormData = async () => {
                const dbService = new DBService(db);
                setTournament((await dbService.getTournamentById(matchSelected.id_tournament)) ?? undefined);
                setFirstTeam((await dbService.getTeamById(matchSelected.id_first_team)) ?? undefined);
                setSecondTeam((await dbService.getTeamById(matchSelected.id_second_team)) ?? undefined);
            }
            loadFormData();
        }
    }, [mode, db, matchSelected, visible])

    useEffect(() => {
        const loadTeamsOfTournament = async () => {
            const dbService = new DBService(db);
            const resTeams = await dbService.getTeams(parseInt(tournamentId));
            setTeams(resTeams);
            if (matchSelected) {
                setFirstTeamId(matchSelected.id_first_team.toString());
                setSecondTeamId(matchSelected.id_second_team.toString());
            } else {                
                setFirstTeamId("");
                setSecondTeamId("");
            }
        }
        if (tournamentId !== "") {
            loadTeamsOfTournament();
        } else {
            setTeams([]);
        }
    }, [tournamentId, db, setTeams, matchSelected])

    async function addNewMatch () {
        if (!tournamentId || !firstTeamId || !secondTeamId || !plannedAt) { return };
        const dbService = new DBService(db);
        const newMatch: NewMatch = {
            id_tournament: parseInt(tournamentId),
            id_first_team: parseInt(firstTeamId),
            id_second_team: parseInt(secondTeamId),
            plannedAt
        }
        await dbService.addMatch(newMatch);
        setMatches(await dbService.getMatches());
        clearInputs();
        toggleModal();
    }

    async function editMatch () {
        if (!tournamentId || !firstTeamId || !secondTeamId || !plannedAt || !matchSelected) { return };
        console.log(tournamentId, firstTeamId, secondTeamId, plannedAt, matchSelected)
        const dbService = new DBService(db);
        const res = await dbService.editMatch(matchSelected.id, {
            id_tournament: parseInt(tournamentId),
            id_first_team: parseInt(firstTeamId),
            id_second_team: parseInt(secondTeamId),
            plannedAt
        });
        console.log(res)
        if (res && setMatchSelected) {
            setMatchSelected(res);
        };
        setMatches(await dbService.getMatches());
        toggleModal();
    }

    async function deleteMatch () {
        if (!matchSelected) { return };
        const dbService = new DBService(db);
        const res = await dbService.deleteMatch(matchSelected.id);
        if (res && setMatchSelected) {
            setMatchSelected(undefined);
        }
        setMatches(await dbService.getMatches());
        toggleModal();
    }

    async function solveMatch () {
        if (!tournament || !matchSelected || goalsFirstTeam === "" || goalsSecondTeam === "") { return };
        const dbService = new DBService(db);
        const res = await dbService.solveMatch(matchSelected.id, parseInt(goalsFirstTeam), parseInt(goalsSecondTeam));
        if (res && setMatchSelected) {
            setMatchSelected(undefined);
        }
        setMatches(await dbService.getMatches());
        toggleModal();
    }

    function clearInputs () {
        setTournamentId("");
        setFirstTeamId("");
        setSecondTeamId("");
        setPlannedAt("");
    }

    return (
        <Modal 
            transparent={true}
            visible={visible}
            animationType="fade"        
        >   
            <BlurView experimentalBlurMethod="dimezisBlurView" 
                tint="dark" 
                className="flex-1"
                intensity={60}
                
            >
                <YStack flex={1} justify={"center"} items={"center"} onPress={(e) => {toggleModal(false)}}                     
                >
                    <YStack bg="$background" p={"$3"} borderWidth={"$0.5"} borderColor={"$borderColorHover"} rounded={"$4"} maxW={"80%"} minW={"70%"}
                        onPress={(e) => e.preventDefault()}
                    >
                        <Label color={"$colorFocus"} text={"center"}>
                            {mode === "add" ? "Nuevo Encuentro" : ( mode === "edit" ? "Editar Torneo" : "Disputar Encuentro")}
                        </Label>
                        <YStack items={"center"} gap={"$2"}>
                            {mode === "solve" && tournament && firstTeam && secondTeam
                            ?
                            <YStack gap={10} items={"center"} mb={20}>
                                <Paragraph>
                                    {tournament.name}
                                </Paragraph>
                                <YStack>
                                    <Paragraph>
                                        {firstTeam.name}
                                    </Paragraph>
                                    <Input placeholder="-" value={goalsFirstTeam} text={"center"} 
                                        keyboardType="numeric"
                                        onChangeText={(v) => setGoalsFirstTeam(v)}
                                    />
                                </YStack>
                                <YStack>
                                    <Paragraph>
                                        {secondTeam.name}
                                    </Paragraph>
                                    <Input placeholder="-" value={goalsSecondTeam} text={"center"} 
                                        keyboardType="numeric"
                                        onChangeText={(v) => setGoalsSecondTeam(v)}
                                    />
                                </YStack>
                            </YStack>
                            :
                            <>
                            <Select value={matchSelected?.id_tournament && mode === "edit" ? matchSelected.id_tournament.toString() : tournamentId } onValueChange={(value) => setTournamentId(value)}>
                                <Select.Trigger width={"min-content"} px={"$7"}>
                                    {tournamentId 
                                    ? <Select.Value placeholder="Torneo" color="$color" items={"center"} text={"center"} />
                                    : <Select.Value placeholder="Torneo" color="$color04" items={"center"} text={"center"} />
                                    }
                                </Select.Trigger>

                                <Adapt when="maxMd" platform="touch">
                                {/* or <Select.Sheet> */}
                                    <Sheet>
                                        <Sheet.Frame bg={"$colorTransparent"} overflow="visible">
                                        <Adapt.Contents/>
                                        </Sheet.Frame>
                                        <Sheet.Overlay/>
                                    </Sheet>
                                </Adapt>

                                <Select.Content>
                                    <Select.ScrollUpButton/>
                                    <Select.Viewport >
                                        <Select.Group>
                                            <Select.Label bg={"$backgroundHover"} 
                                                borderTopLeftRadius={"$2"}
                                                borderTopRightRadius={"$2"}
                                            >
                                                Torneos
                                            </Select.Label>                                                                                        
                                            {tournaments.map((tournament, index) => (
                                                <Select.Item index={tournament.id+2*5} key={tournament.id+tournament.creator+tournament.name}
                                                    value={tournament.id.toString()} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === tournaments.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === tournaments.length-1 ? "$2" : "$0"}
                                                    height={"min-content"}
                                                >
                                                    <Select.ItemText>
                                                        {tournament.name}
                                                    </Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Group>                        
                                    </Select.Viewport>
                                    <Select.ScrollDownButton />
                                </Select.Content>
                            </Select>
                            <Select value={matchSelected && mode === "edit" ? matchSelected?.id_first_team.toString() : firstTeamId } onValueChange={(value) => setFirstTeamId(value)}>
                                <Select.Trigger width={"min-content"} px={"$7"}>
                                    { firstTeamId
                                    ? <Select.Value placeholder="Primer equipo" color="$color" items={"center"} text={"center"} />
                                    : <Select.Value placeholder="Primer equipo" color="$color04" items={"center"} text={"center"} />
                                    }
                                </Select.Trigger>

                                <Adapt when="maxMd" platform="touch">
                                {/* or <Select.Sheet> */}
                                    <Sheet>
                                        <Sheet.Frame bg={"$colorTransparent"} overflow="visible">
                                        <Adapt.Contents/>
                                        </Sheet.Frame>
                                        <Sheet.Overlay/>
                                    </Sheet>
                                </Adapt>

                                <Select.Content>
                                    <Select.ScrollUpButton/>
                                    <Select.Viewport >
                                        <Select.Group>
                                            <Select.Label bg={"$backgroundHover"} 
                                                borderTopLeftRadius={"$2"}
                                                borderTopRightRadius={"$2"}
                                            >
                                                Equipos
                                            </Select.Label>                                                                                        
                                            {teams.map((team, index) => (
                                                <Select.Item index={team.id+2*5} key={team.id+team.dt+team.name}
                                                    value={team.id.toString()} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === teams.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === teams.length-1 ? "$2" : "$0"}
                                                    height={"min-content"}
                                                    display={team.id.toString() === secondTeamId ? "none" : "flex"}
                                                >
                                                    <Select.ItemText>
                                                        {team.name}
                                                    </Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Group>                        
                                    </Select.Viewport>
                                    <Select.ScrollDownButton />
                                </Select.Content>
                            </Select>
                            <Select value={matchSelected && mode === "edit" ? matchSelected?.id_second_team.toString() : secondTeamId } onValueChange={(value) => setSecondTeamId(value)}>
                                <Select.Trigger width={"min-content"} px={"$7"}>
                                    { secondTeamId
                                    ? <Select.Value placeholder="Segundo equipo" color="$color" items={"center"} text={"center"} />
                                    : <Select.Value placeholder="Segundo equipo" color="$color04" items={"center"} text={"center"} />
                                    }
                                </Select.Trigger>

                                <Adapt when="maxMd" platform="touch">
                                {/* or <Select.Sheet> */}
                                    <Sheet>
                                        <Sheet.Frame bg={"$colorTransparent"} overflow="visible">
                                        <Adapt.Contents/>
                                        </Sheet.Frame>
                                        <Sheet.Overlay/>
                                    </Sheet>
                                </Adapt>

                                <Select.Content>
                                    <Select.ScrollUpButton/>
                                    <Select.Viewport >
                                        <Select.Group>
                                            <Select.Label bg={"$backgroundHover"} 
                                                borderTopLeftRadius={"$2"}
                                                borderTopRightRadius={"$2"}
                                            >
                                                Equipos
                                            </Select.Label>                                                                                        
                                            {teams.map((team, index) => (
                                                <Select.Item index={team.id+2*5} key={team.id+team.dt+team.name}
                                                    value={team.id.toString()} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === teams.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === teams.length-1 ? "$2" : "$0"}
                                                    height={"min-content"}
                                                    display={team.id.toString() === firstTeamId ? "none" : "flex"}
                                                >
                                                    <Select.ItemText>
                                                        {team.name}
                                                    </Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Group>                        
                                    </Select.Viewport>
                                    <Select.ScrollDownButton />
                                </Select.Content>
                            </Select>
                            <Input placeholder="AA-MM-DD" width={"80%"} placeholderTextColor="unset" text={"center"} textContentType="password"
                                keyboardType="numeric"
                                onChangeText={(text) => setPlannedAt(text)}
                                value={plannedAt}
                            />
                            </>
                            }
                            { mode === "add" &&
                                <Button color={"$colorFocus"} onPress={addNewMatch}>
                                    Crear
                                </Button> 
                            }
                            { mode === "edit" &&
                                <>
                                <Button color={"$colorFocus"} onPress={editMatch}>
                                    Editar
                                </Button>                    
                                <Button icon={<Trash size={20} color={"$color06"} />} chromeless onPress={deleteMatch} />
                                </>                    
                            }
                            { mode === "solve" &&
                                <Button color={"$colorFocus"} onPress={solveMatch}>
                                    Resolver
                                </Button>
                            }
                            <Button chromeless p={0} px={9} rounded={"$9"}
                            onPress={() => toggleModal(false)}
                            icon={<X size={25} color={"$borderColorHover"} />}
                            >
                                
                            </Button>

                        </YStack>
                    </YStack>
                </YStack>
            </BlurView>
        </Modal>
    )
}