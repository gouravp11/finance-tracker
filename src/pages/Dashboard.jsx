import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-700">Welcome back, {user.displayName || user.email}.</p>
            <p className="mt-4 text-gray-600">
                This is a protected route — only visible when authenticated.
            </p>
        </div>
    );
}
