import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LandingPage = ({ onGetStarted }) => {
    const [currentExample, setCurrentExample] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [selectedTone, setSelectedTone] = useState("Professional");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState("");
    const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);

    const tones = [
        "Professional",
        "Friendly",
        "Persuasive",
        "Casual",
        "Formal",
    ];

    const emailExamples = [
        {
            subject: "Meeting Follow-up",
            preview:
                "Thank you for taking the time to meet with me today. I wanted to follow up on our discussion about the new project timeline...",
            tone: "Professional",
        },
        {
            subject: "Welcome to the Team!",
            preview:
                "Hey there! 🎉 Welcome aboard! We're absolutely thrilled to have you join our amazing team. Here's everything you need to know...",
            tone: "Friendly",
        },
        {
            subject: "Limited Time Offer",
            preview:
                "Don't miss out! This exclusive 50% discount expires in 24 hours. Join thousands of satisfied customers who've already...",
            tone: "Persuasive",
        },
    ];

    // Cycle through examples
    useEffect(() => {
        if (!showInteractiveDemo) {
            const interval = setInterval(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setCurrentExample(
                        (prev) => (prev + 1) % emailExamples.length
                    );
                    setIsTyping(false);
                }, 500);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [showInteractiveDemo]);

    // Interactive demo functions
    const handleTryDemo = () => {
        setShowInteractiveDemo(true);
    };

    const generateEmail = async () => {
        if (!userInput.trim()) return;

        setIsGenerating(true);

        // Simulate AI generation with realistic delay
        setTimeout(() => {
            const sampleEmails = {
                Professional: `Subject: ${userInput}\n\nDear [Recipient],\n\nI hope this email finds you well. I am writing to follow up on ${userInput.toLowerCase()}. I believe this would be a valuable opportunity for us to discuss further.\n\nI would appreciate the opportunity to schedule a brief meeting at your convenience to explore this in more detail.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]`,
                Friendly: `Subject: ${userInput} 😊\n\nHey there!\n\nHope you're doing awesome! I wanted to reach out about ${userInput.toLowerCase()}. I think this could be something really cool we could work on together!\n\nLet me know if you'd like to chat more about this - always happy to brainstorm!\n\nCheers,\n[Your Name]`,
                Persuasive: `Subject: Don't Miss Out: ${userInput}\n\nHi [Recipient],\n\nI have an exciting opportunity regarding ${userInput.toLowerCase()} that I believe would be perfect for you.\n\nThis is a limited-time opportunity that could significantly benefit your business. The results speak for themselves - our clients typically see immediate improvements.\n\nI'd love to discuss how this can work for you. Are you available for a quick 15-minute call this week?\n\nLooking forward to hearing from you!\n\nBest,\n[Your Name]`,
                Casual: `Subject: ${userInput}\n\nHey!\n\nJust wanted to drop you a quick note about ${userInput.toLowerCase()}. Thought you might be interested!\n\nNo pressure at all, but if you want to chat about it, just let me know. Always happy to help out.\n\nTalk soon!\n[Your Name]`,
                Formal: `Subject: Regarding ${userInput}\n\nDear [Recipient],\n\nI am writing to formally address the matter of ${userInput.toLowerCase()}. After careful consideration, I believe this warrants your attention and review.\n\nI would be grateful for the opportunity to discuss this matter with you in detail. Please let me know when it would be convenient for you to schedule a meeting.\n\nI look forward to your response.\n\nSincerely,\n[Your Name]`,
            };

            setGeneratedEmail(
                sampleEmails[selectedTone] || sampleEmails["Professional"]
            );
            setIsGenerating(false);
        }, 2000);
    };

    const features = [
        {
            icon: "⚡",
            title: "Generate in Seconds",
            description: "From idea to perfect email in under 10 seconds",
            metric: "< 10s",
        },
        {
            icon: "🎯",
            title: "Perfect Tone Every Time",
            description: "AI adapts to your exact communication style",
            metric: "5 Tones",
        },
        {
            icon: "📈",
            title: "Higher Response Rates",
            description: "Our users see 3x better email engagement",
            metric: "+300%",
        },
        {
            icon: "📤",
            title: "Bulk Magic",
            description: "Send personalized emails to hundreds at once",
            metric: "∞ Recipients",
        },
        {
            icon: "🧠",
            title: "Smart Suggestions",
            description: "AI-powered subject lines that get opened",
            metric: "Smart AI",
        },
        {
            icon: "👀",
            title: "Preview & Perfect",
            description: "See exactly how your email looks before sending",
            metric: "100% Accurate",
        },
    ];

    const steps = [
        {
            step: "01",
            title: "Sign In",
            description: "Quick Google authentication to get started securely",
        },
        {
            step: "02",
            title: "Choose Mode",
            description: "Select single email or bulk email sending mode",
        },
        {
            step: "03",
            title: "Set Tone",
            description: "Pick the perfect tone for your message",
        },
        {
            step: "04",
            title: "Generate & Send",
            description: "Let AI create your email, preview it, and send!",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Brand Hero Section */}
            <section className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Project Name */}
                        <div className="mb-8">
                            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 mb-4 tracking-tight">
                                Echo
                            </h1>
                            <div className="flex items-center justify-center space-x-4 text-neutral-500">
                                <div className="h-px bg-neutral-300 w-16"></div>
                                <span className="text-lg font-medium tracking-wider uppercase">
                                    AI Email Assistant
                                </span>
                                <div className="h-px bg-neutral-300 w-16"></div>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-xl md:text-2xl text-neutral-600 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
                            Transform your ideas into perfect emails in seconds
                        </p>

                        {/* Quick CTA */}
                        <button
                            onClick={() =>
                                document
                                    .getElementById("interactive-demo")
                                    .scrollIntoView({ behavior: "smooth" })
                            }
                            className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <span>See Echo in Action</span>
                            <svg
                                className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section
                id="interactive-demo"
                className="relative overflow-hidden py-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                                    <span className="animate-pulse mr-2">
                                        🔥
                                    </span>
                                    Used by 100+ professionals
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
                                    Stop Writing
                                    <span className="block text-blue-600">
                                        Start Creating
                                    </span>
                                </h1>

                                <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                                    Echo transforms your ideas into perfect
                                    emails in seconds. No more writer's block,
                                    no more awkward phrases. Just brilliant
                                    emails, every time.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <button
                                        onClick={
                                            showInteractiveDemo
                                                ? onGetStarted
                                                : handleTryDemo
                                        }
                                        className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                                    >
                                        <span>
                                            {showInteractiveDemo
                                                ? "Get Full Access Now"
                                                : "Try Echo!"}
                                        </span>
                                        <svg
                                            className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Interactive Demo */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
                                    {/* Browser Header */}
                                    <div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                        <div className="ml-4 text-sm text-neutral-500">
                                            echo
                                        </div>
                                        {!showInteractiveDemo && (
                                            <button
                                                onClick={handleTryDemo}
                                                className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Try It Live!
                                            </button>
                                        )}
                                    </div>

                                    {/* Demo Content */}
                                    <div className="p-6">
                                        {!showInteractiveDemo ? (
                                            // Auto Demo
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Subject
                                                    </label>
                                                    <div
                                                        className={`p-3 bg-neutral-50 rounded-lg border ${
                                                            isTyping
                                                                ? "animate-pulse"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span className="text-neutral-900 font-medium">
                                                            {
                                                                emailExamples[
                                                                    currentExample
                                                                ].subject
                                                            }
                                                        </span>
                                                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                                                            {
                                                                emailExamples[
                                                                    currentExample
                                                                ].tone
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Email Preview
                                                    </label>
                                                    <div
                                                        className={`p-4 bg-neutral-50 rounded-lg border min-h-[120px] ${
                                                            isTyping
                                                                ? "animate-pulse"
                                                                : ""
                                                        }`}
                                                    >
                                                        <p className="text-neutral-700 leading-relaxed">
                                                            {
                                                                emailExamples[
                                                                    currentExample
                                                                ].preview
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-2">
                                                    <div className="flex items-center text-sm text-green-600">
                                                        <span className="mr-2">
                                                            ✨
                                                        </span>
                                                        Generated in 3.2s
                                                    </div>
                                                    <button
                                                        onClick={handleTryDemo}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Try It Yourself!
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Interactive Demo
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        What do you want to
                                                        write about?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={userInput}
                                                        onChange={(e) =>
                                                            setUserInput(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g., Meeting follow-up, Project proposal, Thank you note..."
                                                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Select Tone
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tones.map((tone) => (
                                                            <button
                                                                key={tone}
                                                                onClick={() =>
                                                                    setSelectedTone(
                                                                        tone
                                                                    )
                                                                }
                                                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                                    selectedTone ===
                                                                    tone
                                                                        ? "bg-blue-600 text-white"
                                                                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                                                }`}
                                                            >
                                                                {tone}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={generateEmail}
                                                    disabled={
                                                        !userInput.trim() ||
                                                        isGenerating
                                                    }
                                                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        "✨ Generate Email"
                                                    )}
                                                </button>

                                                {generatedEmail && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                            Generated Email
                                                        </label>
                                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200 max-h-48 overflow-y-auto">
                                                            <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-sans">
                                                                {generatedEmail}
                                                            </pre>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <div className="flex items-center text-sm text-green-600">
                                                                <span className="mr-2">
                                                                    🎉
                                                                </span>
                                                                Email generated
                                                                successfully!
                                                            </div>
                                                            <button
                                                                onClick={
                                                                    onGetStarted
                                                                }
                                                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                Get Started Now!
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Floating indicators */}
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                                    {showInteractiveDemo
                                        ? "Try It Now!"
                                        : "Live Demo!"}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                                Tired of Staring at a Blank Email?
                            </h2>
                            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                                Join thousands who've ditched writer's block and
                                3x'd their email response rates with AI
                            </p>
                        </motion.div>
                    </div>

                    {/* Before/After Comparison */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-red-50 p-8 rounded-2xl border-2 border-red-200"
                        >
                            <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                                <span className="mr-3">😤</span>
                                Without Echo
                            </h3>
                            <ul className="space-y-3 text-neutral-700">
                                <li className="flex items-center">
                                    <span className="text-red-500 mr-3">
                                        ❌
                                    </span>
                                    Spend 30+ minutes writing one email
                                </li>
                                <li className="flex items-center">
                                    <span className="text-red-500 mr-3">
                                        ❌
                                    </span>
                                    Sound robotic or unprofessional
                                </li>
                                <li className="flex items-center">
                                    <span className="text-red-500 mr-3">
                                        ❌
                                    </span>
                                    Low response rates
                                </li>
                                <li className="flex items-center">
                                    <span className="text-red-500 mr-3">
                                        ❌
                                    </span>
                                    Stress about tone and wording
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-green-50 p-8 rounded-2xl border-2 border-green-200"
                        >
                            <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
                                <span className="mr-3">🚀</span>
                                With Echo
                            </h3>
                            <ul className="space-y-3 text-neutral-700">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">
                                        ✅
                                    </span>
                                    Perfect emails in under 10 seconds
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">
                                        ✅
                                    </span>
                                    Professional, human-like tone
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">
                                        ✅
                                    </span>
                                    3x higher response rates
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-3">
                                        ✅
                                    </span>
                                    Confidence in every send
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-neutral-200 hover:border-blue-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-3xl">
                                        {feature.icon}
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {feature.metric}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive Tone Comparison */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center"
                    >
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                            🎯 See How Tone Changes Everything
                        </h3>
                        <p className="text-neutral-600 mb-6">
                            Same message, different impact. Click each tone to
                            see the magic!
                        </p>

                        <ToneComparison />

                        <button
                            onClick={onGetStarted}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try All 5+ Tones Now →
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            From Idea to Inbox in 3 Clicks
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            It's so simple, you'll wonder why you ever struggled
                            with email writing
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="text-center"
                            >
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white font-semibold mx-auto">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-600 text-sm">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Write Emails Like a Pro?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who've transformed
                            their email game with Echo
                        </p>

                        <button
                            onClick={onGetStarted}
                            className="group px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-neutral-100 transform hover:scale-105 transition-all duration-200 shadow-2xl mb-6"
                        >
                            <span className="flex items-center justify-center">
                                🚀 Start Creating Amazing Emails Now
                                <svg
                                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Interactive Tone Comparison Component
const ToneComparison = () => {
    const [selectedTone, setSelectedTone] = useState("Professional");

    const toneExamples = {
        Professional:
            "I hope this email finds you well. I wanted to follow up on our previous discussion regarding the project timeline. Would it be possible to schedule a brief meeting to discuss the next steps?",
        Friendly:
            "Hey! Hope you're doing great! 😊 Just wanted to circle back on what we talked about earlier. Would love to grab a quick coffee and chat about where we go from here!",
        Persuasive:
            "I have an exciting opportunity that could significantly impact your project timeline. This approach has helped similar companies achieve 40% faster results. Can we schedule 15 minutes to discuss?",
        Casual: "Hey there! Just checking in about that thing we discussed. Let me know if you want to chat more about it - no pressure!",
        Formal: "Dear [Name], I am writing to formally follow up on our recent correspondence regarding the project timeline. I would be grateful for the opportunity to schedule a meeting at your earliest convenience.",
    };

    const toneStyles = {
        Professional: "bg-blue-100 text-blue-700 border-blue-200",
        Friendly: "bg-green-100 text-green-700 border-green-200",
        Persuasive: "bg-red-100 text-red-700 border-red-200",
        Casual: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Formal: "bg-purple-100 text-purple-700 border-purple-200",
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {Object.keys(toneExamples).map((tone) => (
                    <button
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                            selectedTone === tone
                                ? toneStyles[tone]
                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        }`}
                    >
                        {tone}
                    </button>
                ))}
            </div>

            <motion.div
                key={selectedTone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg border-2 border-neutral-200 shadow-sm"
            >
                <div className="flex items-center mb-3">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${toneStyles[selectedTone]}`}
                    >
                        {selectedTone} Tone
                    </span>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                    {toneExamples[selectedTone]}
                </p>
            </motion.div>
        </div>
    );
};

export default LandingPage;
