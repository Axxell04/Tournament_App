import TeamModal from "@/components/modals/TeamModal";
import TournamentModal from "@/components/modals/TournamentModal";
import TeamCard from "@/components/TeamCard";
import TournamentCard from "@/components/TournamentCard";
import { TeamContext } from "@/context-providers/TeamsProvider";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { DBService } from "@/services/db-service";
import { Pencil, Plus } from "@tamagui/lucide-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { Button, H5, Paragraph, ScrollView, Separator, XStack, YStack } from "tamagui";
import "../../global.css";

export default function Tournaments () {
    const db = useSQLiteContext();
    let [ modalTournamentVisible, setModalTournamentVisible ] = useState(false);
    let [ modalTeamVisible, setModalTeamVisible ] = useState(false);
    let [ modalTournamentMode, setModalTournamentMode ] = useState<"add" | "edit">("add");
    let [ modalTeamMode, setModalTeamMode ] = useState<"add" | "edit">("add");
    
    let [ tournamentSelected, setTournamentSelected ]: [ Tournament | undefined, React.Dispatch<React.SetStateAction<Tournament | undefined>> ] = useState();
    let [ teamSelected, setTeamSelected ]: [ Team | undefined, React.Dispatch<React.SetStateAction<Team | undefined>> ] = useState();

    const { tournaments, setTournaments } = useContext(TournametContext);
    const { teams, setTeams } = useContext(TeamContext);

    useEffect(() => {
        const loadData = async () => {
            const dbService = new DBService(db);
            const data = await dbService.getTournaments();
            setTournaments(data);
        }
        loadData();
    }, [db, setTournaments]);

    useEffect(() => {
        if (tournamentSelected) {
            const loadTeams = async () => {
                const dbService = new DBService(db);
                const data = await dbService.getTeams(tournamentSelected.id)
                console.log(data);
                setTeams(data);
            }
            loadTeams();
        } else {
            setTeams([]);
        }
    }, [tournamentSelected, db, setTeams])

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

    return (
        <>
        <YStack bg={"$background"} flex={1}>
            <YStack flex={1} p={"$3"} items={"center"}>
                <YStack  p={"$2"} rounded={"$4"} borderWidth={"$1"} borderColor={"$borderColor"} $maxMd={{flexDirection: "column"}} width={"100%"}>
                    <H5 color={"$color9"} text={"center"}>
                        Torneos Actuales
                    </H5>
                    {tournaments.length === 0 &&
                        <YStack items={"center"} justify={"center"} py={20}>
                                <Paragraph opacity={0.7} text={"center"} >
                                    No hay torneos registrados
                                </Paragraph>                                
                        </YStack>
                    }
                    <ScrollView
                    grow={0}
                    horizontal
                    >
                        <XStack gap={"$2"}>
                            {tournaments.map((tournament) => <TournamentCard tournament={tournament} selectThisTournament={selectThisTournament} tournamentSelected={tournamentSelected} key={tournament.id+tournament.name+tournament.creator} />)}
                        </XStack>
                    </ScrollView>
                </YStack>
                {tournamentSelected && // Renderiza solo si hay un torneo seleccionado 
                <YStack flex={1} width={"100%"} p={"$3"}>
                    <YStack flex={1} width={"100%"} rounded={"$5"} theme={"dark_yellow"} borderWidth={"$0.5"} borderColor={"$borderColor"} bg={"$background"}>
                        <H5 text={"center"} p={"$2"} color={"$colorFocus"} fontWeight={"bold"}>
                            {tournamentSelected.name}
                        </H5>
                        <XStack  gap={5} px={10}>
                            <YStack width={100} flex={1}>
                                <Paragraph size={"$5"} fontWeight="800" text={"center"} color={"$colorHover"}>
                                    Dirigente
                                </Paragraph>
                                <Paragraph size={"$5"} text={"center"} color={"$color08"}>
                                    {tournamentSelected.creator}
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
                            <Separator vertical />
                            <Button
                                icon={<Pencil size={25} />}
                                rounded={10000}
                                p={9}
                                self={"center"}
                                onPress={() => { toggleTournamentModal() ; setModalTournamentMode("edit") }}
                            />         
                        </XStack>
                        <ScrollView
                            mt={5}
                        >
                            <YStack p={5} gap={5} flexWrap="wrap" flexDirection="row" justify={"center"} >
                                {teams.map((team) => <TeamCard team={team} selectThisTeam={selectThisTeam} teamSelected={teamSelected} setModalTeamMode={setModalTeamMode} toggleModal={toggleTeamModal} key={team.id+team.name+team.dt} /> )}
                                <Button 
                                    icon={<Plus size={20} />}
                                    pl={4} pr={7}
                                    self={"center"}
                                    chromeless
                                    opacity={0.7}
                                    onPress={() => { setModalTeamMode("add"); toggleTeamModal(true)}}
                                >
                                    Equipo
                                </Button>
                            </YStack>
                        </ScrollView>
                    </YStack>

                </YStack>
                }
                
                <YStack mt={"auto"}>
                    <Button flexDirection="column" rounded={99999} bg={"$backgroundHover"} p={5} px={6}
                    onPress={() => { setModalTournamentMode("add") ; toggleTournamentModal(true) }}
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