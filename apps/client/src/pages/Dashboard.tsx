import api from "../api/axios";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = async () => {
        await api.post("/auth/logout").then(() => {
            window.location.href = "/login";
        });
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
