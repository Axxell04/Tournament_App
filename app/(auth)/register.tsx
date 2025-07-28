import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { User } from "@/interfaces/user";
import { FirestoreService } from "@/services/firestore-service";
import { Stack, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { Button, H4, Input, Label, YStack } from "tamagui";

export default function LoginScreen() {
  const { auth, firestore } = useContext(FirebaseContext);
  const firestoreService = new FirestoreService(firestore);

    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
  
  async function handleCreateUser () {
    if (!username) {
      ToastAndroid.show("Debe ingresar un usuario", ToastAndroid.LONG)
      return
    }
    if (!email) {
      ToastAndroid.show("Debe ingresar un correo", ToastAndroid.LONG)
      return
    }
    if (!password) {
      ToastAndroid.show("Debe ingresar una contraseña", ToastAndroid.LONG)
      return
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password.trim()
        )
        await updateProfile(userCredential.user, {
            displayName: username.trim()
        })

        console.log(userCredential)
        const user: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email as string,
          username: userCredential.user.displayName as string,
          money: 100,
        }
        firestoreService.addUser(user);
        setUsername("");
        setEmail("");
        setPassword("");
        ToastAndroid.show("Registro exitoso", ToastAndroid.SHORT)
        router.back();
    } catch (error) {
        console.log(error)
        if (error instanceof FirebaseError) {
          if (error.code === "auth/invalid-email") {
            ToastAndroid.show("Ingrese un correo válido", ToastAndroid.SHORT)
          } else if (error.code === "auth/email-already-in-use") {
            ToastAndroid.show("El correo ingresado ya está en uso", ToastAndroid.LONG)
          } else if (error.code === "auth/weak-password") {
            ToastAndroid.show("La longitud mínima de la contraseña es 6", ToastAndroid.LONG)
          } else {
            ToastAndroid.show(error.code, ToastAndroid.SHORT)
          }  
        } else {
          ToastAndroid.show("A ocurrido un error", ToastAndroid.SHORT)
        }
    }
  }

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <YStack bg={"$background"} flex={1} justify={"center"} items={"center"}>
        <YStack mb={200} items={"center"} gap={70}>
          <H4 color={"$colorFocus"}>Register</H4>
          <YStack items={"center"} gap={30}>
            <YStack items={"center"} gap={5}>                
                <YStack items={"center"}>
                <Label>Nombre de usuario</Label>
                <Input
                    placeholder="Ingrese su nombre"
                    minW={200}
                    text={"center"}
                    color={"$colorHover"}
                    onChangeText={(t) => setUsername(t)}
                />
                </YStack>
                <YStack items={"center"}>
                <Label>Correo</Label>
                <Input
                    placeholder="Ingrese su correo"
                    minW={200}
                    text={"center"}
                    color={"$colorHover"}
                    onChangeText={(t) => setEmail(t)}
                />
                </YStack>
                <YStack items={"center"}>
                <Label>Contraseña</Label>
                <Input
                    placeholder="Ingrese su contraseña"
                    textContentType="password"
                    minW={200}
                    text={"center"}
                    color={"$colorHover"}
                    onChangeText={(t) => setPassword(t)}
                />
                </YStack>
            </YStack>
            <Button onPress={() => handleCreateUser()}>Register</Button>
            <Button chromeless onPress={() => router.back()}>
              Login
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </>
  );
}
