import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { apiRequest } from "../utils/api";

const EmailHistory = ({ user }) => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        search: "",
        sortBy: "sentAt",
        sortOrder: "desc",
    });
    const [selectedEmail, setSelectedEmail] = useState(null);
    const searchTimeout = useRef();

    useEffect(() => {
        if (user) {
            fetchEmails();
        }
    }, [user, filters]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(filters).toString();
            const response = await apiRequest(
                `${API_ENDPOINTS.EMAIL_HISTORY}/${user.uid}?${queryParams}`,
                { method: "GET" },
                true // Require authentication
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setEmails(data.data.emails);
                setPagination(data.data.pagination);
            } else {
                toast.error("Failed to fetch email history");
            }
        } catch (error) {
            console.error("Error fetching emails:", error);
            if (error.message.includes("Authentication")) {
                toast.error("Please login to view email history");
            } else {
                toast.error("Error fetching email history");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setFilters((prev) => ({
                ...prev,
                search: value,
                page: 1,
            }));
        }, 400); // Debounce delay (ms)
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const viewEmailDetails = async (emailId) => {
        try {
            const response = await apiRequest(
                `${API_ENDPOINTS.DELETE_EMAIL}/${emailId}`,
                { method: "GET" },
                true // Require authentication
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setSelectedEmail(data.data);
            } else {
                toast.error("Failed to fetch email details");
            }
        } catch (error) {
            console.error("Error fetching email details:", error);
            if (error.message.includes("Authentication")) {
                toast.error("Please login to view email details");
            } else {
                toast.error("Error fetching email details");
            }
        }
    };

    const deleteEmail = async (emailId) => {
        if (!window.confirm("Are you sure you want to delete this email?")) {
            return;
        }

        try {
            const response = await apiRequest(
                `${API_ENDPOINTS.DELETE_EMAIL}/${emailId}`,
                { method: "DELETE" },
                true // Require authentication
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                toast.success("Email deleted successfully");
                fetchEmails();
            } else {
                toast.error("Failed to delete email");
            }
        } catch (error) {
            console.error("Error deleting email:", error);
            if (error.message.includes("Authentication")) {
                toast.error("Please login to delete emails");
            } else {
                toast.error("Error deleting email");
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div>
                <div className="flex justify-center items-center py-12">
                    <div className="spinner"></div>
                    <span className="ml-2">Loading email history...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Email History
                </h2>
                <form
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    onSubmit={(e) => e.preventDefault()}
                    autoComplete="off"
                >
                    <div className="relative w-full sm:w-[140px]">
                        <select
                            className="appearance-none w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-transparent transition-all duration-200 pr-8"
                            value={filters.status}
                            onChange={(e) =>
                                handleFilterChange("status", e.target.value)
                            }
                        >
                            <option value="">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="draft">Draft</option>
                            <option value="failed">Failed</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400  focus:border-transparent transition-all duration-200 min-w-[200px]"
                        placeholder="Search emails..."
                        value={filters.search}
                        onChange={handleSearch}
                        autoComplete="off"
                        // className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </form>
            </div>

            {emails.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
                        No emails found
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Start by creating your first email!
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {emails.map((email) => (
                                <li
                                    key={email._id}
                                    className="px-4 sm:px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
                                >
                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between space-x-4">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                                                    {email.subject}
                                                </p>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {email.generatedByAI && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                                            AI
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                                            email.status ===
                                                            "sent"
                                                                ? "bg-green-100 text-green-800"
                                                                : email.status ===
                                                                  "draft"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {email.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            email.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-xs">
                                                    To: {email.recipientEmail}
                                                </p>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                                                    {formatDate(email.sentAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                                            <button
                                                onClick={() =>
                                                    viewEmailDetails(email._id)
                                                }
                                                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteEmail(email._id)
                                                }
                                                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                                                title="Delete Email"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mt-4 shadow-sm">
                        <div className="flex justify-between flex-1 sm:hidden">
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage - 1)
                                }
                                disabled={!pagination.hasPrevPage}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <IconChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    handlePageChange(pagination.currentPage + 1)
                                }
                                disabled={!pagination.hasNextPage}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <IconChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                    Showing{" "}
                                    <span className="font-medium text-neutral-900 dark:text-white">
                                        {(pagination.currentPage - 1) *
                                            filters.limit +
                                            1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium text-neutral-900 dark:text-white">
                                        {Math.min(
                                            pagination.currentPage *
                                                filters.limit,
                                            pagination.totalEmails
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium text-neutral-900 dark:text-white">
                                        {pagination.totalEmails}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage - 1
                                            )
                                        }
                                        disabled={!pagination.hasPrevPage}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l-md hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <IconChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage + 1
                                            )
                                        }
                                        disabled={!pagination.hasNextPage}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-r-md hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <IconChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Email Details Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-colors">
                    <div className="relative top-20 mx-auto p-5 border border-neutral-200/50 dark:border-neutral-600/50 w-11/12 md:w-3/4 lg:w-1/2 shadow-xl dark:shadow-neutral-900/50 rounded-xl bg-white dark:bg-neutral-800 transition-all">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-neutral-900 dark:text-white transition-colors">
                                    Email Details
                                </h3>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="p-2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4 space-y-4 border border-neutral-200/50 dark:border-neutral-600/50 transition-colors">
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1 transition-colors">
                                            Subject
                                        </label>
                                        <p className="text-neutral-900 dark:text-white transition-colors">
                                            {selectedEmail.subject}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1 transition-colors">
                                                From
                                            </label>
                                            <p className="text-neutral-900 dark:text-white transition-colors">
                                                {selectedEmail.senderEmail}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1 transition-colors">
                                                To
                                            </label>
                                            <p className="text-neutral-900 dark:text-white transition-colors">
                                                {selectedEmail.recipientEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1 transition-colors">
                                            Sent At
                                        </label>
                                        <p className="text-neutral-900 dark:text-white transition-colors">
                                            {formatDate(selectedEmail.sentAt)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1 transition-colors">
                                        Email Body
                                    </label>
                                    <div className="border border-neutral-200 dark:border-neutral-600/50 rounded-xl p-6 bg-white dark:bg-neutral-800/50 transition-colors">
                                        <div
                                            className="prose prose-sm max-w-none dark:prose-invert prose-neutral dark:prose-neutral text-neutral-900 dark:text-neutral-100 max-h-96 overflow-y-auto transition-colors"
                                            dangerouslySetInnerHTML={{
                                                __html: selectedEmail.body,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="px-6 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/70 dark:hover:bg-neutral-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailHistory;
