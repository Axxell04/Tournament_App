import FirebaseProvider from "@/context-providers/auth/FirebaseProvider";
import CodeProvider from "@/context-providers/code/CodeProvider";
import MatchesProvider from "@/context-providers/MatchesProvider";
import TeamsProvider from "@/context-providers/TeamsProvider";
import ThemesProvider from "@/context-providers/themes/ThemesProvider";
import TournamentsProvider from "@/context-providers/TournamentsProvider";
import { config } from "@/tamagui.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";


export default function RootLayout() {
  return (
    <>
    <TamaguiProvider config={config}>
      <FirebaseProvider>        
        <ThemesProvider>
          <CodeProvider>              
            <TournamentsProvider>
              <TeamsProvider> 
                <MatchesProvider>
                  <SafeAreaView className="flex-1 bg-stone-950">
                    <Stack initialRouteName="(tabs)">
                      <Stack.Screen name="(auth)" options={{
                        headerShown: false
                      }} />
                      <Stack.Screen name="(tabs)" options={{
                        headerShown: false
                      }}/>
                      <Stack.Screen name="(bets)" options={{
                        headerShown: false
                      }} />
                      <Stack.Screen name="(admin)" options={{
                        headerShown: false
                      }} />
                    </Stack>
                  </SafeAreaView>
                  <StatusBar style="light" />
                </MatchesProvider>       
              </TeamsProvider>
            </TournamentsProvider>
          </CodeProvider>
        </ThemesProvider>
      </FirebaseProvider>
    </TamaguiProvider>
    </>

  );
}