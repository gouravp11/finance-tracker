import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    // Unauthenticated users should see the landing page (Home) instead of being forced to /login
    if (!user) return <Navigate to="/" replace />;
    return children;
}
