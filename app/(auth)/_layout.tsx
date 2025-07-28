import AuthProvider from "@/context-providers/auth/FirebaseProvider";
import { Stack } from "expo-router";

export default function AuthLayout () {
    return (
        <AuthProvider>
            <Stack initialRouteName="login" screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    )
}