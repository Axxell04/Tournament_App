import { Tournament } from "@/interfaces/tournament"
import { useEffect, useState } from "react"
import { Button, H3, Paragraph } from "tamagui"

interface Props {
    tournament: Tournament
    selectThisTournemat: (tournamet: Tournament) => void
    tournamentSelected: Tournament | undefined
}

export default function TournamentCard ({ tournament, selectThisTournemat, tournamentSelected }: Props) {
    const [ isSelected, setIsSelected ] = useState(false);
    useEffect(() => {
        if (tournamentSelected) {
            if (tournamentSelected.id === tournament.id) {
                setIsSelected(true);
            } else {
                setIsSelected(false);
            }

        }
    }, [tournamentSelected, tournament])
    return (
        <Button height={"$11"} flexDirection="column"
        onPress={() => selectThisTournemat(tournament)}
        bg={isSelected ? "$backgroundHover" : "$backgroundPress"}
        >            
            <H3 color={"$color8"} select={"none"}>
                {tournament.name}
            </H3>
            <Paragraph color={"$color04"} select={"none"}>
                {tournament.creator}
            </Paragraph>
            {/* <Card bg={"transparent"} z={1}
            >
                <Card.Header>
                </Card.Header>
            </Card> */}
        </Button>
    )
}