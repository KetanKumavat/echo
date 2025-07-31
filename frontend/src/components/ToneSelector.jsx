import { EMAIL_TONES } from "../utils/constants";

const ToneSelector = ({ selectedTone, onToneChange }) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Email Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EMAIL_TONES.map((tone) => (
                    <button
                        key={tone.value}
                        type="button"
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedTone === tone.value
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-neutral-600"
                        }`}
                        onClick={() => onToneChange(tone.value)}
                        title={tone.description}
                    >
                        <div className="text-center">
                            <div className="font-semibold text-sm">
                                {tone.label}
                            </div>
                            <div className="text-xs mt-1 opacity-75">
                                {tone.description}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ToneSelector;
