import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // or spinner
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
