/**
 * Export transactions to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name of the exported file
 */
export const exportToCSV = (transactions, filename = "transactions.csv") => {
    if (transactions.length === 0) {
        alert("No transactions to export");
        return;
    }

    // CSV headers
    const headers = ["Date", "Description", "Category", "Type", "Amount"];

    // Convert transactions to CSV rows
    const rows = transactions.map((t) => [
        t.date || "",
        `"${(t.description || "").replace(/"/g, '""')}"`, // Escape quotes in description
        t.category || "",
        t.type || "",
        t.amount || ""
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export transactions to JSON format
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name of the exported file
 */
export const exportToJSON = (transactions, filename = "transactions.json") => {
    if (transactions.length === 0) {
        alert("No transactions to export");
        return;
    }

    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Generate timestamp for export filename
 * @returns {string} Formatted timestamp (YYYY-MM-DD-HHmmss)
 */
export const getTimestampedFilename = (format = "csv") => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `transactions-${year}-${month}-${day}-${hours}${minutes}${seconds}.${format}`;
};
