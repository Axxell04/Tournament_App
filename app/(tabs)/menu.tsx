import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { MatchContext } from "@/context-providers/MatchesProvider";
import { ThemesContext } from "@/context-providers/themes/ThemesProvider";
import { DollarSign, LogIn, LogOut } from "@tamagui/lucide-icons";
import { useRouter, } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Button, Paragraph, Switch, ThemeName, XStack, YStack } from "tamagui";

export default function MenuScreen () {
    const { theme, setTheme } = useContext(ThemesContext);
    const { auth, setMoney } = useContext(FirebaseContext);
    const { setMatchSelected } = useContext(MatchContext);
    const router = useRouter();

    const [ dark, setDark ] = useState(theme.includes("dark") ? true : false);

    async function logout () {
        // await signOut(auth);
        setMatchSelected(undefined);
        setMoney(undefined);
        router.replace("/(auth)/login");
    }

    useEffect(() => {

        const THEME_NAME_MAP: Record<ThemeName, true> = {
            dark_yellow: true, light: true, dark: true, light_yellow: true,
            light_green: true, light_blue: true, light_red: true,
            dark_green: true, dark_blue: true, dark_red: true,
            light_accent: true, dark_accent: true, light_black: true,
            light_white: true, dark_black: true, dark_white: true,
            yellow: true, green: true, blue: true, red: true,
            accent: true, black: true, white: true
        };

        function checkTheme (value: string): value is ThemeName {
            return THEME_NAME_MAP.hasOwnProperty(value);
        }

        if (dark) {
            const newTheme = theme.replace("light", "dark")
            if (checkTheme(newTheme)) {
                setTheme(newTheme)
            }
        } else {
            const newTheme = theme.replace("dark", "light")
            if (checkTheme(newTheme)) {
                setTheme(newTheme)
            }

        }
    
    }, [theme, dark, setTheme])


    

    return (
        <YStack flex={1} p={5}>
            <YStack flex={1} items={"center"} gap={30}>
                <YStack>
                    <YStack items={"center"} gap={5}>
                        <Paragraph color={"$color08"}>
                            Temas
                        </Paragraph>
                        <XStack gap={10}>
                            <Paragraph>
                                Claro
                            </Paragraph>
                            <Switch size={"$3"} checked={dark} onCheckedChange={(checked) => setDark(checked)} >  
                                <Switch.Thumb animation={"quick"} />
                            </Switch>
                            <Paragraph>
                                Oscuro
                            </Paragraph>                            
                        </XStack>
                        <XStack flexWrap="wrap" justify={"center"} gap={10}>
                            <Button
                                onPress={() => setTheme(dark ? "dark_red" : "light_red")}
                            >
                                Rojo
                            </Button>
                            <Button
                                onPress={() => setTheme(dark ? "dark_green" : "light_green")}
                            >
                                Verde
                            </Button>
                            <Button
                                onPress={() => setTheme(dark ? "dark_yellow" : "light_yellow")}
                            >
                                Amarillo
                            </Button>
                            <Button
                                onPress={() => setTheme(dark ? "dark_blue" : "light_blue")}
                            >
                                Azul
                            </Button>
                        </XStack>
                    </YStack>
                </YStack>
                {/* <Button onPress={() => router.push("/(firebase)/user")}>
                    Ir al firebase screen
                </Button> */}
                {!auth.currentUser?.isAnonymous &&
                <YStack flex={1} items={"center"} gap={10}>
                    <Paragraph color={"$color08"}>
                        Opciones de Usuario
                    </Paragraph>
                    <YStack gap={10}>
                        <Button
                            icon={<DollarSign size={20} color={"$color"} />}
                            onPress={() => router.push("/(bets)/list_bets")}
                        >
                            Ver balance
                        </Button>
                    </YStack>
                </YStack>
                }
                {auth.currentUser?.isAnonymous 
                ? 
                <Button 
                    chromeless
                    icon={<LogIn size={25} />}
                    mt={"auto"}
                    mb={20}
                    color={"$color08"}
                    onPress={() => {router.push("/(auth)/login")}}
                >
                    Login
                </Button>
                :
                <Button 
                    chromeless
                    icon={<LogOut size={25} />}
                    mt={"auto"}
                    mb={20}
                    color={"$color08"}
                    onPress={logout}
                >
                    Logout
                </Button>
                }
            </YStack>
        </YStack>
    )
}