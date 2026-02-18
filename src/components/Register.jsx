// Register.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Register() {
    const { user } = useAuth();
    // If the user is already signed in, send them straight to the dashboard
    if (user) return <Navigate to="/dashboard" replace />;

    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
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
            await register(form.name, form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
            >
                <h2 className="text-2xl font-semibold text-center">Create Account</h2>

                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    className="cursor-pointer w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Register
                </button>
                <div className="text-center text-sm text-gray-600 mt-2">
                    Already registered?{" "}
                    <Link to="/login" className="text-blue-600 underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
