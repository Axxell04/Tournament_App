import { Team } from "@/interfaces/firestore/team";
import { Tournament } from "@/interfaces/firestore/tournament";
import { User } from "@/interfaces/user";
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

export class FirestoreService {
    constructor(private firestore: Firestore) {}

    async addUser (user: User) {
        try {
            const docUserRef = doc(this.firestore, "users", user.id);
            await setDoc(docUserRef, user);
            console.log("Usuario creado");
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

    async getTournaments () {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, "tournaments"));
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
            console.log("NewTournament ID: "+docTournamentRef.id);
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
            await deleteDoc(doc(this.firestore, `tournaments/${idTournament}`));
        } catch (error) {
            console.log(error);
        }
    }

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
            if (snapshot.exists()) {
                return snapshot.data() as Team
            } else {
                return undefined;
            }
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

}