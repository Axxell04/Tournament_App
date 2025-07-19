import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout () {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#1c1917",
                borderColor: "#fbbf24"
            },
            tabBarActiveTintColor: "#fbbf24",
            // tabBarInactiveTintColor: "#b45309"
        }}>
            <Tabs.Screen name="index" options={{
                title: "Inicio",
                tabBarIcon: ({ color }) => <MaterialIcons name="home" size={30} color={color} />,
            }} />
            <Tabs.Screen name="tournaments" options={{
                title: "Torneos",
                tabBarIcon: ({ color }) => <MaterialIcons name="emoji-events" size={30} color={color} />
            }} />
        </Tabs>
    )
}