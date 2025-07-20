import TournamentModal from "@/components/modals/TournamentModal";
import TournamentCard from "@/components/TournamentCard";
import { Tournament } from "@/interfaces/tournament";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Button, H2, H3, H5, Paragraph, ScrollView, Separator, Text, XStack, YStack } from "tamagui";
import "../../global.css";

export default function Tournaments () {
    let tournaments: Tournament[] = [
        { id: 1, name: "UTM Champions", active: true, creator: "Director UTM", sport: "Fútbol" },
        { id: 2, name: "PUCE Cup", active: true, creator: "Director PUCE", sport: "Fútbol" },
        { id: 3, name: "Inter University", active: true, creator: "Organización deportiva Portoviejo", sport: "Fútbol" },
    ]
    let tournaments2: Tournament[] = [
        { id: 1, name: "Software", active: true, creator: "Oscar López", sport: "Fútbol" },
        { id: 2, name: "Medicina", active: true, creator: "Tatiana Cobeña", sport: "Fútbol" },
        { id: 3, name: "Economía", active: true, creator: "Tito Gorozabel", sport: "Fútbol" },
    ]
    let [ modalVisible, setModalVisible ] = useState(false);
    let [ tournamentSelected, setTournamentSelected ]: [ Tournament | undefined, React.Dispatch<React.SetStateAction<Tournament | undefined>> ] = useState();

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
                            {tournaments.map((tournament) => <TournamentCard tournament={tournament} selectThisTournemat={selectThisTournamet} key={tournament.id} />)}
                        </XStack>
                    </ScrollView>
                </YStack>
                {tournamentSelected && // Renderiza solo si hay un torneo seleccionado 
                <YStack flex={1} width={"100%"} p={"$3"}>
                    <YStack flex={1} width={"100%"} rounded={"$5"} theme={"dark_yellow"} borderWidth={"$0.5"} borderColor={"$borderColor"} bg={"$background"}>
                        <H3 text={"center"} p={"$2"} color={"$colorFocus"}>
                            {tournamentSelected.name}
                        </H3>
                        <XStack  gap={1} px={10}>
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
                        </XStack>
                        <ScrollView
                            mt={5}
                        >
                            <YStack p={5} gap={5}>
                                {tournaments2.map((tournament) => <TournamentCard tournament={tournament} selectThisTournemat={selectThisTournamet} key={tournament.id} />)}
                            </YStack>
                        </ScrollView>
                    </YStack>

                </YStack>
                }
                
                <YStack mt={"auto"}>
                    <Button flexDirection="column" theme={"yellow"} rounded={"$9"} bg={"$yellow11"} p={5} 
                    onPress={() => toggleModal(true)}
                    >
                        <Text theme={"light"}>
                            <MaterialIcons size={30} name="add" />
                        </Text>
                    </Button>
                </YStack>
            </YStack>

            
        </YStack>
        <TournamentModal visible={modalVisible} toggleModal={toggleModal} />
        </>
        

    )
}