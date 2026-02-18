import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import TransactionCard from "../components/TransactionCard";

export default function Dashboard() {
    const { user } = useAuth();
    const { transactions, loading } = useTransactions();

    const balance = transactions.reduce((acc, t) => {
        const amt = Number(t.amount) || 0;
        return t.type === "income" ? acc + amt : acc - amt;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
                    <p className="text-gray-700">Welcome back, {user.displayName || user.email}.</p>
                    <p className="mt-2 text-sm text-gray-500">
                        This is a protected route — only visible when authenticated.
                    </p>
                </div>

                <div className="bg-white p-4 rounded shadow text-right">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div
                        className={`text-xl font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        ${balance.toFixed(2)}
                    </div>
                </div>
            </div>

            <section>
                <h3 className="text-lg font-medium mb-3">Recent transactions</h3>

                {loading ? (
                    <div className="text-sm text-gray-500">Loading transactions…</div>
                ) : transactions.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        No transactions yet — add one using the <strong>"Add transaction"</strong>{" "}
                        button.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <TransactionCard key={tx.id} transaction={tx} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
