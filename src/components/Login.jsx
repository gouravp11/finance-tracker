// Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";

export default function Login() {
    const { user } = useAuth();
    // If the user is already signed in, send them straight to the dashboard
    if (user) return <Navigate to="/dashboard" replace />;

    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md mx-4 sm:mx-auto space-y-5"
            >
                <h2 className="text-2xl font-semibold text-center dark:text-white">Welcome Back</h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                    Login
                </button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 dark:text-blue-400 underline">
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}
