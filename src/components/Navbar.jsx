import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddTransactionModal from "./modals/AddTransactionModal";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow z-40">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        Finovo
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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
                                        isActive ? "text-blue-600" : "text-gray-600"
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600" : "text-gray-600"
                                    }
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
