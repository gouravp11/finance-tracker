import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            // replace history entry so the browser back button doesn't return to a protected route
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-semibold text-blue-600">
                    Finance Tracker
                </Link>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600" : "text-gray-600"
                                }
                            >
                                Dashboard
                            </NavLink>

                            <span className="text-sm text-gray-700">
                                {user.displayName || user.email}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
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
    );
}
