import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import { seedDummyData } from "../utils/dummyData";
import TransactionCard from "../components/TransactionCard";

const CATEGORY_OPTIONS = {
    expense: ["Food", "Rent", "Travel", "Shopping", "Utilities", "Entertainment", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

function FilterDropdown({ options, value, onSelect, placeholder }) {
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
                className="mt-1 block w-full border rounded px-3 py-2 text-left flex items-center justify-between text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
                <span className={value ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}>
                    {value || placeholder}
                </span>
                <svg
                    className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {open && (
                <ul className="absolute left-0 right-0 top-full mt-1 z-20 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded shadow max-h-64 overflow-y-auto">
                    {options.map((opt) => (
                        <li
                            key={opt}
                            onClick={() => {
                                onSelect(opt);
                                setOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer text-sm dark:text-white"
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const { transactions, loading, addTransaction } = useTransactions();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [seedingData, setSeedingData] = useState(false);

    // Get categories based on selected type
    const availableCategories =
        filterType === "all"
            ? Array.from(
                  new Set([...CATEGORY_OPTIONS.expense, ...CATEGORY_OPTIONS.income])
              )
            : CATEGORY_OPTIONS[filterType] || [];

    const categoryOptions = ["All categories", ...availableCategories];

    // Filter transactions
    const filteredTransactions = transactions.filter((tx) => {
        // Search by description
        if (
            searchTerm &&
            !tx.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }

        // Filter by type
        if (filterType !== "all" && tx.type !== filterType) {
            return false;
        }

        // Filter by category
        if (filterCategory && tx.category !== filterCategory) {
            return false;
        }

        // Filter by date range
        if (filterStartDate && tx.date < filterStartDate) {
            return false;
        }
        if (filterEndDate && tx.date > filterEndDate) {
            return false;
        }

        return true;
    });

    const balance = transactions.reduce((acc, t) => {
        const amt = Number(t.amount) || 0;
        return t.type === "income" ? acc + amt : acc - amt;
    }, 0);

    const totalIncome = transactions.reduce((acc, t) => {
        if (t.type === "income") {
            return acc + (Number(t.amount) || 0);
        }
        return acc;
    }, 0);

    const totalExpenses = transactions.reduce((acc, t) => {
        if (t.type === "expense") {
            return acc + (Number(t.amount) || 0);
        }
        return acc;
    }, 0);

    const handleSeedDummyData = async () => {
        if (!window.confirm("Add 15 dummy transactions for testing? This will add sample expense and income records.")) {
            return;
        }
        setSeedingData(true);
        try {
            const result = await seedDummyData(user.uid, addTransaction);
            if (result.success) {
                alert(`✓ Added ${result.count} sample transactions`);
            } else {
                alert(`✗ Failed to add dummy data: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error adding dummy data");
        } finally {
            setSeedingData(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-6 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                <div>
                    <h2 className="text-2xl font-semibold mb-2 dark:text-white">Dashboard</h2>
                    <p className="text-gray-700 dark:text-gray-300">Welcome back, {user.displayName || user.email}.</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Manage your finances with powerful filtering and analytics.
                    </p>
                </div>
            </div>

            {/* Seed Dummy Data Button */}
            {transactions.length === 0 && (
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-sm text-blue-800 mb-2">
                            👋 Get started quickly with sample data:
                        </p>
                        <button
                            onClick={handleSeedDummyData}
                            disabled={seedingData}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 text-sm font-medium"
                        >
                            {seedingData ? "Adding..." : "Add Sample Transactions"}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content - Grid Layout */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Filters Sidebar - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow sticky top-20 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                                />
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value);
                                        setFilterCategory("");
                                    }}
                                    className="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="all">All</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <FilterDropdown
                                    options={categoryOptions}
                                    value={filterCategory || "All categories"}
                                    onSelect={(val) =>
                                        setFilterCategory(val === "All categories" ? "" : val)
                                    }
                                    placeholder="All categories"
                                />
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    To
                                </label>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                            </div>

                            {/* Clear Filters Button */}
                            {(searchTerm ||
                                filterType !== "all" ||
                                filterCategory ||
                                filterStartDate ||
                                filterEndDate) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterType("all");
                                        setFilterCategory("");
                                        setFilterStartDate("");
                                        setFilterEndDate("");
                                    }}
                                    className="w-full mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline py-1"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-800 rounded shadow p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Transactions
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                    ({filteredTransactions.length})
                                </span>
                            </h3>

                            {loading ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400">Loading transactions…</div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {transactions.length === 0
                                        ? "No transactions yet — add one using the \"Add transaction\" button."
                                        : "No transactions match your filters."}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTransactions.map((tx) => (
                                        <TransactionCard key={tx.id} transaction={tx} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Balance Cards - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow sticky top-20 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Summary</h3>

                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Total Income</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    ${totalIncome.toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    ${totalExpenses.toFixed(2)}
                                </p>
                            </div>

                            <div className="pt-3 border-t dark:border-slate-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Balance</p>
                                <p
                                    className={`text-3xl font-bold mt-1 ${
                                        balance >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    ${balance.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
