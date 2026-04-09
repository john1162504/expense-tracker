import { useState } from "react";
import api from "../api/axios";
import AppLayout from "../components/layout/Applayout";
import PageHeader from "../components/ui/PageHeader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            if (res.data.success) {
                alert("Registration successful!");
            }
        } catch (err: unknown) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <AppLayout>
            <div className="p-4 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <PageHeader title="Register" />
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <Button type="submit">Register</Button>
                </form>
            </div>
        </AppLayout>
    );
}

export default Register;
