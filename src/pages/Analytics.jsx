import { useTransactions } from "../context/TransactionContext";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const { transactions } = useTransactions();

    // Calculate statistics
    const totalIncome = transactions.reduce(
        (acc, t) => (t.type === "income" ? acc + (Number(t.amount) || 0) : acc),
        0
    );
    const totalExpenses = transactions.reduce(
        (acc, t) => (t.type === "expense" ? acc + (Number(t.amount) || 0) : acc),
        0
    );
    const balance = totalIncome - totalExpenses;

    // Category breakdown
    const categoryStats = {};
    transactions.forEach((t) => {
        const key = `${t.type}-${t.category}`;
        if (!categoryStats[key]) {
            categoryStats[key] = { category: t.category, type: t.type, total: 0 };
        }
        categoryStats[key].total += Number(t.amount) || 0;
    });

    const expensesByCategory = Object.values(categoryStats)
        .filter((s) => s.type === "expense")
        .sort((a, b) => b.total - a.total);

    const incomeByCategory = Object.values(categoryStats)
        .filter((s) => s.type === "income")
        .sort((a, b) => b.total - a.total);

    // Monthly breakdown
    const monthlyStats = {};
    transactions.forEach((t) => {
        const date = new Date(t.date);
        const month = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
        if (!monthlyStats[month]) {
            monthlyStats[month] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
            monthlyStats[month].income += Number(t.amount) || 0;
        } else {
            monthlyStats[month].expense += Number(t.amount) || 0;
        }
    });

    const monthlyData = Object.entries(monthlyStats).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
    }));

    // Colors for charts
    const COLORS = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#EC4899",
        "#14B8A6",
        "#F97316",
    ];

    const pieExpenseData = expensesByCategory.map((stat) => ({
        name: stat.category,
        value: stat.total,
    }));

    const pieIncomeData = incomeByCategory.map((stat) => ({
        name: stat.category,
        value: stat.total,
    }));

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-6 sm:py-8 dark:bg-slate-900 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-green-500">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total Income</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        ${totalIncome.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-red-500">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                        ${totalExpenses.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Balance</p>
                    <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
                {/* Expenses Pie Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expenses Distribution</h2>
                    {pieExpenseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieExpenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieExpenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm h-80 flex items-center justify-center">
                            No expense data available
                        </p>
                    )}
                </div>

                {/* Income Pie Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Income Distribution</h2>
                    {pieIncomeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieIncomeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieIncomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm h-80 flex items-center justify-center">
                            No income data available
                        </p>
                    )}
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6 mt-6 sm:mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Trends</h2>
                {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="income" fill="#10B981" name="Income" />
                            <Bar dataKey="expense" fill="#EF4444" name="Expenses" />
                            <Bar dataKey="balance" fill="#3B82F6" name="Balance" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm h-96 flex items-center justify-center">
                        No transaction data available
                    </p>
                )}
            </div>

            {/* Category Breakdown - Text View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
                {/* Expenses by Category */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expenses by Category</h2>
                    {expensesByCategory.length > 0 ? (
                        <div className="space-y-3">
                            {expensesByCategory.map((stat, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {stat.category}
                                        </p>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (stat.total / Math.max(...expensesByCategory.map((s) => s.total))) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-red-600 ml-4">
                                        ${stat.total.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data available</p>
                    )}
                </div>

                {/* Income by Category */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Income by Category</h2>
                    {incomeByCategory.length > 0 ? (
                        <div className="space-y-3">
                            {incomeByCategory.map((stat, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {stat.category}
                                        </p>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (stat.total / Math.max(...incomeByCategory.map((s) => s.total))) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-green-600 ml-4">
                                        ${stat.total.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No income data available</p>
                    )}
                </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6 mt-6 sm:mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Overview</h2>
                {monthlyData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b dark:border-slate-700">
                                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                        Month
                                    </th>
                                    <th className="text-right py-2 px-2 font-semibold text-green-600">
                                        Income
                                    </th>
                                    <th className="text-right py-2 px-2 font-semibold text-red-600">
                                        Expenses
                                    </th>
                                    <th className="text-right py-2 px-2 font-semibold text-blue-600">
                                        Balance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyData.map((row, idx) => (
                                    <tr key={idx} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{row.month}</td>
                                        <td className="text-right py-2 px-2 text-green-600 font-semibold">
                                            ${row.income.toFixed(2)}
                                        </td>
                                        <td className="text-right py-2 px-2 text-red-600 font-semibold">
                                            ${row.expense.toFixed(2)}
                                        </td>
                                        <td
                                            className={`text-right py-2 px-2 font-semibold ${
                                                row.balance >= 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            ${row.balance.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No transaction data available</p>
                )}
            </div>
        </div>
    );
}
