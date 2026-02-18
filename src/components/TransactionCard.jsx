import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { formatDateByPreference } from "../utils/preferences";
import AddTransactionModal from "./modals/AddTransactionModal";

function formatDisplayDate(tx) {
    // prefer explicit date (YYYY-MM-DD) from the transaction, fallback to Firestore timestamp
    let dateStr;
    if (tx.date) {
        dateStr = tx.date;
    } else {
        const created =
            tx.createdAt && typeof tx.createdAt.toDate === "function"
                ? tx.createdAt.toDate()
                : tx.createdAt;
        if (created instanceof Date) {
            dateStr = created.toISOString().slice(0, 10);
        } else {
            return "-";
        }
    }
    return formatDateByPreference(dateStr);
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
            <div className="flex items-start sm:items-center justify-between bg-white dark:bg-slate-800 border rounded dark:border-slate-700 p-3 sm:p-4 shadow-sm gap-2">
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {transaction.category || "—"} • {formatDisplayDate(transaction)}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${isIncome ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}
                    >
                        {sign}${Math.abs(amount)}
                    </div>
                    <button
                        onClick={handleEdit}
                        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
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
