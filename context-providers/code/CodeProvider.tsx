import React, { createContext, useState } from "react";

interface CodeContextValue {
    codeScanned: string
    setCodeScanned: React.Dispatch<React.SetStateAction<string>>
}

export const CodeContext = createContext<CodeContextValue>({
    codeScanned: "",
    setCodeScanned: () => {}
})

export default function CodeProvider ({ children }: { children: React.ReactNode }) {
    const [ codeScanned, setCodeScanned ] = useState("");
    return (
        <CodeContext.Provider value={{ codeScanned, setCodeScanned }} >
            { children }
        </CodeContext.Provider>
    )
}