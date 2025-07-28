import React, { createContext, useEffect, useState } from "react";
import { Theme, ThemeName } from "tamagui";

interface ThemeContextValue {
    theme: ThemeName
    setTheme: React.Dispatch<React.SetStateAction<ThemeName>>
}

export const ThemesContext = createContext<ThemeContextValue>({
    theme: "dark_yellow",
    setTheme: () => {}
});

export default function ThemesProvider ({ children }: { children: React.ReactNode }) {
    const [ theme, setTheme ] = useState<ThemeName>("dark_yellow");
    useEffect(() => {
        console.log(theme)
      }, [theme])
    return (
        <ThemesContext.Provider value={{ theme, setTheme }} >
            <Theme name={theme}>
                { children }
            </Theme>
        </ThemesContext.Provider>
    )
}