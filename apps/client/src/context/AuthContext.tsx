import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await api.post("/auth/refresh");
                setAccessToken(res.data.accessToken);
            } catch {
                setAccessToken(null);
            }
        };

        refresh();
    }, []);

    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common["Authorization"] =
                `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
};
