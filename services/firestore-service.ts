import { User } from "@/interfaces/user";
import { doc, Firestore, getDoc, setDoc } from "firebase/firestore";

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

    async getMoney(userId: string) {
        try {
            const docUserRef = doc(this.firestore, "users", userId);
            const querySnapshot = await getDoc(docUserRef);
            const user = querySnapshot.data() as User;
            return user.money;
        } catch (error) {
            console.log(error);
        }
    }

}