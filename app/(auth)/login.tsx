import { AuthContext } from "@/context-providers/auth/AuthProvider";
import { UserContext } from "@/context-providers/UserProvider";
import { Stack, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  signInAnonymously,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { Button, H4, Input, Label, YStack } from "tamagui";
export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

  async function handleSignInUser() {
    if (!email) { 
      ToastAndroid.show("Debe ingresar un correo", ToastAndroid.LONG)
      return
    }

    if (!password) {
      ToastAndroid.show("Debe ingresar una contraseña", ToastAndroid.LONG)
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      setUser(userCredential.user);
      // console.log("Usuario autenticado:", userCredential.user);
      ToastAndroid.show(`Bienvenido ${userCredential.user.displayName}`, ToastAndroid.SHORT)
      clearInputs();
      if (router.canGoBack()) {
        router.back();
      }
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email") {
          ToastAndroid.show("Ingrese un correo válido", ToastAndroid.SHORT)
        } else if (error.code === "auth/invalid-credential") {
          ToastAndroid.show("Correo o contraseña incorrecta", ToastAndroid.SHORT)
        } else {
          ToastAndroid.show(error.code, ToastAndroid.SHORT)
        }              
      } else {
        console.log("Error en autenticación:", error);
        ToastAndroid.show("A ocurrido un error", ToastAndroid.SHORT)
      }
    }
  }

  async function handleSignInAsAnonymous () {
    try {
      const userCredential = await signInAnonymously(auth);
      setUser(userCredential.user);
      clearInputs();
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof FirebaseError) {
        ToastAndroid.show(error.code, ToastAndroid.SHORT)
      }
      console.log(error);
    }
  }

  function clearInputs () {
    setEmail("");
    setPassword("");
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
          <H4 color={"$colorFocus"}>Login</H4>
          <YStack items={"center"} gap={30}>
            <YStack items={"center"} gap={5}>                            
                <YStack items={"center"}>
                  <Label>Correo</Label>
                  <Input
                      placeholder="Ingrese su correo"
                      minW={200}
                      text={"center"}
                      color={"$colorHover"}
                      onChangeText={(t) => setEmail(t)}
                      value={email}
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
                      value={password}
                  />
                </YStack>
            </YStack>
            <Button onPress={() => handleSignInUser()}>Login</Button>
            <Button color={"$color08"} chromeless onPress={() => router.push("/(auth)/register")}>
              Register
            </Button>
            {!router.canGoBack() &&
              <Button color={"$color04"} chromeless onPress={handleSignInAsAnonymous}>
                Ingresar como invitado
              </Button>
            }
          </YStack>
        </YStack>
      </YStack>
    </>
  );
}
