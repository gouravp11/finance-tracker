# Finovo - A Personal Finance Tracker

A responsive, full-stack personal finance tracking web app built with React and Firebase. Finovo lets users securely track income and expenses, visualize spending patterns, and export their financial data — all in real time.

---

## Features

- **Authentication** — Email/password registration and login via Firebase Auth; protected routes for authenticated users only.
- **Transaction Management** — Add, edit, and delete income/expense transactions with descriptions, categories, amounts, and dates.
- **Dashboard** — Real-time summary of total balance, total income, and total expenses; searchable and filterable transaction list (by type, category, and date range).
- **Analytics** — Visual breakdowns powered by Recharts:
  - Pie charts for expense and income by category
  - Bar chart for monthly income vs. expenses
  - Summary stat cards (total income, total expenses, net balance)
- **Dark Mode** — Light, dark, and auto (system-preference) theme support persisted via `localStorage`.
- **Data Export** — Export all or filtered transactions to **CSV** or **JSON** formats directly from the browser.
- **Dummy Data Seeding** — One-click seeding of 15 sample transactions for testing purposes.
- **Date Format Preference** — Configurable date display format (`MM/DD/YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD`) stored in `localStorage`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts v3 |
| Backend / Auth | Firebase v12 (Auth, Firestore, Storage) |
| Build Tool | Vite v7 |
| Linting | ESLint v9 |
| Formatting | Prettier |

---

## Project Structure

```
src/
├── App.jsx                        # Root component with route definitions
├── main.jsx                       # Entry point, wraps app in all providers
├── index.css                      # Global styles
├── assets/                        # Static assets
├── components/
│   ├── Login.jsx                  # Login form
│   ├── Register.jsx               # Registration form
│   ├── Navbar.jsx                 # Top navigation bar
│   ├── ProfileMenu.jsx            # User profile dropdown
│   ├── ProtectedRoute.jsx         # Auth guard for private routes
│   ├── TransactionCard.jsx        # Individual transaction display/edit card
│   └── modals/
│       ├── AddTransactionModal.jsx  # Modal for adding new transactions
│       └── ExportDataModal.jsx      # Modal for CSV/JSON export
├── config/
│   └── firebase.js                # Firebase app initialization & service exports
├── context/
│   ├── AuthContext.jsx            # Auth state (register, login, logout)
│   ├── TransactionContext.jsx     # Firestore CRUD for transactions
│   ├── ThemeContext.jsx           # Theme (light/dark/auto) state
│   └── UserContext.jsx            # Derived user stats (totals, transaction count)
├── pages/
│   ├── Home.jsx                   # Public landing page
│   ├── Dashboard.jsx              # Main transaction management page
│   └── Analytics.jsx             # Charts and financial analytics
└── utils/
    ├── dummyData.js               # Dummy transaction seeder
    ├── exportData.js              # CSV and JSON export helpers
    └── preferences.js            # Theme application & date formatting utilities
```

---

## Firebase Setup

Finovo uses three Firebase services:

### 1. Firebase Authentication
- Provider: **Email/Password**
- `createUserWithEmailAndPassword` — registration with display name set via `updateProfile`
- `signInWithEmailAndPassword` — login
- `signOut` — logout
- `onAuthStateChanged` — persistent session listener

### 2. Cloud Firestore
Transactions are stored per-user in a sub-collection:

```
users/
  {uid}/
    transactions/
      {transactionId}/
        - amount      : number
        - type        : "income" | "expense"
        - category    : string
        - description : string
        - date        : string (YYYY-MM-DD)
        - createdAt   : Firestore ServerTimestamp
```

Operations used:
- `addDoc` — create a new transaction
- `updateDoc` — edit an existing transaction
- `deleteDoc` — delete a transaction
- `onSnapshot` with `orderBy("date", "desc")` — real-time listener for the transaction list

### 3. Firebase Storage
Initialized and exported via `src/config/firebase.js` for future use (e.g., profile picture uploads).

### Firebase Configuration

All Firebase credentials are read from environment variables. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Never commit your `.env` file.** It is already included in `.gitignore`.

#### Firestore Security Rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A Firebase project with **Authentication** (Email/Password) and **Firestore** enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Firebase credentials in .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run format` | Format all files with Prettier |

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

All variables must be prefixed with `VITE_` to be exposed to the Vite client bundle.