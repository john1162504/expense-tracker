import type { ExpenseDTO } from "@expense-tracker/shared";

export default function RecentExpenses({
    expenses,
}: {
    expenses: ExpenseDTO[];
}) {
    const recent = expenses.slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="mb-2 font-medium">Recent Expenses</h2>

            {recent.map((e) => (
                <div key={e.id} className="flex justify-between text-sm">
                    <span>{e.description}</span>
                    <span>${e.amount}</span>
                </div>
            ))}
        </div>
    );
}
