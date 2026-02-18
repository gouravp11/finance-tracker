import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user } = useAuth();

    // If the user is already signed in, send them straight to the dashboard
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-3xl w-full bg-white p-8 rounded shadow text-center">
                <h1 className="text-4xl font-extrabold mb-4">Finance Tracker</h1>
                <p className="text-gray-600 mb-6">
                    A simple React frontend to record and visualise your income and expenses. Create
                    an account to add transactions, view summaries and manage your budget.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
}
