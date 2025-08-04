import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { MatchContext } from "@/context-providers/MatchesProvider";
import { TournametContext } from "@/context-providers/TournamentsProvider";
import { Match } from "@/interfaces/match";
import { Tournament } from "@/interfaces/tournament";
import { User } from "@/interfaces/user";
import { CircleUserRound, DollarSign, Dribbble, Home, Menu, Trophy } from "@tamagui/lucide-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, ButtonProps, Paragraph, SizableText, Tabs, XStack } from "tamagui";
import Index from ".";
import Matches from "./matches";
import MenuScreen from "./menu";
import Tournaments from "./tournaments";
// import { Tabs } from "expo-router";

export default function TabLayout () {
    const { firestore, auth, money, setMoney } = useContext(FirebaseContext);
    const { setMatches } = useContext(MatchContext);
    const { setTournaments } = useContext(TournametContext);
    const [ usernameToShow, setUsernameToShow ] = useState("");

    // const [ unsubSnapUser, setUnsubSnapUser ] = useState<Unsubscribe | undefined>();
    // const [ unsubSnapMatches, setUnsubSnapMatches ] = useState<Unsubscribe | undefined>();
    // const [ unsubSnapTournaments, setUnsubSnapTournaments ] = useState<Unsubscribe | undefined>();

    const router = useRouter();
    
    const [ tabFocus, setTabFocus ] = useState("index");
    function focusThisTab (tabName: string) {
        setTabFocus(tabName);
    }
    
    useEffect(() => {
        if (!auth.currentUser && router) {
            router.replace("/(auth)/login");        
        } else if (auth.currentUser?.isAnonymous) {
            setUsernameToShow("Invitado");
        } else {
            setUsernameToShow(auth.currentUser?.displayName as string);
        }

    }, [auth, router, firestore])

    // useEffect(() => {
    //     if (auth && router) {

    //         const unsubscribeAuthChange = onAuthStateChanged(auth, (u) => {
    //             if (u) {
    //                 console.log("LogIn: "+u.displayName);
    //                 // Listener para actualizaciones en tiempo real
                    
    //             } else {
    //                 console.log("LogOut");
    //             }
    //         })
    
    //         const usUser = onSnapshot(doc(firestore, "users", auth.currentUser?.uid as string), (docSnap) => {
    //             if (docSnap.exists()) {
    //                 const user = docSnap.data() as User;
    //                 setMoney(user.money);
    //             }
    //         })
    //         const usMatches = onSnapshot(query(collection(firestore, "matches"), orderBy("plannedAt")), (docSnap) => {
    //             setMatches(docSnap.docs.map((m) => m.data() as Match));
    //         })
    //         const usTournaments = onSnapshot(query(collection(firestore, "tournaments"), orderBy("ownerName")), (docSanp) => {
    //             setTournaments(docSanp.docs.map((t) => t.data() as Tournament));
    //         })
            
    //         return () => {            
    //             unsubscribeAuthChange();
    //             usUser();
    //             usMatches();
    //             usTournaments();
    //             console.log("Limpiando listeners")
    //         };
    //     }

    // }, [auth, firestore, setMoney, setMatches, setTournaments, router]);

    useFocusEffect(
        useCallback(() => {
            // const unsubscribeAuthChange = onAuthStateChanged(auth, (u) => {
            //     if (u) {
            //         console.log("LogIn: "+u.displayName);
            //         // Listener para actualizaciones en tiempo real
                    
            //     } else {
            //         console.log("LogOut");
            //     }
            // })
    
            const usUser = onSnapshot(doc(firestore, "users", auth.currentUser?.uid as string), (docSnap) => {
                if (docSnap.exists()) {
                    const user = docSnap.data() as User;
                    setMoney(user.money);
                }
            })
            const usMatches = onSnapshot(query(collection(firestore, "matches"), orderBy("plannedAt")), (docSnap) => {
                setMatches(docSnap.docs.map((m) => m.data() as Match));
            })
            const usTournaments = onSnapshot(query(collection(firestore, "tournaments"), orderBy("ownerName")), (docSanp) => {
                setTournaments(docSanp.docs.map((t) => t.data() as Tournament));
            })
            
            return () => {            
                // unsubscribeAuthChange();
                usUser();
                usMatches();
                usTournaments();
                // console.log("Limpiando listeners")
            };
        }, [auth, firestore, setMoney, setMatches, setTournaments])
    )

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
                        <XStack items={"center"} gap={5} onPress={() => router.push("/(bets)/list_bets")}>
                            <DollarSign size={23} opacity={0.9} />
                            <Paragraph fontSize={18} opacity={0.9}>
                                {typeof money !== "undefined" ? money : "-----"}
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