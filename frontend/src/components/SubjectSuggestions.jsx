import { useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { generateSubjectPrompt } from "../utils/emailHelpers";

const SubjectSuggestions = ({
    emailContent,
    tone,
    onSubjectSelect,
    currentSubject,
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateSuggestions = async () => {
        if (!emailContent.trim()) {
            toast.warn("Please write some email content first");
            return;
        }

        setLoading(true);
        try {
            const prompt = generateSubjectPrompt(emailContent, tone);

            const response = await fetch(
                API_ENDPOINTS.GENERATE_SUBJECT,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                },
                true
            );

            const data = await response.json();

            const suggestionLines = data.email
                .split("\n")
                .filter((line) => line.trim() && /^\d+\./.test(line.trim()))
                .map((line) => line.replace(/^\d+\.\s*/, "").trim());

            setSuggestions(suggestionLines);
        } catch (error) {
            console.error("Error generating subject suggestions:", error);
            toast.error("Failed to generate subject suggestions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <button
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={generateSuggestions}
                disabled={loading || !emailContent.trim()}
            >
                {loading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                    </div>
                ) : (
                    "✨ Get Subject Suggestions"
                )}
            </button>

            {suggestions.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">
                        💡 AI-Generated Subject Lines
                    </p>
                    <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                                    currentSubject === suggestion
                                        ? "border-purple-500 bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200"
                                        : "border-purple-200 dark:border-purple-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-800/30"
                                }`}
                                onClick={() => onSubjectSelect(suggestion)}
                            >
                                <div className="flex items-start">
                                    <span className="text-xs text-purple-500 dark:text-purple-400 font-medium mr-2 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm flex-1">
                                        {suggestion}
                                    </span>
                                    {currentSubject === suggestion && (
                                        <span className="text-purple-500 dark:text-purple-400 ml-2">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectSuggestions;
