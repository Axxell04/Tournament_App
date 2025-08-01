import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Tournament } from "@/interfaces/tournament";
import { FirestoreService } from "@/services/firestore-service";
import { Trash, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-native";
import { Adapt, Button, Input, Label, Select, Separator, Sheet, Spinner, Switch, XStack, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
    mode?: "add" | "edit"
    tournamentSelected?: Tournament
    setTournametSelected?: React.Dispatch<React.SetStateAction<Tournament | undefined>>
    listTournamentsMode: "all" | "my"
}

export default function TournamentModal ({visible, toggleModal, mode="add", tournamentSelected, setTournametSelected, listTournamentsMode }: Props) {
    const { firestore, auth } = useContext(FirebaseContext);
    const { setTournaments } = useContext(TournametContext)

    const [ name, setName ] = useState("");
    const [ sport, setSport ] = useState<"Fútbol" | "Baloncesto" | "">("");
    const [ active, setActive ] = useState(false);

    // Request's State
    const [ loading, setLoading ] = useState(false);


    useEffect(() => {
        if (mode === "add") {
            setName("");
            setSport("");
            setActive(false);
        }
    }, [mode])

    useEffect(() => {
        if (tournamentSelected && mode === "edit" && visible) {
            setName(tournamentSelected.name);
            setSport(tournamentSelected.sport);
            setActive(tournamentSelected.active)
        } 
    }, [tournamentSelected, mode, visible])


    async function addNewTournament () {
        if (!name || !sport || !auth.currentUser) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.addTournament({
            ownerId: auth.currentUser.uid,
            ownerName: auth.currentUser.displayName as string,
            name: name,
            sport: sport,
            active: true
        })
        setTournaments(await fsService.getTournaments(listTournamentsMode === "my" ? auth.currentUser.uid : undefined))
        setLoading(false);
        clearInputs();
        toggleModal(false);
    }

    async function editTournamet () {
        if (!name || !auth.currentUser || !sport || !tournamentSelected) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        const res = await fsService.updateTournament({
            id: tournamentSelected.id,
            ownerId: auth.currentUser.uid,
            name: name.trim(),
            sport: sport,
            active: active
        });
        if (res && setTournametSelected) {
            setTournametSelected(res);
        };
        setTournaments(await fsService.getTournaments(listTournamentsMode === "my" ? auth.currentUser.uid : undefined))
        setLoading(false);
        toggleModal(false);
    }

    async function deleteTournamet () {
        if (!tournamentSelected || !auth.currentUser) { return };
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        await fsService.deleteTournament(tournamentSelected.id as string);
        if (setTournametSelected) {
            setTournametSelected(undefined);
        }
        setTournaments(await fsService.getTournaments(listTournamentsMode === "my" ? auth.currentUser.uid : undefined))
        setLoading(false);
        toggleModal();
    }

    function clearInputs () {
        setName("");
        setSport("");
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
                            {mode === "add" ? "Nuevo Torneo" : "Editar Torneo"}
                        </Label>
                        <YStack items={"center"} gap={"$2"}>
                            <Input placeholder="Nombre del torneo" width={"80%"} placeholderTextColor="unset" text={"center"}
                                onChangeText={(text) => setName(text)}
                                value={name}
                            />
                            {/* <Input placeholder="Creador del torneo" width={"80%"} placeholderTextColor="unset" text={"center"} 
                                onChangeText={(text) => setCreator(text)}
                                value={creator}
                            /> */}
                            <Select value={tournamentSelected?.sport && mode === "edit" ? tournamentSelected.sport : sport } onValueChange={(value) => setSport(value as "" | "Fútbol" | "Baloncesto")}>
                                <Select.Trigger width={"min-content"} px={"$7"}>
                                    {sport 
                                    ? <Select.Value placeholder="Deporte" color="$color" items={"center"} text={"center"} />
                                    : <Select.Value placeholder="Deporte" color="$color04" items={"center"} text={"center"} />
                                    }
                                </Select.Trigger>

                                <Adapt when="maxMd" platform="touch">
                                {/* or <Select.Sheet> */}
                                    <Sheet>
                                        <Sheet.Frame bg={"transparent"}>
                                        <Adapt.Contents/>
                                        </Sheet.Frame>
                                        <Sheet.Overlay/>
                                    </Sheet>
                                </Adapt>

                                <Select.Content>
                                    <Select.ScrollUpButton/>
                                    <Select.Viewport>
                                        <Select.Group>
                                            <Select.Label bg={"$backgroundHover"}>
                                                Deportes
                                            </Select.Label>
                                            <Select.Item index={111} value="Fútbol" bg={"$backgroundHover"}>
                                                <Select.ItemText>
                                                    Fútbol
                                                </Select.ItemText>
                                            </Select.Item>
                                            <Select.Item index={222} value="Baloncesto" bg={"$backgroundHover"} borderBottomEndRadius={"$2"} borderBottomStartRadius={"$2"}>
                                                <Select.ItemText>
                                                    Baloncesto
                                                </Select.ItemText>
                                            </Select.Item>
                                        </Select.Group>                        
                                    </Select.Viewport>
                                    <Select.ScrollDownButton />
                                </Select.Content>
                            </Select>
                            { mode === "edit" &&
                                <XStack items={"center"} gap={5}>
                                    <Label color={"$color06"} >Activo</Label>
                                    <Separator vertical />
                                    <Switch size={"$3"} checked={active} onCheckedChange={(checked) => setActive(checked)} >  
                                        <Switch.Thumb animation={"quick"} />
                                    </Switch>
                                </XStack>                
                            }
                            { mode === "add" ?
                                <Button color={"$colorFocus"} onPress={addNewTournament}>
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
                            icon={!loading ? <X size={25} color={"$borderColorHover"} /> : null}
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