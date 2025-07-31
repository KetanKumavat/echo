import { useState } from "react";

const EmailPreview = ({
    isOpen,
    onClose,
    subject,
    body,
    senderName,
    senderEmail,
    recipientEmails,
    onConfirmSend,
}) => {
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        setSending(true);
        await onConfirmSend();
        setSending(false);
        onClose();
    };

    if (!isOpen) return null;

    const isMultiple =
        Array.isArray(recipientEmails) && recipientEmails.length > 1;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Email Preview
                    </h3>
                    <button
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        <svg
                            className="w-5 h-5 text-neutral-500 dark:text-neutral-400"
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

                {/* Email Preview */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {/* Email Headers */}
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4 mb-6 space-y-3">
                        <div className="flex items-start">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300 w-16">
                                From:
                            </span>
                            <span className="text-neutral-900 dark:text-white">
                                {senderName} &lt;{senderEmail}&gt;
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300 w-16">
                                To:
                            </span>
                            <div className="flex-1">
                                {Array.isArray(recipientEmails) ? (
                                    recipientEmails.map((email, index) => (
                                        <span
                                            key={index}
                                            className="text-neutral-900 dark:text-white"
                                        >
                                            {email}
                                            {index < recipientEmails.length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-neutral-900 dark:text-white">
                                        {recipientEmails}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300 w-16">
                                Subject:
                            </span>
                            <span className="text-neutral-900 dark:text-white font-medium">
                                {subject}
                            </span>
                        </div>
                    </div>

                    {/* Email Content */}
                    <div className="border border-neutral-200 dark:border-neutral-600 rounded-xl p-6 bg-white dark:bg-neutral-800">
                        <div
                            className="prose prose-sm max-w-none dark:prose-invert prose-neutral dark:prose-neutral text-black dark:text-white"
                            dangerouslySetInnerHTML={{ __html: body }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700">
                    <button
                        className="px-6 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                        onClick={onClose}
                        disabled={sending}
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center"
                        onClick={handleSend}
                        disabled={sending}
                    >
                        {sending ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Sending...
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
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                Send{" "}
                                {isMultiple
                                    ? `to ${recipientEmails.length} recipients`
                                    : "Email"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailPreview;
