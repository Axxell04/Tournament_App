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
        </Stack>
    )
}