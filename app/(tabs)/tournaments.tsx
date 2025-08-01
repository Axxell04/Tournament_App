import TeamModal from "@/components/modals/TeamModal";
import TournamentModal from "@/components/modals/TournamentModal";
import TeamCard from "@/components/TeamCard";
import TournamentCard from "@/components/TournamentCard";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { TeamContext } from "@/context-providers/TeamsProvider";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { FirestoreService } from "@/services/firestore-service";
import { Pencil, Plus } from "@tamagui/lucide-icons";
import { useContext, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { Button, H5, Paragraph, ScrollView, Separator, Spinner, XStack, YStack } from "tamagui";
import "../../global.css";

export default function Tournaments () {
    const { auth, firestore } = useContext(FirebaseContext);

    const { tournaments, setTournaments } = useContext(TournametContext);
    const { teams, setTeams } = useContext(TeamContext);
    let [ modalTournamentVisible, setModalTournamentVisible ] = useState(false);
    let [ modalTeamVisible, setModalTeamVisible ] = useState(false);
    let [ modalTournamentMode, setModalTournamentMode ] = useState<"add" | "edit">("add");
    let [ modalTeamMode, setModalTeamMode ] = useState<"add" | "edit">("add");
    
    let [ tournamentSelected, setTournamentSelected ]: [ Tournament | undefined, React.Dispatch<React.SetStateAction<Tournament | undefined>> ] = useState();
    let [ teamSelected, setTeamSelected ]: [ Team | undefined, React.Dispatch<React.SetStateAction<Team | undefined>> ] = useState();
    let [ isMyTournament, setIsMyTournament ] = useState(false);

    // View mode
    let [ listTournamentsMode, setListTournamentMode ] = useState<"all" | "my">("all");

    // Request's Status
    let [ tournamentsIsLoading, setTournamentsIsLoading ] = useState(false);
    let [ teamsIsLoading, setTeamsIsLoading ] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            setTournamentsIsLoading(true);
            const fsService = new FirestoreService(firestore);
            setTournaments(await fsService.getTournaments());
            setTournamentsIsLoading(false);
        }
        loadData();
    }, [setTournaments, firestore]);

    useEffect(() => {
        if (tournamentSelected) {
            const loadTeams = async () => {
                setTeamsIsLoading(true);
                const fsService = new FirestoreService(firestore);
                const data = await fsService.getTeams(tournamentSelected.id as string);
                setTeamsIsLoading(false);
                setTeams(data);
            }
            loadTeams();
            if (tournamentSelected.ownerId === auth.currentUser?.uid) {
                setIsMyTournament(true);
            } else {
                setIsMyTournament(false);
            }
        } else {
            setTeams([]);
            setIsMyTournament(false);
        }
    }, [tournamentSelected, setTeams, firestore, auth])

    useEffect(() => {
        const loadTournaments = async () => {
            setTournamentsIsLoading(true);
            const fsService = new FirestoreService(firestore);
            setTournaments(await fsService.getTournaments(listTournamentsMode === "my" ? auth.currentUser?.uid : undefined));
            setTournamentsIsLoading(false);
        }
        loadTournaments();
        setTournamentSelected(undefined);
    }, [listTournamentsMode, auth, firestore, setTournaments])

    // Setter Functions
    function selectThisTournament (tournamet: Tournament) {
        setTournamentSelected(tournamet);
    }

    function selectThisTeam (team: Team) {
        setTeamSelected(team);
    }

    // Toggle Functions
    function toggleTournamentModal(visible?: boolean) {
        if (typeof visible !== "undefined") {
            setModalTournamentVisible(visible);
        } else {
            setModalTournamentVisible(!modalTournamentVisible);
        }
    }

    function toggleTeamModal(visible?: boolean) {
        if (typeof visible !== "undefined") {
            setModalTeamVisible(visible);
        } else {
            setModalTeamVisible(!modalTeamVisible);
        }
    }

    function openModalTournament () {
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            setModalTournamentMode("add");
            toggleTournamentModal(true);
        } else {
            ToastAndroid.show("Debe iniciar sesión para continuar", ToastAndroid.SHORT);
        }
    }

    function openModalTeam () {
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            setModalTeamMode("add");
            toggleTeamModal(true);
        } else {
            ToastAndroid.show("Debe iniciar sesión para continuar", ToastAndroid.SHORT);
        }
    }

    return (
        <>
        <YStack bg={"$background"} flex={1}>
            <YStack flex={1} p={"$3"} items={"center"}>
                <YStack  p={"$2"} gap={"$2"} rounded={"$4"} borderWidth={"$1"} borderColor={"$borderColor"} $maxMd={{flexDirection: "column"}} width={"100%"}>
                    <XStack items={"center"} gap={10}>
                        <Button 
                            grow={listTournamentsMode === "all" ? 1 : 0}
                            chromeless={listTournamentsMode !== "all" && true}
                            color={"$colorFocus"}
                            opacity={listTournamentsMode === "all" ? 1 : 0.8}
                            onPress={() => setListTournamentMode("all")}
                            >
                            Todos los torneos
                        </Button>
                        <Button 
                            grow={listTournamentsMode === "my" ? 1 : 0}
                            chromeless={listTournamentsMode !== "my" && true}
                            color={"$colorFocus"}
                            opacity={listTournamentsMode === "my" ? 1 : 0.8}
                            onPress={() => setListTournamentMode("my")}
                        >
                            Mís torneos
                        </Button>
                    </XStack>
                    {(tournaments.length === 0 && !tournamentsIsLoading) &&
                        <YStack items={"center"} justify={"center"} py={20}>
                                <Paragraph opacity={0.7} text={"center"} >
                                    No hay torneos registrados
                                </Paragraph>                                
                        </YStack>
                    }
                    {tournamentsIsLoading 
                    ?
                    <YStack width={"100%"} justify={"center"} height={30}>
                        <Spinner size="large" color={"$colorHover"} self={"center"} /> 
                    </YStack>
                    :
                    <ScrollView
                    grow={0}
                    horizontal
                    >   
                        <XStack gap={"$2"}>
                            {tournaments.map((tournament) => <TournamentCard tournament={tournament} selectThisTournament={selectThisTournament} tournamentSelected={tournamentSelected} key={tournament.id+tournament.name+tournament.ownerId} />)}
                        </XStack>
                    </ScrollView>
                    }
                </YStack>
                {tournamentSelected && // Renderiza solo si hay un torneo seleccionado 
                <YStack flex={1} width={"100%"} p={"$3"}>
                    <YStack flex={1} width={"100%"} rounded={"$5"} borderWidth={"$0.5"} borderColor={"$borderColor"} bg={"$background"}>
                        <H5 text={"center"} p={"$2"} color={"$colorFocus"} fontWeight={"bold"}>
                            {tournamentSelected.name}
                        </H5>
                        <XStack  gap={5} px={10}>
                            <YStack width={100} flex={1}>
                                <Paragraph size={"$5"} fontWeight="800" text={"center"} color={"$colorHover"}>
                                    Dirigente
                                </Paragraph>
                                <Paragraph size={"$5"} text={"center"} color={"$color08"}>
                                    {tournamentSelected.ownerName}
                                </Paragraph>
                            </YStack>
                            <Separator vertical />
                            <YStack width={100}>
                                <Paragraph size={"$5"} fontWeight="800" text={"center"} color={"$colorHover"}>
                                    Estado
                                </Paragraph>
                                <Paragraph size={"$5"} text={"center"} color={"$color08"}>
                                    {tournamentSelected.active ? "Activo" : "Terminado"}
                                </Paragraph>
                            </YStack>
                            {isMyTournament &&
                            <>
                            <Separator vertical />
                            <Button
                                icon={<Pencil size={25} />}
                                rounded={10000}
                                p={9}
                                self={"center"}
                                onPress={() => { toggleTournamentModal() ; setModalTournamentMode("edit") }}
                            />         
                            </>
                            }
                        </XStack>
                        <ScrollView
                            mt={5}
                        >
                            {teamsIsLoading 
                            ?                            
                            <Spinner size="large" color={"$colorHover"} /> 
                            :
                            <YStack p={5} gap={5} flexWrap="wrap" flexDirection="row" justify={"center"} 
                            >
                                {teams.map((team) => <TeamCard team={team} isMyTournament={isMyTournament} selectThisTeam={selectThisTeam} teamSelected={teamSelected} setModalTeamMode={setModalTeamMode} toggleModal={toggleTeamModal} key={team.id+team.name+team.dt} /> )}
                                {(!auth.currentUser?.isAnonymous && auth.currentUser?.uid === tournamentSelected.ownerId && !teamsIsLoading) &&
                                <Button 
                                    icon={<Plus size={20} />}
                                    pl={4} pr={7}
                                    self={"center"}
                                    chromeless
                                    opacity={0.7}
                                    onPress={openModalTeam}
                                >
                                    Equipo
                                </Button>
                                }
                            </YStack>
                            }
                        </ScrollView>
                    </YStack>

                </YStack>
                }
                
                <YStack mt={"auto"}>
                    <Button flexDirection="column" rounded={99999} bg={"$backgroundHover"} p={5} px={6}
                    onPress={openModalTournament}
                    icon={<Plus size={30} />}
                    >
                    </Button>
                </YStack>
            </YStack>

            
        </YStack>
        <TournamentModal visible={modalTournamentVisible} 
            toggleModal={toggleTournamentModal} 
            mode={modalTournamentMode} 
            tournamentSelected={tournamentSelected} 
            setTournametSelected={setTournamentSelected}
            listTournamentsMode={listTournamentsMode}
        />
        <TeamModal visible={modalTeamVisible} 
            toggleModal={toggleTeamModal} 
            mode={modalTeamMode} 
            tournamentSelected={tournamentSelected} 
            setTeamSelected={setTeamSelected} 
            teamSelected={teamSelected}  
        />
        </>
        

    )
}