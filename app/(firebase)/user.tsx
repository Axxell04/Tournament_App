import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { UserContext } from "@/context-providers/UserProvider";
import { FirestoreService } from "@/services/firestore-service";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { Button, Paragraph, XStack, YStack } from "tamagui";

export default function UserScreen () {
    const { firestore } = useContext(FirebaseContext);
    const { user } = useContext(UserContext);
    const router = useRouter();

    async function addUser () {
        try {
            const docRef = await addDoc(collection(firestore, "users"), {username: "Axxell04", id: "1234"});
            console.log(docRef.id)
        } catch (error) {
            console.log(error)
        }
    }

    async function readUser () {
        try {
            const userRef = doc(firestore, "users", "VFT85TlLIKCh20cSmxtY")
            const querySnapshot = await getDoc(userRef);
            console.log(querySnapshot.data()?.username)
        } catch (error) {
            console.log(error);
        }
    }
    
    async function readUsers () {
        try {
            const querySnapshot = await getDocs(collection(firestore, "users"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().username}`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getMoney () {
        if (!user) { return }
        const fbService = new FirestoreService(firestore);
        console.log(await fbService.getMoney(user.uid))
    }

    return (
        <YStack bg={"$background"} flex={1}>
            <XStack py={5} px={10}>
                <Button 
                    icon={<ArrowLeft size={25} />}
                    pl={5}
                    pr={10}
                    chromeless
                    color={"$color08"}
                    onPress={() => router.back()}
                >
                    Regresar
                </Button>
            </XStack>
            <Paragraph>
                User 
            </Paragraph>
            <Button 
                onPress={addUser}
            >
                Add User
            </Button>
            <Button 
                onPress={readUser}
            >
                Get Users
            </Button>
            <Button 
                onPress={getMoney}
            >
                Get Money
            </Button>
        </YStack>
    )
}