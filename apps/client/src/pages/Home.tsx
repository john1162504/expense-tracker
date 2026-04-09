import api from "../api/axios";
import AppLayout from "../components/layout/Applayout";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = async () => {
        await api.post("/auth/logout").then(() => {
            window.location.href = "/login";
        });
    };

    return (
        <AppLayout>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome {user.name}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
