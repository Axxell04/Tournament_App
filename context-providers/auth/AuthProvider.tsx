import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import React, { createContext, useState } from "react";
import { firebaseConfig } from "../../firebase-config";



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthContext = createContext({
    app: app,
    auth: auth
})

export default function AuthProvider ({ children }: { children: React.ReactNode}) {
    const [ appState ] = useState(app);
    const [ authState ] = useState(auth);
    
    return (
        <AuthContext.Provider value={{app: appState, auth: authState}}>
            { children }
        </AuthContext.Provider>
    )
}
