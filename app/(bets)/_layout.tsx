import { Stack } from "expo-router";

export default function BetsLayout () {
    return (
        <Stack initialRouteName="make_bet" >
            <Stack.Screen name="make_bet" options={{
                headerShown: false
            }} 
            />
            <Stack.Screen name="list_bets" options={{
                headerShown: false
            }}
            />
            <Stack.Screen name="top_up_money" options={{
                headerShown: false
            }}
            />
            <Stack.Screen name="camera_scan" options={{
                headerShown: false
            }}
            />
        </Stack>
    )
}