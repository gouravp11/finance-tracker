import { useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { exportToCSV, exportToJSON, getTimestampedFilename } from "../../utils/exportData";

export default function ExportDataModal({ isOpen, onClose }) {
    const { transactions } = useTransactions();
    const [exportFormat, setExportFormat] = useState("csv");
    const [message, setMessage] = useState("");
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        try {
            setExporting(true);
            const filename = getTimestampedFilename(exportFormat);
            if (exportFormat === "csv") {
                exportToCSV(transactions, filename);
            } else {
                exportToJSON(transactions, filename);
            }
            setMessage(`✓ Exported ${transactions.length} transactions`);
            setTimeout(() => {
                setMessage("");
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Export failed:", err);
            setMessage("✗ Export failed");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="export-title"
                className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mx-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 id="export-title" className="text-lg font-semibold dark:text-white">
                        Export Data
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export {transactions.length} transactions as:
                    </p>

                    <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="csv"
                                checked={exportFormat === "csv"}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-4 h-4 mr-2"
                            />
                            <span className="text-sm font-medium dark:text-gray-300">CSV</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="json"
                                checked={exportFormat === "json"}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-4 h-4 mr-2"
                            />
                            <span className="text-sm font-medium dark:text-gray-300">JSON</span>
                        </label>
                    </div>

                    {message && (
                        <p
                            className={`text-sm ${
                                message.includes("✓") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                            {exporting ? "Exporting..." : "Export"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
