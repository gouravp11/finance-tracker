import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider>
        <BrowserRouter>
            <AuthProvider>
                <TransactionProvider>
                    <UserProvider>
                        <App />
                    </UserProvider>
                </TransactionProvider>
            </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
);
