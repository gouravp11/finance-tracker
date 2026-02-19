import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useTransactions } from "./TransactionContext";

const UserContext = createContext();

export function UserProvider({ children }) {
    const { user } = useAuth();
    const { transactions } = useTransactions();
    const [userStats, setUserStats] = useState({
        transactionCount: 0,
        accountCreatedDate: null,
        totalIncome: 0,
        totalExpenses: 0
    });

    useEffect(() => {
        if (!user) return;

        // Calculate stats
        const transactionCount = transactions.length;
        const totalIncome = transactions.reduce(
            (acc, t) => (t.type === "income" ? acc + (Number(t.amount) || 0) : acc),
            0
        );
        const totalExpenses = transactions.reduce(
            (acc, t) => (t.type === "expense" ? acc + (Number(t.amount) || 0) : acc),
            0
        );

        // Account created date from user metadata
        const accountCreatedDate = user.metadata?.creationTime
            ? new Date(user.metadata.creationTime)
            : null;

        setUserStats({
            transactionCount,
            accountCreatedDate,
            totalIncome,
            totalExpenses
        });
    }, [user, transactions]);

    const value = {
        userStats
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
