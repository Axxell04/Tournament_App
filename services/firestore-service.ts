import { Bet } from "@/interfaces/bet";
import { Code } from "@/interfaces/code";
import { Match } from "@/interfaces/match";
import { Team } from "@/interfaces/team";
import { Tournament } from "@/interfaces/tournament";
import { User } from "@/interfaces/user";
import { collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, Query, query, setDoc, updateDoc, where } from "firebase/firestore";

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
            await updateDoc(doc(this.firestore, `tournaments`, updatedTournament.id as string), {...updatedTournament});
            const snapshot = await getDoc(doc(this.firestore, `tournaments`, updatedTournament.id as string));
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
            await deleteDoc(doc(this.firestore, `tournaments`, idTournament));
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
            const q = query(collection(this.firestore, `matches`), orderBy("plannedAt"));
            const snapshot = await getDocs(q);
            const matches = snapshot.docs.map((m) => m.data() as Match);
            return matches
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getMatch (matchId: string) {
        try {
            const snapshot = await getDoc(doc(this.firestore, `matches`, matchId));
            const match = snapshot.data() as Match;
            return match;
        } catch (error) {
            console.log(error);
            return undefined;
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
            await updateDoc(doc(this.firestore, `matches`, updatedMatch.id as string), {...updatedMatch});
            const snapshot = await getDoc(doc(this.firestore, `matches`, updatedMatch.id as string));
            return snapshot.data() as Match;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async solveMatch (idMatch: string, goalsFirstTeam: number, goalsSecondTeam: number) {
        try {
            const date = new Date();
            await updateDoc(doc(this.firestore, `matches`, idMatch), {
                goals_first_team: goalsFirstTeam,
                goals_second_team: goalsSecondTeam,
                executed: true,
                executedAt: date.toLocaleDateString()
            });
            const snapshotBets = await getDocs(query(collection(this.firestore, `bets`), where("id_match", "==", idMatch)));
            if (snapshotBets.empty) { return }
            const bets = snapshotBets.docs.map(d => d.data() as Bet);
            for (const bet of bets) {
                let won: boolean;
                if (bet.prediction === "1 > 2" && goalsFirstTeam > goalsSecondTeam) {
                    won = true;
                } else if (bet.prediction === "1 < 2" && goalsFirstTeam < goalsSecondTeam) {
                    won = true;
                } else if (bet.prediction === "1 === 2" && goalsFirstTeam === goalsSecondTeam) {
                    won = true;
                } else {
                    won = false;
                }
                await this.solveBet(bet, won);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteMatch (idMatch: string) {
        try {
            await deleteDoc(doc(this.firestore, `matches`, idMatch));
        } catch (error) {
            console.log(error);
        }
    }

    ////////////////
    /// BET   
    ////////////////

    async getBets (userId: string) {
        try {
            const snapshot = await getDocs(query(collection(this.firestore, `bets`), where("id_user", "==", userId)));
            const bets = snapshot.docs.map((b) => b.data() as Bet);
            return bets;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addBet (newBet: Bet, userId: string) {
        try {
            const docBetRef = doc(collection(this.firestore, `bets`));
            newBet.id = docBetRef.id;
            await setDoc(docBetRef, newBet);
            const snapshotUser = await getDoc(doc(this.firestore, `users`, userId));
            const user = snapshotUser.data() as User;
            await updateDoc(doc(this.firestore, `users`, userId), { money: user.money - newBet.value });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateBet (updatedBet: Bet) {
        try {
            await updateDoc(doc(this.firestore, `bets`, updatedBet.id as string), {...updatedBet});
            const snapshot = await getDoc(doc(this.firestore, `bets`, updatedBet.id as string));
            return snapshot.data() as Bet;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async solveBet (bet: Bet, won: boolean) {
        try {
            await updateDoc(doc(this.firestore, `bets`, bet.id as string), {won: won});
            if (won) {                
                const snapshotUser = await getDoc(doc(this.firestore, `users`, bet.id_user));
                const user = snapshotUser.data() as User;
                const newMoney = user.money + (bet.value * 2);
                await updateDoc(doc(this.firestore, `users`, bet.id_user), { money: newMoney });
            } 
        } catch (error) {
            console.log(error);
        }
    }

    ////////////////
    /// CODE
    ////////////////

    async addCode (newCode: Code) {
        try {
            const docCodeRef = doc(collection(this.firestore, `codes`));
            newCode.id = docCodeRef.id;
            await setDoc(docCodeRef, newCode);
        } catch (error) {
            console.log(error)
        }
    }

    async getCodes (userId: string) {
        try {
            const snapshot = await getDocs(query(collection(this.firestore, "codes"), where("ownerId", "==", userId)));
            const codes = snapshot.docs.map((c) => c.data() as Code);
            return codes;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async claimCode (userId: string, codeText: string) {
        try {
            const snapshot = await getDocs(query(collection(this.firestore, `codes`), where("text", "==", codeText)));
            if (!snapshot.empty) {
                const code = snapshot.docs[0].data() as Code;
                if (code.claimed) { return false }
                const snapUser = await getDoc(doc(this.firestore, `users`, userId));
                const user = snapUser.data() as User;
                await updateDoc(doc(this.firestore, "users", userId), { money: user.money + code.value })
                await updateDoc(doc(this.firestore, "codes", code.id as string), { claimed: true });
                return true;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}