import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { app, auth, firestore } from "../../firebase-config";

export const FirebaseContext = createContext({
    app: app,
    auth: auth,
    firestore: firestore
})

export default function FirebaseProvider ({ children }: { children: React.ReactNode}) {
    const [ appState ] = useState(app);
    const [ authState ] = useState(auth);
    const [ firestoreState ] = useState(firestore);

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
        <FirebaseContext.Provider value={{app: appState, auth: authState, firestore: firestoreState}}>
            { children }
        </FirebaseContext.Provider>
    )
}
