import React, { use } from "react";
import { useEffect } from "react";
import api from "../api/axios";
import type { ExpenseDTO } from "@expense-tracker/shared";
import AppLayout from "../components/layout/Applayout";
import PageHeader from "../components/ui/PageHeader";
import RecentExpenses from "../components/home/RecentExpense";
import TotalSpent from "../components/home/TotalSpent";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [expenses, setExpenses] = React.useState<ExpenseDTO[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/expense/expenses");
                setExpenses(res.data.expenses);
            } catch (err: unknown) {
                console.error("Failed to fetch expenses:", err);
            }
        })();
    }, []);
    return (
        <AppLayout>
            <PageHeader title={`Welcome back, ${user.name}!`} />
            <TotalSpent expenses={expenses} />
            <RecentExpenses expenses={expenses} />
        </AppLayout>
    );
}

export default Dashboard;
