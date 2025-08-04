import { User } from "@/interfaces/user";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import React, { createContext, useState } from "react";
import { app, auth, firestore } from "../../firebase-config";

interface FirebaseContextValue {
    app: FirebaseApp
    auth: Auth
    user: User | undefined
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    firestore: Firestore
    money: number | undefined
    setMoney: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const FirebaseContext = createContext<FirebaseContextValue>({
    app: app,
    auth: auth,
    user: undefined,
    setUser: () => {},
    firestore: firestore,
    money: undefined,
    setMoney: () => {}
})

export default function FirebaseProvider ({ children }: { children: React.ReactNode}) {
    const [ appState ] = useState(app);
    const [ authState ] = useState(auth);
    const [ userState, setUserState ] = useState<User | undefined>();
    const [ firestoreState ] = useState(firestore);

    const [ moneyState, setMoneyState ] = useState<number | undefined>();
    
    return (
        <FirebaseContext.Provider value={{
            app: appState, 
            auth: authState, 
            firestore: firestoreState, 
            money: moneyState, 
            setMoney: setMoneyState,
            user: userState,
            setUser: setUserState
            }}>
            { children }
        </FirebaseContext.Provider>
    )
}
