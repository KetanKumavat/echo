import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

import "./styles/modern.css";
import EmailHistory from "./components/EmailHistory";
import EmailPreview from "./components/EmailPreview";
import ThemeToggle from "./components/ThemeToggle";
import LandingPage from "./components/LandingPage";
import EmailForm from "./components/EmailForm";
import { useEmailForm } from "./hooks/useEmailForm";
import { API_ENDPOINTS } from "./config/api";
import { COMPOSITION_MODES } from "./utils/constants";
import { generateEnhancedPrompt } from "./utils/emailHelpers";
import { ThemeProvider } from "./contexts/ThemeContext";
import { apiRequest } from "./utils/api";
import { Link } from "react-router-dom";

const App = () => {
    // Authentication and UI state
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState("landing");
    const [authLoading, setAuthLoading] = useState(true);
    const [showLanding, setShowLanding] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    // Email form management
    const {
        formData,
        compositionMode,
        loading,
        setCompositionMode,
        setLoading,
        updateFormData,
        clearForm,
        setEmailContent,
    } = useEmailForm(user);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            updateFormData("sender", user.displayName || "");
            updateFormData("senderEmail", user.email || "");
        }
    }, [user]); // Remove updateFormData from dependencies since it's now memoized

    // Check for existing authentication state on component mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);

                // Store user data in localStorage for persistence
                localStorage.setItem(
                    "userAuth",
                    JSON.stringify({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    })
                );

                console.log("User authenticated:", user.displayName);
            } else {
                setUser(null);
                localStorage.removeItem("userAuth");
                console.log("User signed out");
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Handle login from landing page
    const handleGetStarted = () => {
        if (user) {
            setShowLanding(false);
            setCurrentView("composer");
        } else {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            setAuthLoading(true);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: "select_account",
            });

            const result = await signInWithPopup(auth, provider);
            setShowLanding(false);
            setCurrentView("composer");

            toast.success(`Welcome ${result.user.displayName}!`, {
                position: "top-right",
            });
        } catch (error) {
            console.error("Error signing in with Google:", error);
            toast.error("Failed to sign in. Please try again.", {
                position: "top-right",
            });
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!", {
                position: "top-right",
            });

            clearForm();
            setShowLanding(true);
            setCurrentView("landing");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to log out.", {
                position: "top-right",
            });
        }
    };

    const handleGenerateEmail = async () => {
        setLoading(true);
        const enhancedPrompt = generateEnhancedPrompt(
            formData.subject,
            formData.tone
        );

        try {
            const response = await apiRequest(
                API_ENDPOINTS.GENERATE_EMAIL,
                {
                    method: "POST",
                    body: JSON.stringify({ prompt: enhancedPrompt }),
                },
                true
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let cleanedData = data.email;

            // Clean up the AI response
            cleanedData = cleanedData.replace(/```html\n?/g, "");
            cleanedData = cleanedData.replace(/```\n?/g, "");
            cleanedData = cleanedData.replace(/\*/g, "");

            // Extract body content if it's HTML
            if (
                cleanedData.includes("<!DOCTYPE html>") ||
                cleanedData.includes("<html>")
            ) {
                const bodyMatch = cleanedData.match(
                    /<body[^>]*>([\s\S]*?)<\/body>/i
                );
                if (bodyMatch) {
                    cleanedData = bodyMatch[1].trim();
                } else {
                    cleanedData = cleanedData
                        .replace(/<!DOCTYPE[^>]*>/gi, "")
                        .replace(/<\/?html[^>]*>/gi, "")
                        .replace(/<head[\s\S]*?<\/head>/gi, "")
                        .replace(/<\/?body[^>]*>/gi, "")
                        .trim();
                }
            }

            setEmailContent(cleanedData, true); // Mark as AI generated
        } catch (error) {
            console.error("Error generating email:", error);
            toast.error("Failed to generate email. Please try again.", {
                position: "top-right",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle email sending
    const handleSendEmail = () => {
        const { subject, emailContent, receiverEmail, recipientEmails } =
            formData;
        const emails =
            compositionMode === COMPOSITION_MODES.BULK
                ? recipientEmails
                : [receiverEmail];

        if (!subject || !emailContent) {
            toast.error("Please fill in subject and email content.", {
                position: "top-right",
            });
            return;
        }

        if (emails.length === 0 || emails.some((email) => !email)) {
            toast.error("Please provide valid recipient email(s).", {
                position: "top-right",
            });
            return;
        }

        setShowPreview(true);
    };

    // Confirm and send email after preview
    const confirmSendEmail = async () => {
        try {
            const {
                sender,
                senderEmail,
                receiverEmail,
                recipientEmails,
                subject,
                emailContent,
                isAIGenerated,
            } = formData;
            const emails =
                compositionMode === COMPOSITION_MODES.BULK
                    ? recipientEmails
                    : [receiverEmail];

            if (compositionMode === COMPOSITION_MODES.BULK) {
                const response = await apiRequest(
                    API_ENDPOINTS.SEND_BULK_EMAIL,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            senderName: sender,
                            recipientEmails: emails,
                            subject,
                            email: emailContent,
                            userId: user?.uid,
                            generatedByAI: isAIGenerated,
                        }),
                    },
                    true
                ); // Require authentication

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    toast.success(
                        `Bulk email sent: ${result.results.totalSent} successful, ${result.results.totalFailed} failed`,
                        { position: "top-right" }
                    );
                    clearForm();
                } else {
                    throw new Error(
                        result.message || "Failed to send bulk email"
                    );
                }
            } else {
                const response = await apiRequest(
                    API_ENDPOINTS.SEND_EMAIL,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            sender,
                            senderEmail,
                            receiverEmail,
                            subject,
                            email: emailContent,
                            userId: user?.uid,
                            generatedByAI: isAIGenerated,
                        }),
                    },
                    true
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    toast.success("Email sent successfully!", {
                        position: "top-right",
                    });
                    clearForm();
                } else {
                    throw new Error(result.error || "Failed to send email");
                }
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email. Please try again.", {
                position: "top-right",
            });
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Loading Echo...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={true}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    className="mt-16"
                    toastClassName="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 shadow-lg rounded-xl"
                    bodyClassName="text-sm font-medium px-4 py-3"
                    closeButton={false}
                />

                <AnimatePresence mode="wait">
                    {showLanding && !user ? (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <LandingPage onGetStarted={handleGetStarted} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="app"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Navigation Header */}
                            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                                    <div className="flex items-center justify-between h-14 sm:h-16">
                                        <Link to="/">
                                            <div className="flex items-center">
                                                <div className="text-xl font-semibold text-neutral-900 dark:text-white">
                                                    Echo
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Navigation Items - Adaptive Layout */}
                                        <div className="flex justify-center items-center sm:space-x-4 space-x-2">
                                            {user && (
                                                <>
                                                    <button
                                                        className={`px-2 sm:px-4 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-all duration-200 ${
                                                            currentView ===
                                                            "composer"
                                                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                                                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        }`}
                                                        onClick={() =>
                                                            setCurrentView(
                                                                "composer"
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            class="lucide lucide-plus-icon lucide-plus w-5 h-5 sm:w-5 sm:h-5"
                                                        >
                                                            <path d="M5 12h14" />
                                                            <path d="M12 5v14" />
                                                        </svg>
                                                        <span className="hidden sm:inline">
                                                            Compose
                                                        </span>
                                                    </button>

                                                    <button
                                                        className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex gap-2 justify-center items-center ${
                                                            currentView ===
                                                            "history"
                                                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                                                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        }`}
                                                        onClick={() =>
                                                            setCurrentView(
                                                                "history"
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            width="24"
                                                            height="24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            className="lucide lucide-mail-minus-icon lucide-mail-minus w-5 h-5 sm:w-5 sm:h-5"
                                                        >
                                                            <path d="M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                            <path d="M16 19h6" />
                                                        </svg>

                                                        <span className="hidden sm:inline">
                                                            History
                                                        </span>
                                                    </button>
                                                </>
                                            )}

                                            <ThemeToggle />

                                            {!user ? (
                                                <button
                                                    className="px-3 sm:px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
                                                    onClick={handleLogin}
                                                >
                                                    <span className="hidden xs:inline">
                                                        Sign In
                                                    </span>
                                                    <span className="xs:hidden">
                                                        In
                                                    </span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    {user.photoURL ? (
                                                        <img
                                                            src={user.photoURL}
                                                            alt={
                                                                user.displayName
                                                            }
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                                                            onError={(e) => {
                                                                e.target.style.display =
                                                                    "none";
                                                                e.target.nextSibling.style.display =
                                                                    "flex";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                            >
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                <circle
                                                                    cx="9"
                                                                    cy="7"
                                                                    r="4"
                                                                />
                                                                <path d="m16 11 2 2 4-4" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <button
                                                        className="px-2 sm:px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
                                                        onClick={handleLogout}
                                                    >
                                                        <span className="hidden sm:inline">
                                                            Logout
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-log-out w-4 h-4 sm:w-5 sm:h-5"
                                                        >
                                                            <path d="m16 17 5-5-5-5" />
                                                            <path d="M21 12H9" />
                                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </nav>

                            {/* Main Content */}
                            <div className="pt-16">
                                {currentView === "composer" ? (
                                    <EmailForm
                                        compositionMode={compositionMode}
                                        setCompositionMode={setCompositionMode}
                                        formData={formData}
                                        onFormDataChange={updateFormData}
                                        onGenerateEmail={handleGenerateEmail}
                                        onSendEmail={handleSendEmail}
                                        loading={loading}
                                    />
                                ) : (
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <EmailHistory user={user} />
                                    </div>
                                )}
                            </div>

                            {/* Email Preview Modal */}
                            <EmailPreview
                                isOpen={showPreview}
                                onClose={() => setShowPreview(false)}
                                subject={formData.subject}
                                body={formData.emailContent}
                                senderName={formData.sender}
                                senderEmail={formData.senderEmail}
                                recipientEmails={
                                    compositionMode === COMPOSITION_MODES.BULK
                                        ? formData.recipientEmails
                                        : [formData.receiverEmail]
                                }
                                onConfirmSend={confirmSendEmail}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ThemeProvider>
    );
};

export default App;
