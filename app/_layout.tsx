import DBProvider from "@/context-providers/db/DBProvider";
import TournamentsProvider from "@/context-providers/TournamentsProvider";
import { config } from "@/tamagui.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

export default function RootLayout() {
  return (
    <>
    <TamaguiProvider config={config}>
      <Theme name={"dark_yellow"}>
        <DBProvider>
          <TournamentsProvider>    
            <SafeAreaView className="flex-1 bg-stone-950">
            <Stack>
              <Stack.Screen name="(tabs)" options={{
                headerShown: false
              }}/>
            </Stack>
            </SafeAreaView>
            <StatusBar style="light" />
          </TournamentsProvider>
        </DBProvider>
      </Theme>
    </TamaguiProvider>
    </>

  );
}