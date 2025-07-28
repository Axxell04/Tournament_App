import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { createContext, useState } from "react";
import { firebaseConfig } from "../../firebase-config";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export const FirebaseContext = createContext({
    app: app,
    auth: auth,
    firestore: firestore
})

export default function FirebaseProvider ({ children }: { children: React.ReactNode}) {
    const [ appState ] = useState(app);
    const [ authState ] = useState(auth);
    const [ firestoreState ] = useState(firestore);
    
    return (
        <FirebaseContext.Provider value={{app: appState, auth: authState, firestore: firestoreState}}>
            { children }
        </FirebaseContext.Provider>
    )
}
