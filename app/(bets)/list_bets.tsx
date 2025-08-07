import BetCard from "@/components/BetCard";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Bet } from "@/interfaces/bet";
import { ArrowLeft, CircleUserRound, DollarSign } from "@tamagui/lucide-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Paragraph, ScrollView, Spinner, XStack, YStack } from "tamagui";


export default function ListBets () {
    const { auth, money, firestore } = useContext(FirebaseContext);
    const [ loading, setLoading ] = useState(true );
    const [ bets, setBets ] = useState<Bet[]>([]);
    const router = useRouter();

    useEffect(() => {
        const q = query(collection(firestore, `bets`), where("id_user", "==", auth.currentUser?.uid));

        const unsub = onSnapshot(q, (docSnap) => {
            // console.log(docSnap.docs);
            setBets(docSnap.docs.map(b => b.data() as Bet));
            setLoading(false);
        })

        return () => unsub();

    }, [auth, firestore]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
        }, [])
    )

    return (
        <YStack flex={1} bg={"$background"}>
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
            <YStack flex={1} items={"center"} gap={30}>
                <YStack items={"center"} justify={"center"} gap={10}>
                    <XStack gap={10} opacity={0.6}>
                        <CircleUserRound size={25} />
                        <Paragraph fontSize={20}>
                            {auth.currentUser?.displayName}
                        </Paragraph>
                    </XStack>
                    <XStack gap={5}>
                        <DollarSign size={25} color={"$colorFocus"} />
                        <Paragraph fontSize={20}  color={"$colorHover"}>
                            {money}
                        </Paragraph>
                    </XStack>
                </YStack>
                <YStack flex={1} items={"center"} gap={10}>
                    <Paragraph color={"$color08"}>
                        Historial de apuestas
                    </Paragraph>
                    {loading 
                    ?
                    <YStack items={"center"}>
                        <Spinner position="absolute" t={5} size="large" color={"$colorFocus"} />
                    </YStack>
                    :
                    <ScrollView>
                        <YStack gap={10}>
                            {bets.map((bet, index) => <BetCard bet={bet} key={bet.id} /> )}
                        </YStack>
                    </ScrollView>
                    }
                </YStack>
                <YStack p={50}>
                    <Button bg={"$colorFocus"} color={"$background"} pressStyle={{bg: "$color9", borderColor: "$color"}}
                        onPress={() => router.push("/(bets)/top_up_money")}
                    >
                        Recargar dinero
                    </Button>
                </YStack>
            </YStack>
        </YStack>
    )
}