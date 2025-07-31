import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCm_QNF7lj1Va4HxqCDJw3V6ZeDqLgFezE",
  authDomain: "tournament-app-001.firebaseapp.com",
  projectId: "tournament-app-001",
  storageBucket: "tournament-app-001.firebasestorage.app",
  messagingSenderId: "137066491444",
  appId: "1:137066491444:web:32d4c3a7506bcdb00da461",
  measurementId: "G-0QGE8DE90N"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
let auth: Auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    })

} catch {
  auth = getAuth(app);
}

const firestore = getFirestore(app);

export { app, auth, firestore };

