import CodeCard from "@/components/CodeCard";
import ReturnBar from "@/components/ReturnBar";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Code } from "@/interfaces/code";
import { FirestoreService } from "@/services/firestore-service";
import { CircleUserRound } from "@tamagui/lucide-icons";
import { useFocusEffect } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useContext, useState } from "react";
import { Paragraph, ScrollView, Spinner, XStack, YStack } from "tamagui";

export default function ListCodes () {
    const { auth, firestore } = useContext(FirebaseContext);
    const [ codes, setCodes ] = useState<Code[]>([]);
    const [ loading, setLoading ] = useState(false);


    useFocusEffect(
        useCallback(() => {
            const loadCodes = async () => {
                setLoading(true);
                const fsService = new FirestoreService(firestore)
                setCodes(await fsService.getCodes(auth.currentUser?.uid as string));
                setLoading(false);
            };
            loadCodes();
            const unsub = onSnapshot(query(collection(firestore, "codes"), where("ownerId", "==", auth.currentUser?.uid)), (docSnap) => {
                setCodes(docSnap.docs.map(c => c.data() as Code));
            })
            return () => unsub();
        }, [auth.currentUser, firestore])
    );

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
                <ScrollView>
                    {loading 
                    ?
                    <Spinner size="large" color={"$colorFocus"} />
                    :
                    <YStack gap={10} p={10}>
                        {codes.map((code) => (
                            <CodeCard key={code.id} code={code} />
                        ))}
                    </YStack>
                    }
                </ScrollView>
            </YStack>
        </YStack>
    )
}