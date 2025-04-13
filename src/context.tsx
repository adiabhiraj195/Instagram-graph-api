import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type InstagramContextType = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    userInstaId: string | null;
    setUserInstaId: (id: string) => void;
};

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export const InstagramProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userInstaId, setUserInstaId] = useState<string | null>(null);

    return (
        <InstagramContext.Provider
            value={{ accessToken, setAccessToken, userInstaId, setUserInstaId }}
        >
            {children}
        </InstagramContext.Provider>
    );
};

export const useInstagram = (): InstagramContextType => {
    const context = useContext(InstagramContext);
    if (!context) {
        throw new Error("useInstagram must be used within an InstagramProvider");
    }
    return context;
};