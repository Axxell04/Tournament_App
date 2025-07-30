import { NewTournament, Tournament } from "@/interfaces/tournament";
import { User } from "@/interfaces/user";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, setDoc } from "firebase/firestore";

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
            querySnapshot.forEach((doc) => {
                const tournament = doc.data() as Tournament;
                console.log(tournament.name);
            })
        } catch (error) {
            console.log(error);
        }
    }

    async addTournament (newTournament: NewTournament) {
        try {
            const docTournamentRef = await addDoc(collection(this.firestore, "tournaments"), newTournament);
            console.log("NewTournament ID: "+docTournamentRef.id);
        } catch (error) {
            console.log(error);
        }
    }

}