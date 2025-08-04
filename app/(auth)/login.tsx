import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { Stack, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  signInAnonymously,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { Button, H4, Input, Label, Spinner, YStack } from "tamagui";
export default function LoginScreen() {
    const { auth } = useContext(FirebaseContext);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    // Request's state
    const [ loading, setLoading ] = useState(false);

    const router = useRouter();

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
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      
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
    } finally {
      setLoading(false);
    }
  }

  async function handleSignInAsAnonymous () {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      // setUser(userCredential.user);
      clearInputs();
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof FirebaseError) {
        ToastAndroid.show(error.code, ToastAndroid.SHORT)
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function clearInputs () {
    setEmail("");
    setPassword("");
  }

  

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <YStack bg={"$background"} flex={1} justify={"center"} items={"center"}>
        {loading &&
        <Spinner size="large" color={"$colorHover"} position="absolute" t={30} mx={"auto"} />
        }
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
                      secureTextEntry
                  />
                </YStack>
            </YStack>
            <Button onPress={() => handleSignInUser()}
              disabled={loading}
            >
              Login
            </Button>
            <Button color={"$color08"} chromeless onPress={() => router.push("/(auth)/register")}
              disabled={loading}
            >
              Register
            </Button>
            {!router.canGoBack() &&
              <Button color={"$color04"} chromeless onPress={handleSignInAsAnonymous}
                disabled={loading}
              >
                Ingresar como invitado
              </Button>
            }
          </YStack>
        </YStack>
      </YStack>
    </>
  );
}
