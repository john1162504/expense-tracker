import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { accessToken } = useAuth();

    if (!accessToken) {
        alert("Please login to access this page");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
