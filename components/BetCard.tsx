import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Bet } from "@/interfaces/bet";
import { Match } from "@/interfaces/match";
import { FirestoreService } from "@/services/firestore-service";
import React, { useContext, useEffect, useState } from "react";
import { Paragraph, XStack, YStack } from "tamagui";


interface Props {
    bet: Bet
}

export default function BetCard ({ bet }: Props) {
    const { firestore } = useContext(FirebaseContext);
    const [ match, setMatch ] = useState<Match | undefined>();

    useEffect(() => {
        const loadMatch = async () => {
            const fsService = new FirestoreService(firestore);
            console.log(444);
            const resMatch = await fsService.getMatch(bet.id_match);
            console.log(resMatch);
            setMatch(resMatch);
        };
        loadMatch();
    }, [bet, firestore])

    return (
        <>
        {match &&
            <XStack py={10} px={20} gap={30} bg={"$backgroundHover"} rounded={10} justify={"space-between"}>
                <YStack gap={5}>
                    <Paragraph color={"$color08"}>
                        {match.name_first_team} - {match.name_second_team}
                    </Paragraph>
                    <Paragraph color={"$color06"}>
                        {bet.prediction === "1 > 2" ? 
                        `Gana ${match.name_first_team}` : 
                        (bet.prediction === "1 < 2" ?
                            `Gana ${match.name_second_team}` :
                            `Empatan`
                        )
                        }
                    </Paragraph>
                </YStack>
                <YStack>
                    <Paragraph color={"$colorFocus"}>
                        {bet.won === undefined ? "¿?" : (bet.won ? "+" : "-")} $ {bet.value}
                    </Paragraph>
                </YStack>
            </XStack>
        }
        </>
    )
}