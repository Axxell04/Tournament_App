import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider"
import { Team } from "@/interfaces/team"
import { useContext, useEffect, useState } from "react"
import { Button, Paragraph } from "tamagui"


interface Props {
    team: Team
    selectThisTeam: (team: Team) => void
    teamSelected: Team | undefined
    toggleModal?: (visible?: boolean) => void
    setModalTeamMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>
    isMyTournament: boolean
}

export default function TeamCard ({ team, selectThisTeam, teamSelected, setModalTeamMode, toggleModal, isMyTournament }: Props) {
    const { auth } = useContext(FirebaseContext);
    const [ isSelected, setIsSelected ] = useState(false);
    useEffect(() => {
        if (teamSelected) {
            if (teamSelected.id === team.id) {
                setIsSelected(true);
            } else {
                setIsSelected(false);
            }

        }
    }, [teamSelected, team])

    function onPress () {
        selectThisTeam(team);
        if (toggleModal && setModalTeamMode) {
            setModalTeamMode("edit");
            toggleModal(true);
        }
    }

    return (
        <Button maxW={"$15"} flexDirection="column"
        onPress={() => { onPress() }}
        disabled={!isMyTournament}
        bg={"$backgroundPress"}
        pressStyle={{bg: "$background", borderColor: "transparent", scale: 1.05}}
        >            
            <Paragraph fontWeight={"bold"} select={"none"}>
                {team.name}
            </Paragraph>
        </Button>
    )
}