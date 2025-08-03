import { FirebaseApp } from "firebase/app";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { app, auth, firestore } from "../../firebase-config";

interface FirebaseContextValue {
    app: FirebaseApp
    auth: Auth
    firestore: Firestore
    money: number | undefined
    setMoney: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const FirebaseContext = createContext<FirebaseContextValue>({
    app: app,
    auth: auth,
    firestore: firestore,
    money: undefined,
    setMoney: () => {}
})

export default function FirebaseProvider ({ children }: { children: React.ReactNode}) {
    const [ appState ] = useState(app);
    const [ authState ] = useState(auth);
    const [ firestoreState ] = useState(firestore);

    const [ moneyState, setMoneyState ] = useState<number | undefined>();

    useEffect(() => {
        console.log('auth:', auth);

        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuario autenticado: "+user.displayName);
            } else {
                console.log("Usuario no autenticado");
            }
        })
        return unsub();
    }, [])
    
    return (
        <FirebaseContext.Provider value={{app: appState, auth: authState, firestore: firestoreState, money: moneyState, setMoney: setMoneyState }}>
            { children }
        </FirebaseContext.Provider>
    )
}
