import ReturnBar from "@/components/ReturnBar";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { CircleUserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Button, Paragraph, XStack, YStack } from "tamagui";

export default function AdminOptions () {
    const { auth } = useContext(FirebaseContext);

    const router = useRouter();
     
    return (
        <YStack flex={1} bg={"$background"}>
            <ReturnBar />
            <YStack flex={1} items={"center"} gap={30}>
                <YStack items={"center"} justify={"center"} gap={5}>
                    <Paragraph color={"$color06"}>
                        Administrador
                    </Paragraph>                
                    <XStack gap={10} opacity={0.7}>
                        <CircleUserRound size={25} />
                        <Paragraph fontSize={20}>
                            {auth.currentUser?.displayName}
                        </Paragraph>
                    </XStack>
                </YStack>
                <YStack items={"center"} gap={10}>
                    <Button bg={"$colorFocus"} color={"$background"} pressStyle={{bg: "$color9", borderColor: "$color"}}
                        onPress={() => router.push("/(admin)/new_code")}
                    >
                        Nuevo código
                    </Button>
                    <Button color={"$colorFocus"}
                        chromeless
                        onPress={() => router.push("/(admin)/list_codes")}
                    >
                        Ver códigos
                    </Button>
                </YStack>
            </YStack>
        </YStack>
    )
}