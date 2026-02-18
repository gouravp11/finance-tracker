import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import AddTransactionModal from "./modals/AddTransactionModal";

function formatDisplayDate(tx) {
    // prefer explicit date (YYYY-MM-DD) from the transaction, fallback to Firestore timestamp
    if (tx.date) return tx.date;
    const created =
        tx.createdAt && typeof tx.createdAt.toDate === "function"
            ? tx.createdAt.toDate()
            : tx.createdAt;
    if (created instanceof Date) return created.toISOString().slice(0, 10);
    return "-";
}

export default function TransactionCard({ transaction }) {
    const { removeTransaction } = useTransactions();
    const [showModal, setShowModal] = useState(false);

    const handleEdit = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this transaction?")) return;
        try {
            await removeTransaction(transaction.id);
        } catch (err) {
            console.error(err);
            alert("Failed to delete transaction: " + (err.message || err));
        }
    };

    const isIncome = transaction.type === "income";
    const sign = isIncome ? "+" : "-";
    const amount = (transaction.amount ?? 0).toFixed(2);

    return (
        <>
            <div className="flex items-center justify-between bg-white border rounded p-4 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {transaction.description}
                            </div>
                            <div className="text-xs text-gray-500">
                                {transaction.category || "—"} • {formatDisplayDate(transaction)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                    >
                        {sign}${Math.abs(amount)}
                    </div>
                    <button
                        onClick={handleEdit}
                        className="text-sm text-gray-500 hover:text-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-sm text-gray-500 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <AddTransactionModal
                isOpen={showModal}
                onClose={handleCloseModal}
                transaction={transaction}
            />
        </>
    );
}
