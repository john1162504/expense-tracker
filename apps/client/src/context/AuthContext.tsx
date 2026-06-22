import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await api.get("/auth/refresh");
                setAccessToken(res.data.accessToken);
            } catch {
                setAccessToken(null);
            } finally {
                setIsLoading(false);
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
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
};
