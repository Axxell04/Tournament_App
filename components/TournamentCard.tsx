import { Tournament } from "@/interfaces/tournament"
import { useEffect, useState } from "react"
import { Button, H5, Paragraph } from "tamagui"

interface Props {
    tournament: Tournament
    selectThisTournament: (tournamet: Tournament) => void
    tournamentSelected: Tournament | undefined
}

export default function TournamentCard ({ tournament, selectThisTournament, tournamentSelected }: Props) {
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
        <Button height={"$11"} maxW={"$15"} flexDirection="column"
        onPress={() => selectThisTournament(tournament)}
        bg={isSelected ? "$backgroundHover" : "$backgroundPress"}
        >            
            <H5 color={"$color"} select={"none"} numberOfLines={1}>
                {tournament.name}
            </H5>
            <Paragraph color={"$color"} select={"none"} opacity={0.6} numberOfLines={1}>
                {tournament.ownerName}
            </Paragraph>
        </Button>
    )
}