import { useState } from "react";
import { parseBulkEmails, validateEmail } from "../utils/emailHelpers";

const BulkEmailInput = ({ recipientEmails, onRecipientsChange }) => {
    const [emailText, setEmailText] = useState(recipientEmails.join(", "));
    const [validationErrors, setValidationErrors] = useState([]);

    const handleEmailTextChange = (e) => {
        const text = e.target.value;
        setEmailText(text);

        const emails = parseBulkEmails(text);
        const allEmails = text
            .split(/[,\n;]/)
            .map((email) => email.trim())
            .filter((email) => email);
        const invalidEmails = allEmails.filter(
            (email) => email && !validateEmail(email)
        );

        console.log("BulkEmailInput Debug:", {
            text,
            emails,
            emailsLength: emails.length,
            allEmails,
            invalidEmails,
        });

        setValidationErrors(invalidEmails);
        onRecipientsChange(emails);
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Recipient Emails
                <span className="block text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-1">
                    Separate multiple emails with commas, semicolons, or new
                    lines
                </span>
            </label>
            <textarea
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:border-transparent dark:bg-neutral-700 dark:text-white transition-all duration-200 resize-vertical bg-neutral-50 text-black"
                value={emailText}
                onChange={handleEmailTextChange}
                placeholder="recipient1@example.com, recipient2@example.com"
                rows={4}
            />

            {validationErrors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                        Invalid email addresses:
                    </p>
                    <ul className="space-y-1">
                        {validationErrors.map((email, index) => (
                            <li
                                key={index}
                                className="text-sm text-red-600 dark:text-red-400"
                            >
                                • {email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {recipientEmails.length > 0 && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ {recipientEmails.length} valid email
                    {recipientEmails.length !== 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
};

export default BulkEmailInput;
