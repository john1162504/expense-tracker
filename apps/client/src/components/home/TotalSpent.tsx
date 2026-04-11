import type { ExpenseDTO } from "@expense-tracker/shared";

export default function TotalSpent({ expenses }: { expenses: ExpenseDTO[] }) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-xl font-semibold">${total.toFixed(2)}</p>
        </div>
    );
}
