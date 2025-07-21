import TournamentModal from "@/components/modals/TournamentModal";
import TournamentCard from "@/components/TournamentCard";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Tournament } from "@/interfaces/tournament";
import { DBService } from "@/services/db-service";
import { Pencil, Plus } from "@tamagui/lucide-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { Button, Card, H2, H5, Paragraph, ScrollView, Separator, XStack, YStack } from "tamagui";
import "../../global.css";

export default function Tournaments () {
    const db = useSQLiteContext();
    const tournaments2: Tournament[] = [
        { id: 1, name: "Software", active: true, creator: "Oscar Lópezz", sport: "Fútbol" },
        { id: 2, name: "Medicina", active: true, creator: "Tatiana Cobeña", sport: "Fútbol" },
        { id: 3, name: "Economía", active: true, creator: "Tito Gorozabel", sport: "Fútbol" },
    ]
    let [ modalVisible, setModalVisible ] = useState(false);
    let [ modalMode, setModalMode ] = useState<"add" | "edit">("add");
    let [ tournamentSelected, setTournamentSelected ]: [ Tournament | undefined, React.Dispatch<React.SetStateAction<Tournament | undefined>> ] = useState();

    const { tournaments, setTournaments } = useContext(TournametContext);

    useEffect(() => {
        const loadData = async () => {
            const dbService = new DBService(db);
            const data = await dbService.getTournaments();
            setTournaments(data);
        }
        loadData();
    }, [db, setTournaments]);

    // Setter Functions
    function selectThisTournamet (tournamet: Tournament) {
        setTournamentSelected(tournamet);
    }

    // Toggle Functions
    function toggleModal(visible?: boolean) {
        if (typeof visible !== "undefined") {
            setModalVisible(visible);
        } else {
            setModalVisible(!modalVisible);
        }
    }
    return (
        <>
        <YStack bg={"$background"} flex={1}>
            <H2 color={"$colorFocus"} text={"center"} p={"$4"}>
                Torneos
            </H2>
            <YStack flex={1} p={"$3"} items={"center"}>
                <YStack  p={"$2"} rounded={"$4"} borderWidth={"$1"} borderColor={"$borderColor"} $maxMd={{flexDirection: "column"}}>
                    <H5 color={"$color8"} text={"center"}>
                        Torneos Actuales
                    </H5>
                    <ScrollView
                    grow={0}
                    horizontal
                    >
                        <XStack gap={"$2"}>
                            {tournaments.map((tournament) => <TournamentCard tournament={tournament} selectThisTournemat={selectThisTournamet} tournamentSelected={tournamentSelected} key={tournament.id} />)}
                        </XStack>
                    </ScrollView>
                </YStack>
                {tournamentSelected && // Renderiza solo si hay un torneo seleccionado 
                <YStack flex={1} width={"100%"} p={"$3"}>
                    <YStack flex={1} width={"100%"} rounded={"$5"} theme={"dark_yellow"} borderWidth={"$0.5"} borderColor={"$borderColor"} bg={"$background"}>
                        <H5 text={"center"} p={"$2"} color={"$colorFocus"}>
                            {tournamentSelected.name}
                        </H5>
                        <XStack  gap={5} px={10}>
                            <YStack width={100} flex={1}>
                                <Paragraph size={"$5"} fontWeight="800" text={"center"} color={"$color8"}>
                                    Dirigente
                                </Paragraph>
                                <Paragraph size={"$5"} text={"center"} color={"$color08"}>
                                    {tournamentSelected.creator}
                                </Paragraph>
                            </YStack>
                            <Separator vertical />
                            <YStack width={100}>
                                <Paragraph size={"$5"} fontWeight="800" text={"center"} color={"$color8"}>
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
                                onPress={() => { toggleModal() ; setModalMode("edit") }}
                            />         
                        </XStack>
                        <ScrollView
                            mt={5}
                        >
                            <YStack p={5} gap={5} flexWrap="wrap" flexDirection="row" justify={"center"} >
                                {
                                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((v) => (
                                    <Card key={v}>
                                        <Card.Header>
                                            <Paragraph fontWeight={"bold"}>
                                                Equipo {v}
                                            </Paragraph>
                                        </Card.Header>
                                    </Card>                            
                                    ))
                                }
                            </YStack>
                        </ScrollView>
                    </YStack>

                </YStack>
                }
                
                <YStack mt={"auto"}>
                    <Button flexDirection="column" rounded={99999} bg={"$backgroundHover"} p={5} px={6}
                    onPress={() => { setModalMode("add") ; toggleModal(true) }}
                    icon={<Plus size={30} />}
                    >
                    </Button>
                </YStack>
            </YStack>

            
        </YStack>
        <TournamentModal visible={modalVisible} toggleModal={toggleModal} mode={modalMode} tournamentSelected={tournamentSelected} setTournametSelected={setTournamentSelected} />
        </>
        

    )
}