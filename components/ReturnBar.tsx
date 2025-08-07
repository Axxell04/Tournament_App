import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, XStack } from "tamagui";

export default function ReturnBar () {
    const router = useRouter()
    return (
        <XStack py={5} px={10}>                
                <Button
                    icon={<ArrowLeft size={25} />}
                    pl={5}
                    pr={10}
                    chromeless
                    color={"$color08"}
                    onPress={() => router.back()}
                >
                    Regresar
                </Button>
            </XStack>
    )
}