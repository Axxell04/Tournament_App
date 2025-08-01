import { Match } from "@/interfaces/firestore/match";
import { Team } from "@/interfaces/firestore/team";
import { Tournament } from "@/interfaces/firestore/tournament";
import { User } from "@/interfaces/user";
import { collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, Query, query, setDoc, updateDoc, where } from "firebase/firestore";

export class FirestoreService {
    constructor(private firestore: Firestore) {}

    /*************
        USER
    *************/
    async addUser (user: User) {
        try {
            const docUserRef = doc(this.firestore, "users", user.id);
            await setDoc(docUserRef, user);
        } catch (error) {
            console.log(error);
        }
    }

    async getMoney (userId: string) {
        try {
            const docUserRef = doc(this.firestore, "users", userId);
            const querySnapshot = await getDoc(docUserRef);
            const user = querySnapshot.data() as User;
            return user.money;
        } catch (error) {
            console.log(error);
        }
    }

    /*************
        TOURNAMENT
    *************/

    async getTournaments (userId?: string) {
        try {
            let q: Query | CollectionReference = collection(this.firestore, "tournaments");
            if (userId) {
                q = query(q, where("ownerId", "==", userId));
            } 
            const querySnapshot = await getDocs(q);
            const tournaments: Tournament[] = querySnapshot.docs.map((doc) => doc.data() as Tournament);
            return tournaments
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addTournament (newTournament: Tournament) {
        try {
            const docTournamentRef = doc(collection(this.firestore, "tournaments"));
            newTournament.id = docTournamentRef.id;
            await setDoc(docTournamentRef, newTournament)
        } catch (error) {
            console.log(error);
        }
    }

    async updateTournament (updatedTournament: Tournament) {
        try  {
            await updateDoc(doc(this.firestore, `tournaments/${updatedTournament.id}`), {...updatedTournament})
            const snapshot = await getDoc(doc(this.firestore, `tournaments/${updatedTournament.id}`));
            return snapshot.data() as Tournament;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async deleteTournament (idTournament: string) {
        try {            
            const snapshot = await getDocs(collection(this.firestore, `tournaments/${idTournament}/teams`));
            const deletePromises = snapshot.docs.map((team) => deleteDoc(team.ref));
            await Promise.all(deletePromises);
            await deleteDoc(doc(this.firestore, `tournaments/${idTournament}`));
        } catch (error) {
            console.log(error);
        }
    }

    /*************
        TEAM
    *************/

    async addTeam (newTeam: Team) {
        try {
            const docTeamRef = doc(collection(this.firestore, `tournaments/${newTeam.id_tournament}/teams`));
            newTeam.id = docTeamRef.id;
            await setDoc(docTeamRef, newTeam);
        } catch (error) {
            console.log(error);
        }
    }

    async getTeams (idTournament: string) {
        try {
            const snapshot = await getDocs(collection(this.firestore, `tournaments/${idTournament}/teams`));
            const teams: Team[] = snapshot.docs.map((d) => d.data() as Team);
            return teams;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async updateTeam (updatedTeam: Team) {
        try {
            const docTeamRef = doc(this.firestore, `tournaments/${updatedTeam.id_tournament}/teams/${updatedTeam.id}`);
            await updateDoc(docTeamRef, {...updatedTeam});
            const snapshot = await getDoc(doc(this.firestore, `tournaments/${updatedTeam.id_tournament}/teams/${updatedTeam.id}`))
            return snapshot.data() as Team
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async deleteTeam (idTournament: string, idTeam: string) {
        try  {
            await deleteDoc(doc(this.firestore, `tournaments/${idTournament}/teams/${idTeam}`));
        } catch (error) {
            console.log(error);
        }
    }

    /*************
        MATCH
    *************/

    async getMatches () {
        try {
            const snapshot = await getDocs(collection(this.firestore, `matches`));
            const matches = snapshot.docs.map((m) => m.data() as Match);
            return matches
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addMatch (newMatch: Match) {
        try {
            const docMatchRef = doc(collection(this.firestore, `matches`));
            newMatch.id = docMatchRef.id;
            await setDoc(docMatchRef, newMatch);
        } catch (error) {
            console.log(error);
        }
    }

    async updateMatch (updatedMatch: Match) {
        try {
            await updateDoc(doc(this.firestore, `matches/${updatedMatch.id}`), {...updatedMatch});
            const snapshot = await getDoc(doc(this.firestore, `matches/${updatedMatch.id}`));
            return snapshot.data() as Match;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async solveMatch (idMatch: string, goalsFirstTeam: number, goalsSecondTeam: number) {
        try {
            const date = new Date();
            await updateDoc(doc(this.firestore, `matches/${idMatch}`), {
                goals_first_team: goalsFirstTeam,
                goals_second_team: goalsSecondTeam,
                executed: true,
                executedAt: date.toLocaleDateString()
            })
        } catch (error) {
            console.log(error);
        }
    }

    async deleteMatch (idMatch: string) {
        try {
            await deleteDoc(doc(this.firestore, `matches/${idMatch}`));
        } catch (error) {
            console.log(error);
        }
    }

}