import { Stack } from "expo-router";

export default function AdminLayout () {
    return (
        <Stack initialRouteName="admin_options">
            <Stack.Screen name="admin_options" options={{
                headerShown: false
            }} />
            <Stack.Screen name="new_code" options={{
                headerShown: false
            }} />
            <Stack.Screen name="list_codes" options={{
                headerShown: false
            }} />
        </Stack>
    )
}