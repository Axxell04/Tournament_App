import { TeamContext } from "@/context-providers/TeamsProvider";
import { NewTeam, Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { DBService } from "@/services/db-service";
import { Trash, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import { Button, Input, Label, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
    mode?: "add" | "edit"
    teamSelected?: Team
    setTeamSelected?: React.Dispatch<React.SetStateAction<Team | undefined>>
    tournamentSelected: Tournament | undefined
}

export default function TeamModal ({visible, toggleModal, mode="add", teamSelected, setTeamSelected, tournamentSelected }: Props) {
    const db = useSQLiteContext();
    const { setTeams } = useContext(TeamContext)

    const [ name, setName ] = useState("");
    const [ dt, setDt ] = useState("");


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
        if (!name || !dt || !tournamentSelected) { return };
        const dbService = new DBService(db);
        const newTeam: NewTeam = {
            id_tournament: tournamentSelected.id,
            name,
            dt
        }
        await dbService.addTeam(tournamentSelected.id, newTeam);
        setTeams(await dbService.getTeams(tournamentSelected.id));
        clearInputs();
        toggleModal();
    }

    async function editTournamet () {
        if (!name || !dt || !teamSelected || !tournamentSelected) { return };
        console.log(name,dt,teamSelected,tournamentSelected)
        const dbService = new DBService(db);
        const res = await dbService.editTeam(teamSelected.id, name, dt);
        if (res && setTeamSelected) {
            setTeamSelected(res);
        };
        setTeams(await dbService.getTeams(tournamentSelected.id));
        toggleModal(false);
    }

    async function deleteTournamet () {
        if (!teamSelected || !tournamentSelected) { return };
        const dbService = new DBService(db);
        const res = await dbService.deleteTeam(teamSelected.id);
        if (res && setTeamSelected) {
            setTeamSelected(undefined);
        }
        setTeams(await dbService.getTeams(tournamentSelected.id));
        toggleModal();
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
                                <Button color={"$colorFocus"} onPress={addNewTeam}>
                                    Crear
                                </Button> :
                                <>
                                <Button color={"$colorFocus"} onPress={editTournamet}>
                                    Editar
                                </Button>                    
                                <Button icon={<Trash size={20} color={"$color06"} />} chromeless onPress={deleteTournamet} />
                                </>
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