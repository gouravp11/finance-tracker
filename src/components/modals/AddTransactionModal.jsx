import { useEffect, useState, useRef } from "react";
import { useTransactions } from "../../context/TransactionContext";

const CATEGORY_OPTIONS = {
    expense: ["Food", "Rent", "Travel", "Shopping", "Utilities", "Entertainment", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

function CategorySelect({ options, value, onSelect, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="mt-1 block w-full border dark:border-slate-600 rounded px-3 py-2 text-left flex items-center justify-between bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
                <span className={value ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-400"}>{value || placeholder}</span>
                <svg className="ml-2 h-4 w-4 text-gray-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
            </button>

            {open && (
                <ul className="absolute left-0 right-0 mt-1 z-20 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded shadow max-h-48 overflow-auto">
                    {options.map((opt) => (
                        <li key={opt} onClick={() => { onSelect(opt); setOpen(false); }} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer text-gray-900 dark:text-white">
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function AddTransactionModal({ isOpen, onClose, transaction: editingTransaction = null }) {
    const { addTransaction, updateTransaction } = useTransactions();
    const [form, setForm] = useState({
        description: "",
        amount: "",
        type: "expense",
        date: "",
        category: CATEGORY_OPTIONS.expense[0],
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        if (editingTransaction) {
            const tx = editingTransaction;
            setForm({
                description: tx.description || "",
                amount: tx.amount != null ? String(tx.amount) : "",
                type: tx.type || "expense",
                date: tx.date || (tx.createdAt && typeof tx.createdAt.toDate === "function" ? tx.createdAt.toDate().toISOString().slice(0, 10) : tx.date) || "",
                category: tx.category || (CATEGORY_OPTIONS[tx.type || "expense"]?.[0] ?? ""),
            });
            return;
        }

        setForm({ description: "", amount: "", type: "expense", date: "", category: CATEGORY_OPTIONS.expense[0] });
    }, [isOpen, editingTransaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => {
            if (name === "type") {
                // when type changes, reset category to the first matching option
                const defaultCategory = CATEGORY_OPTIONS[value]?.[0] ?? "";
                return { ...f, type: value, category: defaultCategory };
            }
            return { ...f, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amount = parseFloat(form.amount);
        if (!form.description || !form.amount || Number.isNaN(amount)) {
            alert("Please enter a description and a valid amount.");
            return;
        }

        setSubmitting(true);
        try {
            if (editingTransaction) {
                // Update existing transaction
                console.log("Updating transaction:", editingTransaction.id);
                await updateTransaction(editingTransaction.id, {
                    description: form.description,
                    amount,
                    type: form.type,
                    date: form.date || new Date().toISOString().slice(0, 10),
                    category: form.category || "",
                });
                console.log("Transaction updated successfully");
            } else {
                // Add new transaction (Firestore will generate the ID)
                const transaction = {
                    description: form.description,
                    amount,
                    type: form.type,
                    date: form.date || new Date().toISOString().slice(0, 10),
                    category: form.category || "",
                };
                console.log("Adding transaction");
                await addTransaction(transaction);
                console.log("Transaction added successfully");
            }

            onClose?.();
            setForm({ description: "", amount: "", type: "expense", date: "", category: CATEGORY_OPTIONS.expense[0] });
        } catch (err) {
            console.error("Submit error:", err);
            alert((editingTransaction ? "Failed to update transaction: " : "Failed to add transaction: ") + (err.message || err));
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-transaction-title"
                className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-lg shadow-lg p-5 sm:p-6 mx-0 sm:mx-4 max-h-[90dvh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 id="add-transaction-title" className="text-lg font-semibold dark:text-white">
                        {editingTransaction ? "Edit transaction" : "Add transaction"}
                    </h3>
                    <button onClick={onClose} aria-label="Close modal" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            value={form.amount}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="mt-1 block w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="mt-1 block w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category (optional)</label>
                        <CategorySelect
                            options={CATEGORY_OPTIONS[form.type] || []}
                            value={form.category}
                            onSelect={(val) => setForm((f) => ({ ...f, category: val }))}
                            placeholder={form.type === "expense" ? "Select expense category" : "Select income category"}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 border dark:border-slate-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-60 transition">
                            {submitting ? (editingTransaction ? "Updating..." : "Adding...") : (editingTransaction ? "Update transaction" : "Add transaction")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
