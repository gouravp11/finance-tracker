import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../config/firebase";
import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const coll = collection(db, "users", user.uid, "transactions");
        const q = query(coll, orderBy("date", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
                setTransactions(items);
                setLoading(false);
            },
            (err) => {
                console.error("transactions listener error", err);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const addTransaction = async (transaction) => {
        if (!user) throw new Error("Not authenticated");
        const coll = collection(db, "users", user.uid, "transactions");
        // Exclude the 'id' field - let Firestore generate the document ID
        const { id: _, ...payload } = transaction;
        const ref = await addDoc(coll, { ...payload, createdAt: serverTimestamp() });
        return ref;
    };

    const updateTransaction = async (id, updates) => {
        if (!user) throw new Error("Not authenticated");
        try {
            const ref = doc(db, "users", user.uid, "transactions", id);
            await updateDoc(ref, updates);
        } catch (err) {
            console.error("Error updating transaction:", err);
            throw err;
        }
    };

    const removeTransaction = async (id) => {
        if (!user) throw new Error("Not authenticated");
        try {
            const ref = doc(db, "users", user.uid, "transactions", id);
            await deleteDoc(ref);
        } catch (err) {
            console.error("Error deleting transaction:", err);
            throw err;
        }
    };

    const value = {
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        removeTransaction
    };

    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export const useTransactions = () => useContext(TransactionContext);
