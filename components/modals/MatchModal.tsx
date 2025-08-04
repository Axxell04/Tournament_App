import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { MatchContext } from "@/context-providers/MatchesProvider";
import { TeamContext } from "@/context-providers/TeamsProvider";
import { Match } from "@/interfaces/match";
import { Tournament } from "@/interfaces/tournament";
import { FirestoreService } from "@/services/firestore-service";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import { Adapt, Button, Input, Label, Paragraph, Select, Sheet, Spinner, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
    mode?: "add" | "edit" | "solve"
    // tournamentSelected?: Tournament
    // setTournametSelected?: React.Dispatch<React.SetStateAction<Tournament | undefined>>
    matchSelected?: Match
    setMatchSelected?: React.Dispatch<React.SetStateAction<Match | undefined>>
    myTournaments: Tournament[]
}

export default function MatchModal ({visible, toggleModal, mode="add", matchSelected, setMatchSelected, myTournaments }: Props) {
    const { auth, firestore } = useContext(FirebaseContext);

    const { teams, setTeams } = useContext(TeamContext);
    const { matches, setMatches } = useContext(MatchContext);

    // Estados de edición
    const [ tournamentId, setTournamentId ] = useState("");
    const [ firstTeamId, setFirstTeamId ] = useState("");
    const [ secondTeamId, setSecondTeamId ] = useState("");
    const [ plannedAt, setPlannedAt ] = useState("");
    // Estados de disputa
    const [ goalsFirstTeam, setGoalsFirstTeam ] = useState("0");
    const [ goalsSecondTeam, setGoalsSecondTeam ] = useState("0");

    const [ showDateTimePicker, setShowDateTimePicker ] = useState(false);

    // Request's state
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (!visible) {
            setTeams([]);
            setTournamentId("");
            setFirstTeamId("");
            setSecondTeamId("")
            setPlannedAt("");
            setGoalsFirstTeam("0");
            setGoalsSecondTeam("0");
        }
    }, [visible, setTeams])

    useEffect(() => {
        if (mode === "add") {
            setTournamentId("");
            setFirstTeamId("");
            setSecondTeamId("");
            setPlannedAt("");
        }
    }, [mode, setMatchSelected])

    // Lógica reactiva del formulario de edición
    useEffect(() => {
        if (matchSelected && mode === "edit" && visible) {
            setTournamentId(matchSelected.id_tournament);
            setPlannedAt(matchSelected.plannedAt);
        } 
    }, [mode, visible, matchSelected])

    // Lógica reactiva del formulario de disputa
    useEffect(() => {
        if (matchSelected && mode === "solve" && visible) {
            setGoalsFirstTeam("0");
            setGoalsSecondTeam("0");
        }
    }, [mode, matchSelected, visible])

    useEffect(() => {
        const loadTeamsOfTournament = async () => {
            const fsService = new FirestoreService(firestore);
            setTeams(await fsService.getTeams(tournamentId));
            if (matchSelected && mode !== "add") {
                setFirstTeamId(matchSelected.id_first_team);
                setSecondTeamId(matchSelected.id_second_team);
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
    }, [tournamentId, setTeams, matchSelected, firestore, mode])

    async function addNewMatch () {
        if (!tournamentId || !firstTeamId || !secondTeamId || !plannedAt) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.addMatch({
            id_tournament: tournamentId,
            id_first_team: firstTeamId,
            id_second_team: secondTeamId,
            name_tournament: myTournaments.find(t => t.id === tournamentId)?.name as string,
            name_first_team: teams.find(t => t.id === firstTeamId)?.name as string,
            name_second_team: teams.find(t => t.id === secondTeamId)?.name as string,
            plannedAt: plannedAt,
            executed: false
        });
        setMatches(await fsService.getMatches());
        setLoading(false);
        clearInputs();
        toggleModal();
    }

    async function editMatch () {
        if (!tournamentId || !firstTeamId || !secondTeamId || !plannedAt || !matchSelected) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        const res = await fsService.updateMatch({
            id: matchSelected.id,
            executed: matchSelected.executed,
            id_tournament: tournamentId,
            id_first_team: firstTeamId,
            id_second_team: secondTeamId,
            name_tournament: myTournaments.find(t => t.id === tournamentId)?.name as string,
            name_first_team: teams.find(t => t.id === firstTeamId)?.name as string,
            name_second_team: teams.find(t => t.id === secondTeamId)?.name as string,
            plannedAt: plannedAt,
        });
        if (setMatchSelected) {
            setMatchSelected(res);
        };
        setMatches(await fsService.getMatches());
        setLoading(false);
        toggleModal();
    }

    async function deleteMatch () {
        if (!matchSelected || !matchSelected.id) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.deleteMatch(matchSelected.id);
        if (setMatchSelected) {
            setMatchSelected(undefined);
        }
        setMatches(await fsService.getMatches());
        setLoading(false);
        toggleModal();
    }

    async function solveMatch () {
        if (!matchSelected || !matchSelected.id || goalsFirstTeam === "" || goalsSecondTeam === "") { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.solveMatch(matchSelected.id, parseInt(goalsFirstTeam), parseInt(goalsSecondTeam));
        toggleModal(false);
        if (setMatchSelected) {
            setMatchSelected(undefined);
        }
        setMatches(await fsService.getMatches());
        setGoalsFirstTeam("0");
        setGoalsSecondTeam("0");
        setLoading(false);
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
                            {mode === "solve" && matchSelected 
                            ?
                            <YStack gap={10} items={"center"} mb={20}>
                                <Paragraph>
                                    {matchSelected.name_tournament}
                                </Paragraph>
                                <YStack items={"center"}>
                                    <Paragraph>
                                        {matchSelected.name_first_team}
                                    </Paragraph>
                                    <Input placeholder="-" value={goalsFirstTeam} text={"center"} 
                                        keyboardType="numeric"
                                        onChangeText={(v) => setGoalsFirstTeam(v)}
                                    />
                                </YStack>
                                <YStack items={"center"}>
                                    <Paragraph>
                                        {matchSelected.name_second_team}
                                    </Paragraph>
                                    <Input placeholder="-" value={goalsSecondTeam} text={"center"} 
                                        keyboardType="numeric"
                                        onChangeText={(v) => setGoalsSecondTeam(v)}
                                    />
                                </YStack>
                            </YStack>
                            :
                            <>
                            <Select value={matchSelected?.id_tournament && mode === "edit" ? matchSelected.id_tournament : tournamentId } onValueChange={(value) => setTournamentId(value)}>
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
                                            {myTournaments.map((tournament, index) => (
                                                <Select.Item index={index+2*5} key={tournament.id+tournament.ownerId+tournament.name}
                                                    value={tournament.id as string} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === myTournaments.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === myTournaments.length-1 ? "$2" : "$0"}
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
                            <Select value={matchSelected && mode === "edit" ? matchSelected.id_first_team : firstTeamId } onValueChange={(value) => setFirstTeamId(value)}>
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
                                                <Select.Item index={index+2*5} key={team.id+team.dt+team.name}
                                                    value={team.id as string} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === teams.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === teams.length-1 ? "$2" : "$0"}
                                                    height={"min-content"}
                                                    display={team.id === secondTeamId ? "none" : "flex"}
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
                                                <Select.Item index={index+2*5} key={team.id+team.dt+team.name}
                                                    value={team.id as string} 
                                                    bg={"$backgroundHover"} 
                                                    borderBottomEndRadius={index === teams.length-1 ? "$2" : "$0"} 
                                                    borderBottomStartRadius={index === teams.length-1 ? "$2" : "$0"}
                                                    height={"min-content"}
                                                    display={team.id === firstTeamId ? "none" : "flex"}
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
                            {/* <Input placeholder="AA-MM-DD" width={"80%"} placeholderTextColor="unset" text={"center"} textContentType="password"
                                keyboardType="numeric"
                                onChangeText={(text) => setPlannedAt(text)}
                                value={plannedAt}
                            /> */}
                            <Button 
                                bg={"$backgroundPress"} 
                                borderColor={"$borderColorPress"} 
                                color={plannedAt ? "$color" : "$color06"}
                                onPress={() => setShowDateTimePicker(true)}
                            >
                                {plannedAt ? plannedAt : "AA-MM-DD"}
                            </Button>
                            {showDateTimePicker &&
                            <DateTimePicker mode="date" value={new Date()} minimumDate={new Date()} timeZoneName="America/Guayaquil"
                                onChange={(e, date) => {setPlannedAt(date?.toISOString().split("T")[0] ?? ""); setShowDateTimePicker(false)}}
                            />
                            }
                            </>
                            }
                            { mode === "add" &&
                                <Button color={"$colorFocus"} onPress={addNewMatch} disabled={loading}>
                                    Crear
                                </Button> 
                            }
                            { mode === "edit" &&
                                <>
                                <Button color={"$colorFocus"} onPress={editMatch} disabled={loading}>
                                    Editar
                                </Button>                    
                                <Button icon={<Trash size={20} color={"$color06"} />} chromeless onPress={deleteMatch} disabled={loading} />
                                </>                    
                            }
                            { mode === "solve" &&
                                <Button color={"$colorFocus"} onPress={solveMatch} disabled={loading}>
                                    Resolver
                                </Button>
                            }
                            <Button chromeless p={0} px={9} rounded={"$9"}
                            onPress={() => toggleModal(false)}
                            icon={!loading ? <X size={25} color={"$borderColorHover"} /> : null}
                            disabled={loading}
                            >   
                                {loading &&
                                <Spinner size="large" color={"$colorHover"} />                               
                                }
                            </Button>

                        </YStack>
                    </YStack>
                </YStack>
            </BlurView>
        </Modal>
    )
}