import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { MatchContext } from "@/context-providers/MatchesProvider";
import { BetPrediction } from "@/interfaces/bet";
import { FirestoreService } from "@/services/firestore-service";
import { ArrowLeft, CircleUserRound, DollarSign } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { Button, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";

export default function BetsIndex () {
    const { auth, firestore, setMoney, money } = useContext(FirebaseContext);
    const router = useRouter();

    // Match Context
    const { matchSelected } = useContext(MatchContext);

    // Request's state
    const [ loading, setLoading ] = useState(false);

    // Predict OPT
    const [ predictOpt, setPredictOpt ] = useState<1 | 2 | 3 | undefined>();

    // Bet Value
    const [ betValue, seBetValue ] = useState("");


    function selectThisOpt (opt: 1 | 2 | 3 | undefined) {
        if (opt === predictOpt) {
            setPredictOpt(undefined);
        } else {
            setPredictOpt(opt);
        }
    }

    function handleInputBetValue (text: string) {
        if (parseFloat(text) <= (money as number) && !loading) {
            seBetValue(text);
        } else if (text === "" && !loading) {
            seBetValue("");
        }
    }

    async function makeBet () {
        if (loading || !matchSelected || !matchSelected.id || !auth.currentUser?.uid || money === undefined) { return };
        if (!betValue) {
            ToastAndroid.show("Ingrese el valor de la apuesta", ToastAndroid.SHORT);
            return
        }
        if (!predictOpt) {
            ToastAndroid.show("Realice su preducción", ToastAndroid.SHORT);
            return;
        }
        setLoading(true);
        let prediction: BetPrediction;
        if (predictOpt === 1) {
            prediction = "1 > 2"
        } else if (predictOpt === 2) {
            prediction = "1 < 2"
        } else {
            prediction = "1 === 2"
        }
        const fsService = new FirestoreService(firestore);
        const res = await fsService.addBet({
            id_match: matchSelected.id,
            id_tournament: matchSelected.id_tournament,
            id_user: auth.currentUser.uid,
            value: parseFloat(betValue),
            prediction: prediction
        }, auth.currentUser.uid)
        setLoading(false);
        if (res) {
            setMoney(money - parseFloat(betValue));
            router.back();
        } else {
            ToastAndroid.show("Hubo un error al realiza su apuesta", ToastAndroid.LONG);
        }

    }
    
    return (
        <YStack bg={"$background"} flex={1}>
            {loading &&
            <YStack items={"center"}>
                <Spinner position="absolute" t={5} size="large" color={"$colorFocus"} />
            </YStack>
            }
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
            <YStack flex={1} gap={30}>
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
                <YStack items={"center"}>
                    <Paragraph>
                        Apuesta
                    </Paragraph>
                    <Input placeholder="$$$" minW={100} value={betValue}
                        text={"center"} 
                        keyboardType="numeric" 
                        placeholderTextColor={"unset"} 
                        color={"$colorFocus"} 
                        onChangeText={handleInputBetValue}
                    />
                </YStack>
                <YStack items={"center"} gap={10}>
                    <Paragraph>
                        ¿Quién gana?
                    </Paragraph>
                    <YStack gap={10}>
                        <Button minW={200}
                            borderColor={predictOpt === 1 ? "$colorFocus" : "unset"}
                            onPress={() => selectThisOpt(1)}
                            disabled={loading}
                        >
                            {matchSelected?.name_first_team}
                        </Button>
                        <Button minW={200}
                            borderColor={predictOpt === 2 ? "$colorFocus" : "unset"}
                            onPress={() => selectThisOpt(2)}
                            disabled={loading}
                        >
                            {matchSelected?.name_second_team}
                        </Button>
                        <Button minW={200}
                            borderColor={predictOpt === 3 ? "$colorFocus" : "unset"}
                            onPress={() => selectThisOpt(3)}
                            disabled={loading}
                            >
                            Empate
                        </Button>
                    </YStack>
                </YStack>
                <YStack items={"center"}>                    
                    <Button minW={150} bg={"$colorFocus"}
                        color={"$background"} 
                        pressStyle={{bg: "$color9", borderColor: "$color"}}
                        disabled={loading}
                        onPress={makeBet}
                    >
                        Apostar
                    </Button>
                </YStack>
            </YStack>
        </YStack>
    )
}