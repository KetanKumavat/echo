import { useState } from "react";
import { motion } from "framer-motion";
import ToneSelector from "./ToneSelector";
import BulkEmailInput from "./BulkEmailInput";
import SubjectSuggestions from "./SubjectSuggestions";
import QuillEditor from "./QuillEditor";
import { COMPOSITION_MODES } from "../utils/constants";

const EmailForm = ({
    compositionMode,
    setCompositionMode,
    formData,
    onFormDataChange,
    onGenerateEmail,
    onSendEmail,
    loading,
}) => {
    const {
        sender,
        senderEmail,
        receiverEmail,
        recipientEmails,
        subject,
        emailContent,
        tone,
    } = formData;

    const handleQuillChange = (content, source) => {
        onFormDataChange("emailContent", content);

        if (source === "user") {
            onFormDataChange("isAIGenerated", false);
        }
    };

    const isFormValid = () => {
        const hasContent = emailContent && emailContent.trim() !== "";
        const hasSubject = subject && subject.trim() !== "";

        if (compositionMode === COMPOSITION_MODES.SINGLE) {
            const hasRecipient = receiverEmail && receiverEmail.trim() !== "";
            return hasContent && hasSubject && hasRecipient;
        } else {
            const validRecipients = Array.isArray(recipientEmails)
                ? recipientEmails.filter(
                      (email) => email && email.trim() !== ""
                  )
                : [];
            return hasContent && hasSubject && validRecipients.length > 0;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8"
                >
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-8 text-center">
                        Create Your Email
                    </h2>

                    {/* Composition Mode Toggle */}
                    <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-700 p-1 mb-8">
                        <button
                            type="button"
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                compositionMode === COMPOSITION_MODES.SINGLE
                                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                            onClick={() =>
                                setCompositionMode(COMPOSITION_MODES.SINGLE)
                            }
                        >
                            Single Email
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                compositionMode === COMPOSITION_MODES.BULK
                                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                            onClick={() =>
                                setCompositionMode(COMPOSITION_MODES.BULK)
                            }
                        >
                            Bulk Email
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-neutral-300 bg-neutral-50 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent dark:bg-neutral-800 transition-all duration-200 text-black dark:text-white"
                                placeholder="Enter your name"
                                value={sender}
                                onChange={(e) =>
                                    onFormDataChange("sender", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 dark:text-white text-black"
                                value={senderEmail}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Recipient Input */}
                    {compositionMode === COMPOSITION_MODES.SINGLE ? (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Recipient's Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent dark:bg-neutral-800 dark:text-white transition-all duration-200 bg-neutral-50 text-black"
                                placeholder="Enter recipient's email"
                                value={receiverEmail}
                                onChange={(e) =>
                                    onFormDataChange(
                                        "receiverEmail",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <div className="mb-8">
                            <BulkEmailInput
                                recipientEmails={recipientEmails}
                                onRecipientsChange={(emails) =>
                                    onFormDataChange("recipientEmails", emails)
                                }
                            />
                        </div>
                    )}

                    {/* Tone Selector */}
                    <div className="mb-8">
                        <ToneSelector
                            selectedTone={tone}
                            onToneChange={(selectedTone) =>
                                onFormDataChange("tone", selectedTone)
                            }
                        />
                    </div>

                    {/* Subject */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent dark:bg-neutral-800 dark:text-white transition-all duration-200 bg-neutral-50 text-black"
                            placeholder="Enter email subject"
                            value={subject}
                            onChange={(e) =>
                                onFormDataChange("subject", e.target.value)
                            }
                        />

                        {/* Subject Suggestions */}
                        {emailContent && (
                            <div className="mt-4">
                                <SubjectSuggestions
                                    emailContent={emailContent}
                                    tone={tone}
                                    onSubjectSelect={(selectedSubject) =>
                                        onFormDataChange(
                                            "subject",
                                            selectedSubject
                                        )
                                    }
                                    currentSubject={subject}
                                />
                            </div>
                        )}
                    </div>

                    {/* Email Body */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Email Body
                        </label>
                        <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                            <QuillEditor
                                value={emailContent}
                                onChange={handleQuillChange}
                                placeholder={
                                    loading
                                        ? "Generating email..."
                                        : "Write or generate your email content"
                                }
                                readOnly={false}
                                className="bg-neutral-50 dark:bg-neutral-700"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className={`px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center ${
                                loading ? "animate-pulse" : ""
                            }`}
                            onClick={onGenerateEmail}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                    Generating...
                                </div>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Generate Email
                                </>
                            )}
                        </button>
                        <button
                            className="px-8 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            onClick={onSendEmail}
                            disabled={!isFormValid() || loading}
                        >
                            <svg
                                className="w-4 h-4 mr-2"
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
                            Preview & Send
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailForm;
