import DBProvider from "@/context-providers/db/DBProvider";
import TeamsProvider from "@/context-providers/TeamsProvider";
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
            <TeamsProvider>              
              <SafeAreaView className="flex-1 bg-stone-950">
                <Stack>
                  <Stack.Screen name="(tabs)" options={{
                    headerShown: false
                  }}/>
                </Stack>
              </SafeAreaView>
              <StatusBar style="light" />
            </TeamsProvider>
          </TournamentsProvider>
        </DBProvider>
      </Theme>
    </TamaguiProvider>
    </>

  );
}