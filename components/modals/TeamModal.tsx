import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { TeamContext } from "@/context-providers/TeamsProvider";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { FirestoreService } from "@/services/firestore-service";
import { Trash, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import { Button, Input, Label, Spinner, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
    mode?: "add" | "edit"
    teamSelected?: Team
    setTeamSelected?: React.Dispatch<React.SetStateAction<Team | undefined>>
    tournamentSelected: Tournament | undefined
}

export default function TeamModal ({visible, toggleModal, mode="add", teamSelected, setTeamSelected, tournamentSelected }: Props) {
    const { firestore, auth } = useContext(FirebaseContext);
    const { setTeams } = useContext(TeamContext);

    const [ name, setName ] = useState("");
    const [ dt, setDt ] = useState("");

    // Estado de las peticiónes
    const [ loading, setLoading ] = useState(false);


    useEffect(() => {
        if (mode === "add") {
            setName("");
            setDt("");
        }
    }, [mode])

    useEffect(() => {
        if (teamSelected && mode === "edit" && visible) {
            setName(teamSelected.name);
            setDt(teamSelected.dt);
        } 
    }, [teamSelected, mode, visible])


    async function addNewTeam () {
        if (!name || !dt || !tournamentSelected || loading) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.addTeam({
            id_tournament: tournamentSelected.id as string,
            name: name.trim(),
            dt: dt.trim()
        });
        setTeams(await fsService.getTeams(tournamentSelected.id as string));
        setLoading(false);
        clearInputs();
        toggleModal(false);
    }

    async function editTeam () {
        if (!name || !dt || !teamSelected || !tournamentSelected || loading) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        const res = await fsService.updateTeam({
            id: teamSelected.id,
            id_tournament: tournamentSelected.id as string,
            name: name.trim(),
            dt: dt.trim()
        })
        if (res && setTeamSelected) {
            setTeamSelected(res);
        };
        setTeams(await fsService.getTeams(tournamentSelected.id as string));
        setLoading(false);
        toggleModal(false);
    }

    async function deleteTeam () {
        if (!teamSelected || !tournamentSelected) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.deleteTeam(tournamentSelected.id as string, teamSelected.id as string);
        if (setTeamSelected) {
            setTeamSelected(undefined);
        }
        setTeams(await fsService.getTeams(tournamentSelected.id as string));
        setLoading(false);
        toggleModal(false);
    }

    function clearInputs () {
        setName("");
        setDt("");
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
                    {/* <Spinner position="absolute" t={30} mx={"auto"} size="large" color={"$colorHover"} /> */}
                    <YStack bg="$background" p={"$3"} borderWidth={"$0.5"} borderColor={"$borderColorHover"} rounded={"$4"} maxW={"80%"} minW={"70%"}
                        onPress={(e) => e.preventDefault()}
                    >                        
                        <Label color={"$colorFocus"} text={"center"}>
                            {mode === "add" ? "Nuevo Equipo" : "Editar Equipo"}
                        </Label>
                        <YStack items={"center"} gap={"$2"}>
                            <Input placeholder="Nombre del equipo" width={"80%"} placeholderTextColor="unset" text={"center"}
                                onChangeText={(text) => setName(text)}
                                value={name}
                            />
                            <Input placeholder="Director técnico" width={"80%"} placeholderTextColor="unset" text={"center"} 
                                onChangeText={(text) => setDt(text)}
                                value={dt}
                            />                            
                            { mode === "add" ?
                                <Button color={"$colorFocus"} onPress={addNewTeam} disabled={loading}>
                                    Crear
                                </Button> :
                                <>
                                <Button color={"$colorFocus"} onPress={editTeam} disabled={loading}>
                                    Editar
                                </Button>                    
                                <Button icon={<Trash size={20} color={"$color06"} />} chromeless onPress={deleteTeam} />
                                </>
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