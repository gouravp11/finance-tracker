/**
 * Dummy transaction data for testing and demo purposes
 */
export const DUMMY_TRANSACTIONS = [
    {
        description: "Grocery Store",
        amount: 45.5,
        type: "expense",
        category: "Food",
        date: new Date(2026, 1, 15).toISOString().slice(0, 10)
    },
    {
        description: "Monthly Salary",
        amount: 3000,
        type: "income",
        category: "Salary",
        date: new Date(2026, 1, 1).toISOString().slice(0, 10)
    },
    {
        description: "Rent Payment",
        amount: 1200,
        type: "expense",
        category: "Rent",
        date: new Date(2026, 1, 5).toISOString().slice(0, 10)
    },
    {
        description: "Gas for Car",
        amount: 55.0,
        type: "expense",
        category: "Travel",
        date: new Date(2026, 1, 12).toISOString().slice(0, 10)
    },
    {
        description: "Freelance Project",
        amount: 500,
        type: "income",
        category: "Freelance",
        date: new Date(2026, 1, 10).toISOString().slice(0, 10)
    },
    {
        description: "Netflix Subscription",
        amount: 15.99,
        type: "expense",
        category: "Entertainment",
        date: new Date(2026, 1, 8).toISOString().slice(0, 10)
    },
    {
        description: "Coffee & Lunch",
        amount: 22.5,
        type: "expense",
        category: "Food",
        date: new Date(2026, 1, 14).toISOString().slice(0, 10)
    },
    {
        description: "Online Shopping",
        amount: 89.99,
        type: "expense",
        category: "Shopping",
        date: new Date(2026, 1, 13).toISOString().slice(0, 10)
    },
    {
        description: "Electric Bill",
        amount: 120,
        type: "expense",
        category: "Utilities",
        date: new Date(2026, 1, 3).toISOString().slice(0, 10)
    },
    {
        description: "Stock Dividends",
        amount: 250,
        type: "income",
        category: "Investment",
        date: new Date(2026, 0, 25).toISOString().slice(0, 10)
    },
    {
        description: "Flight Tickets",
        amount: 350,
        type: "expense",
        category: "Travel",
        date: new Date(2026, 0, 28).toISOString().slice(0, 10)
    },
    {
        description: "Restaurant Dinner",
        amount: 65.75,
        type: "expense",
        category: "Food",
        date: new Date(2026, 0, 20).toISOString().slice(0, 10)
    },
    {
        description: "Gift - Birthday",
        amount: 150,
        type: "income",
        category: "Gift",
        date: new Date(2026, 0, 15).toISOString().slice(0, 10)
    },
    {
        description: "Movie Tickets",
        amount: 30,
        type: "expense",
        category: "Entertainment",
        date: new Date(2026, 0, 18).toISOString().slice(0, 10)
    },
    {
        description: "Gym Membership",
        amount: 50,
        type: "expense",
        category: "Entertainment",
        date: new Date(2026, 0, 1).toISOString().slice(0, 10)
    }
];

/**
 * Add dummy transactions to Firestore for a user
 * @param {string} userId - The user ID
 * @param {Function} addTransaction - The addTransaction function from context
 */
export const seedDummyData = async (userId, addTransaction) => {
    if (!userId || !addTransaction) {
        console.error("userId and addTransaction function are required");
        return;
    }

    try {
        for (const transaction of DUMMY_TRANSACTIONS) {
            await addTransaction(transaction);
        }
        return { success: true, count: DUMMY_TRANSACTIONS.length };
    } catch (err) {
        console.error("Error seeding dummy data:", err);
        return { success: false, error: err.message };
    }
};
