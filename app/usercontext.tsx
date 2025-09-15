import React, { useState, useContext, createContext, ReactNode} from "react";

interface UserContextType { //context interface
    userId: string | null;  
    setUserId: (id: string | null) => void;

    last_login: string | null;
    setLastLogin: (lastlogin: string | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined); //creating the context

export const UserProvider = ({ children }: {children: ReactNode}) => {
    const [userId, setUserId] = useState<string | null>(null)
    const [last_login, setLastLogin] = useState<string | null>(null)
  

    return (
            <UserContext.Provider value={{userId, setUserId, last_login, setLastLogin}}>
                    {children}
            </UserContext.Provider>
    );
}

export const useUser = () => {
    
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context;
}


