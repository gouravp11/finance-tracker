import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddTransactionModal from "./modals/AddTransactionModal";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow z-40">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold font-heading text-blue-600 dark:text-blue-400">
                        Finovo
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    Add transaction
                                </button>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/analytics"
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                                    }
                                >
                                    Analytics
                                </NavLink>
                                <ProfileMenu />
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm font-medium"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile right side */}
                    <div className="flex md:hidden items-center gap-3">
                        {user && <ProfileMenu />}
                        <button
                            onClick={() => setMobileOpen((v) => !v)}
                            className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 space-y-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => { setShowModal(true); setMobileOpen(false); }}
                                    className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm text-left"
                                >
                                    Add transaction
                                </button>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-300"}`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/analytics"
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-300"}`
                                    }
                                >
                                    Analytics
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-2 text-sm text-blue-600 dark:text-blue-400 font-medium"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
