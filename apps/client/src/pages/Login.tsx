import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/Applayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                const { accessToken, user } = res.data;
                setAccessToken(accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/dashboard");
            }
            //failed case is handled by interceptor, and error message is prompted by Toast
        } catch (err: unknown) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <AppLayout>
            <div className="p-4 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <PageHeader title="Login" />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        className="bg-blue-400"
                        onClick={() => navigate("/register")}
                    >
                        Sign up
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

export default Login;
