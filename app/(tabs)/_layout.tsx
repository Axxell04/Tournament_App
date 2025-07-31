import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { FirestoreService } from "@/services/firestore-service";
import { CircleUserRound, DollarSign, Dribbble, Home, Menu, Trophy } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonProps, Paragraph, SizableText, Tabs, XStack } from "tamagui";
import Index from ".";
import Matches from "./matches";
import MenuScreen from "./menu";
import Tournaments from "./tournaments";
// import { Tabs } from "expo-router";

export default function TabLayout () {
    const { firestore, auth } = useContext(FirebaseContext);
    const [ usernameToShow, setUsernameToShow ] = useState("");
    const [ moneyToShow, setMoneyToShow ] = useState<number | undefined>();

    const router = useRouter();
    
    const [ tabFocus, setTabFocus ] = useState("index");
    function focusThisTab (tabName: string) {
        setTabFocus(tabName);
    }
    
    useEffect(() => {
        const firestoreService = new FirestoreService(firestore);
        const getMoney = async () => {
            if (!auth.currentUser || auth.currentUser.isAnonymous) { return };
            setMoneyToShow(await firestoreService.getMoney(auth.currentUser.uid));
        }

        if (!auth.currentUser) {
            router.replace("/(auth)/login");        
        } else if (auth.currentUser.isAnonymous) {
            setUsernameToShow("Invitado");
        } else {
            setUsernameToShow(auth.currentUser.displayName as string);
            getMoney();
        }
    }, [auth, router, firestore, moneyToShow])

    return (
        <Tabs flex={1} flexDirection="column" bg={"$background"}
            defaultValue="index"
            value={tabFocus}
        >
            <XStack bg={"$colorTransparent"} px={10} py={5} gap={5} justify={"space-between"}>
                <XStack items={"center"} gap={10}>                    
                    <XStack items={"center"} gap={5}>
                        <CircleUserRound size={30} opacity={0.9} />
                        <Paragraph fontSize={18} opacity={0.9}>
                            {usernameToShow}
                        </Paragraph>                    
                    </XStack>
                    {(auth.currentUser && !auth.currentUser.isAnonymous) && 
                        <XStack items={"center"} gap={5}>
                            <DollarSign size={23} opacity={0.9} />
                            <Paragraph fontSize={18} opacity={0.9}>
                                {typeof moneyToShow !== "undefined" ? moneyToShow : "-----"}
                            </Paragraph>                    
                        </XStack>
                    }
                </XStack>
                <Button 
                    p={5}
                    icon={<Menu size={30} />}
                    chromeless
                    onPress={() => focusThisTab("menu")}
                >                
                </Button>
            </XStack>
            <Tabs.Content value="index" flex={1}>
                <Stack.Screen options={{ headerShown: false }} />
                <Index />
            </Tabs.Content>
            <Tabs.Content value="tournaments" flex={1}>
                <Stack.Screen options={{ headerShown: false }} />
                <Tournaments />
            </Tabs.Content>
            <Tabs.Content value="matches" flex={1}>
                <Stack.Screen options={{ headerShown: false }} />
                <Matches />
            </Tabs.Content>
            <Tabs.Content value="menu" flex={1}>
                <Stack.Screen options={{ headerShown: false }} />
                <MenuScreen />
            </Tabs.Content>

            <Tabs.List
                // bg={"$red12"}
                disablePassBorderRadius="top"
                justify={"center"}
            >   
                <MyTab tabFocus={tabFocus} focusThisTab={focusThisTab} value="matches">
                    <Dribbble size={20} />
                    <SizableText>
                        Encuentros
                    </SizableText>
                </MyTab>
                <MyTab tabFocus={tabFocus} focusThisTab={focusThisTab} value="index">
                    <Home size={20} />
                    <SizableText>
                        Inicio
                    </SizableText>
                </MyTab>
                <MyTab tabFocus={tabFocus} focusThisTab={focusThisTab} value="tournaments">
                    <Trophy size={20} />
                    <SizableText>
                        Torneos
                    </SizableText>
                </MyTab>
            </Tabs.List>
        </Tabs>
    )
}

function MyTab ({tabFocus, focusThisTab, children, value, ...otherProps}: { tabFocus: string, focusThisTab: (name: string)=>void, children: React.ReactNode, value: string } & ButtonProps)  {
    const [ isFocus, setIsFocus ] = useState(false);
    useEffect(() => {
        if (value === tabFocus) {
            setIsFocus(true);
        } else {
            setIsFocus(false);
        }
    }, [tabFocus, value]);
    return (
        <Button grow={0}
            {...otherProps}
            pressStyle={{bg: "$colorTransparent"}}
            onPress={() => focusThisTab(value)}
            bg={isFocus ? "$backgroundHover" : "$colorTransparent"}
            focusTheme
            opacity={isFocus ? 1 : 0.6}
            rounded={"$radius.12"}
            items={"center"}
        >
            {children}

        </Button>
    )
}