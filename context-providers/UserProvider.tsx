import { User } from "firebase/auth";
import React, { createContext, useState } from "react";

interface UserContextValue {
    user?: User
    money?: number
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    setMoney: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const UserContext = createContext<UserContextValue>({
    user: undefined,
    money: undefined,
    setUser: () => {},
    setMoney: () => {}
})

export default function UserProvider ({ children }: { children: React.ReactNode }) {
    const [ user, setUser ] = useState<User | undefined>();
    const [ money, setMoney ] = useState<number | undefined>();
    return (
        <UserContext.Provider value={{ user, setUser, money, setMoney }}>
            { children }
        </UserContext.Provider>
    )
}