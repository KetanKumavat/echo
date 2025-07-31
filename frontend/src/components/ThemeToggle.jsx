import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                {/* Sun icon - visible in dark mode */}
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
                    className={`absolute inset-0 w-5 h-5 text-neutral-600 dark:text-neutral-300 transition-all duration-300 ${
                        isDark
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 rotate-90 scale-75"
                    }`}
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>

                {/* Moon icon - visible in light mode */}
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
                    className={`absolute inset-0 w-5 h-5 text-neutral-600 dark:text-neutral-300 transition-all duration-300 ${
                        !isDark
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-90 scale-75"
                    }`}
                >
                    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
                </svg>
            </div>
        </button>
    );
};

export default ThemeToggle;
