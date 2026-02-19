/**
 * Format a date string based on the user's preference from localStorage
 * @param {string} dateStr - ISO date string (YYYY-MM-DD or full ISO 8601)
 * @param {string} format - Optional format override (if not provided, uses localStorage)
 * @returns {string} Formatted date
 */
export const formatDateByPreference = (dateStr, format = null) => {
    if (!dateStr) return "—";

    const dateFormat = format || localStorage.getItem("dateFormat") || "MM/DD/YYYY";

    try {
        // Parse the date - handle both YYYY-MM-DD and full ISO strings
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) return dateStr;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        switch (dateFormat) {
            case "DD/MM/YYYY":
                return `${day}/${month}/${year}`;
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "MM/DD/YYYY":
            default:
                return `${month}/${day}/${year}`;
        }
    } catch (err) {
        console.error("Date formatting error:", err);
        return dateStr;
    }
};

/**
 * Apply theme preference to document
 * @param {string} theme - Theme value: 'light', 'dark', or 'auto'
 */
export function applyTheme(theme) {
    const root = document.documentElement;

    // Always remove dark first
    root.classList.remove("dark");

    if (theme === "dark") {
        root.classList.add("dark");
    } else if (theme === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            root.classList.add("dark");
        }
    }
}
