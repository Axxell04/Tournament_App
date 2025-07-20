import { Tournament } from "@/interfaces/tournament"
import { Button, H3, Paragraph } from "tamagui"

interface Props {
    tournament: Tournament
    selectThisTournemat: (tournamet: Tournament) => void
}

export default function TournamentCard ({ tournament, selectThisTournemat }: Props) {
    return (
        <Button height={"$11"} flexDirection="column"
        onPress={() => selectThisTournemat(tournament)}
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