import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
    <SafeAreaView className="flex-1 bg-stone-900">
    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown: false
      }}/>
    </Stack>
    </SafeAreaView>
    <StatusBar style="light" />
    </>

  );
}