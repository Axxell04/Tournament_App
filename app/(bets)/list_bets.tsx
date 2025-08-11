import BetCard from "@/components/BetCard";
import CodeCard from "@/components/CodeCard";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Bet } from "@/interfaces/bet";
import { Code } from "@/interfaces/code";
import { FirestoreService } from "@/services/firestore-service";
import { ArrowLeft, CircleUserRound, DollarSign } from "@tamagui/lucide-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useContext, useState } from "react";
import { Button, Paragraph, ScrollView, Spinner, XStack, YStack } from "tamagui";


export default function ListBets () {
    const { auth, money, firestore } = useContext(FirebaseContext);
    const [ loading, setLoading ] = useState(false);
    const [ bets, setBets ] = useState<Bet[]>([]);
    const [ codes, setCodes ] = useState<Code[]>([]);
    const [ viewState, setViewState ] = useState<"bets" | "codes">("bets");
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const loadBets = async () => {
                setLoading(true);
                const fsService = new FirestoreService(firestore);
                setBets(await fsService.getBets(auth.currentUser?.uid as string));
                setLoading(false);
            }
            const loadCodes = async () => {
                setLoading(true);
                const fsService = new FirestoreService(firestore);
                setCodes(await fsService.getCodes(auth.currentUser?.uid as string));
                setLoading(false);
            }
            loadBets();
            loadCodes();
            const qBets = query(collection(firestore, `bets`), where("id_user", "==", auth.currentUser?.uid));
            const qCodes = query(collection(firestore, `codes`), where("claimedId", "==", auth.currentUser?.uid));

            const unsubBets = onSnapshot(qBets, (docSnap) => {
                // console.log(docSnap.docs);
                setBets(docSnap.docs.map(b => b.data() as Bet));
            })
            const unsubCodes = onSnapshot(qCodes, (docSnap) => {
                setCodes(docSnap.docs.map(c => c.data() as Code));
            })

            return () => {
                unsubBets();
                unsubCodes();
            };

        }, [auth.currentUser, firestore])
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
                <YStack flex={1} items={"center"} gap={10} px={20}>
                    <XStack gap={5}>
                        <Button rounded={15} flex={viewState === "bets" ? 1 : 0}
                            onPress={() => setViewState("bets")}
                            chromeless={viewState !== "bets"}
                        >
                            <Paragraph color={"$colorFocus"} opacity={viewState !== "bets" ? .7 : 1}>
                                Apuestas
                            </Paragraph>
                        </Button>                 
                        <Button rounded={15} flex={viewState === "codes" ? 1 : 0}
                            onPress={() => setViewState("codes")}
                            chromeless={viewState !== "codes"}
                        >
                            <Paragraph color={"$colorFocus"} opacity={viewState !== "codes" ? .7 : 1}>
                                Recargas
                            </Paragraph>
                        </Button>                 
                    </XStack>
                    {loading 
                    ?
                    <YStack items={"center"}>
                        <Spinner position="absolute" t={5} size="large" color={"$colorFocus"} />
                    </YStack>
                    :
                    <ScrollView>
                        <YStack gap={10}>

                            {viewState === "bets" 
                            ?
                            bets.map((bet, index) => <BetCard bet={bet} key={bet.id} /> )
                            :
                            codes.map((code, index) => <CodeCard code={code} key={code.id} />)
                            }
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