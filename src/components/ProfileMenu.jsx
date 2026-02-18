import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { formatDateByPreference } from "../utils/preferences";
import { useTheme } from "../context/ThemeContext";
import ExportDataModal from "./modals/ExportDataModal";

export default function ProfileMenu() {
    const { user, logout } = useAuth();
    const { userStats } = useUser();
    const { theme, updateTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const getInitials = () => {
        if (!user) return "?";
        const name = user.displayName || user.email;
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (date) => {
        if (!date) return "—";
        const dateStr = date.toISOString().slice(0, 10);
        return formatDateByPreference(dateStr);
    };

    return (
        <div className="relative" ref={ref}>
            {/* Profile Avatar Button */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="User profile menu"
            >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials()}
                </div>
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 transition-colors duration-200">
                    {/* Profile Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0">
                                {getInitials()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.displayName || "User"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 transition-colors duration-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Transactions</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                    {userStats.transactionCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Income</p>
                                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                                    ${userStats.totalIncome.toFixed(0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Expenses</p>
                                <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                                    ${userStats.totalExpenses.toFixed(0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Joined</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                    {formatDate(userStats.accountCreatedDate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-200">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Theme</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateTheme("light")}
                                className={`flex-1 px-2 py-2 rounded text-xs font-medium transition-all duration-200 ${
                                    theme === "light"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600"
                                }`}
                            >
                                ☀️ Light
                            </button>
                            <button
                                onClick={() => updateTheme("dark")}
                                className={`flex-1 px-2 py-2 rounded text-xs font-medium transition-all duration-200 ${
                                    theme === "dark"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600"
                                }`}
                            >
                                🌙 Dark
                            </button>
                            <button
                                onClick={() => updateTheme("auto")}
                                className={`flex-1 px-2 py-2 rounded text-xs font-medium transition-all duration-200 ${
                                    theme === "auto"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600"
                                }`}
                            >
                                ⚙️ Auto
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 bg-white dark:bg-slate-800 transition-colors duration-200">
                        <button
                            onClick={() => {
                                setOpen(false);
                                setExportOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors duration-150 flex items-center gap-2"
                        >
                            <span>📥</span> 
                            <span>Export Data</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-150 flex items-center gap-2"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            <ExportDataModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
        </div>
    );
}
