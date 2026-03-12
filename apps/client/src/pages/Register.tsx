import { useState } from "react";
import api from "../api/axios";

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
            } else {
                alert("Registration failed: " + res.data.error);
            }
            console.log(res.data);
        } catch (err: any) {
            alert(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
