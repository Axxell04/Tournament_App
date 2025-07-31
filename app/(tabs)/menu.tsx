import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { ThemesContext } from "@/context-providers/themes/ThemesProvider";
import { UserContext } from "@/context-providers/UserProvider";
import { LogIn, LogOut } from "@tamagui/lucide-icons";
import { useRouter, } from "expo-router";
import { signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Paragraph, Switch, ThemeName, XStack, YStack } from "tamagui";

export default function MenuScreen () {
    const { user, setUser } = useContext(UserContext);
    const { theme, setTheme } = useContext(ThemesContext);
    const { auth } = useContext(FirebaseContext);
    const router = useRouter();

    const [ dark, setDark ] = useState(theme.includes("dark") ? true : false);

    function logout () {
        console.log(router.canGoBack())
        signOut(auth);
        setUser(undefined);
        router.replace("/(auth)/login");
    }

    useEffect(() => {
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

    return (
        <YStack flex={1} p={5}>
            <YStack flex={1} items={"center"}>
                <YStack>
                    <YStack items={"center"} gap={5}>
                        <Paragraph>
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
                <Button onPress={() => router.push("/(firebase)/user")}>
                    Ir al firebase screen
                </Button>
                {user?.isAnonymous 
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