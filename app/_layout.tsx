import DBProvider from "@/context-providers/db/DBProvider";
import MatchesProvider from "@/context-providers/MatchesProvider";
import TeamsProvider from "@/context-providers/TeamsProvider";
import ThemesProvider, { ThemesContext } from "@/context-providers/themes/ThemesProvider";
import TournamentsProvider from "@/context-providers/TournamentsProvider";
import UserProvider from "@/context-providers/UserProvider";
import { config } from "@/tamagui.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";


export default function RootLayout() {
  const { theme } = useContext(ThemesContext);
  useEffect(() => {
    console.log(theme)
  }, [theme])
  return (
    <>
    <TamaguiProvider config={config}>
      <ThemesProvider>
        <UserProvider>          
          <DBProvider>
            <TournamentsProvider>
              <TeamsProvider> 
                <MatchesProvider>
                  <SafeAreaView className="flex-1 bg-stone-950">
                    <Stack initialRouteName="(auth)">
                      <Stack.Screen name="(auth)" options={{
                        headerShown: false
                      }} />
                      <Stack.Screen name="(tabs)" options={{
                        headerShown: false
                      }}/>
                      <Stack.Screen name="(firebase)" options={{
                        headerShown: false
                      }}/>                    
                    </Stack>
                  </SafeAreaView>
                  <StatusBar style="light" />
                </MatchesProvider>       
              </TeamsProvider>
            </TournamentsProvider>
          </DBProvider>
        </UserProvider>
      </ThemesProvider>
    </TamaguiProvider>
    </>

  );
}