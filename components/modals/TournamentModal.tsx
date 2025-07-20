import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Modal } from "react-native";
import { Button, Input, Label, YStack } from "tamagui";

interface Props {
    visible: boolean
    toggleModal: (visible?: boolean) => void
}

export default function TournamentModal ({visible, toggleModal}: Props) {
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
                <YStack flex={1} justify={"center"} items={"center"}>
                    <YStack bg="$black3" p={"$3"} borderWidth={"$0.5"} borderColor={"$yellow11"} rounded={"$4"} maxW={"80%"} minW={"70%"}>
                        <Label color={"$yellow9"} text={"center"}>
                            Nuevo Torneo
                        </Label>
                        <YStack items={"center"} gap={"$2"}>
                            <Input placeholder="Ingrese el nombre" width={"80%"} color={"$yellow12"} text={"center"} />
                            <Button theme={"yellow"} color={"$yellow10"}>
                                Crear
                            </Button>
                            <Button theme={"yellow"} color={"$yellow11"} chromeless p={0} px={9} rounded={"$9"}
                            onPress={() => toggleModal(false)}
                            >
                                <MaterialIcons size={25} name="close" color={"#fbbf24"} />
                            </Button>

                        </YStack>
                    </YStack>
                </YStack>
            </BlurView>
        </Modal>
    )
}