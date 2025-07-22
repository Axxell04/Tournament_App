import { Dribbble, Home, Trophy } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { Button, ButtonProps, SizableText, Tabs } from "tamagui";
import Index from ".";
import Matches from "./matches";
import Tournaments from "./tournaments";
// import { Tabs } from "expo-router";

export default function TabLayout () {
    const [ tabFocus, setTabFocus ] = useState("index");
    function focusThisTab (tabName: string) {
        setTabFocus(tabName);
    }

    return (
        <Tabs flex={1} flexDirection="column" bg={"$background"}
            defaultValue="index"
            value={tabFocus}
        >
            <Tabs.Content value="index" flex={1}>
                <Index />
            </Tabs.Content>
            <Tabs.Content value="tournaments" flex={1}>
                <Tournaments />
            </Tabs.Content>
            <Tabs.Content value="matches" flex={1}>
                <Matches />
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