import { Stack } from "expo-router";

export default function FirbaseLayout () {
    return (
        <Stack>
            <Stack.Screen name="user" options={{
                headerShown: false
            }} />
        </Stack>

    )
}