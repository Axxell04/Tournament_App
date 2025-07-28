import { User } from "firebase/auth";
import React, { createContext, useState } from "react";

interface UserContextValue {
    user?: User
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserContextValue>({
    user: undefined,
    setUser: () => {}
})

export default function UserProvider ({ children }: { children: React.ReactNode }) {
    const [ user, setUser ] = useState<User | undefined>();
    return (
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    )
}