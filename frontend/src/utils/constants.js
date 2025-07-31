export const EMAIL_TONES = [
    {
        value: "formal",
        label: "Formal",
        description: "Professional and respectful",
    },
    { value: "casual", label: "Casual", description: "Friendly and relaxed" },
    {
        value: "persuasive",
        label: "Persuasive",
        description: "Compelling and convincing",
    },
    {
        value: "friendly",
        label: "Friendly",
        description: "Warm and approachable",
    },
];

export const TONE_PROMPTS = {
    formal: "Write in a formal, professional tone using precise language, complete sentences, and proper business etiquette. Avoid contractions and maintain a respectful, polished style suitable for corporate communication.",
    casual: "Write in a relaxed, conversational tone as if speaking to a colleague or friend. Use contractions, light humor, and approachable language while remaining clear and respectful.",
    persuasive:
        "Write in a confident and compelling tone that encourages action and engagement. Emphasize benefits, use motivating language, and include a clear call to action while maintaining credibility.",
    friendly:
        "Write in a warm, approachable tone that creates a sense of connection and trust. Use positive language, simple phrasing, and a welcoming attitude, as if writing to someone you genuinely care about.",
};

// Email composition modes
export const COMPOSITION_MODES = {
    SINGLE: "single",
    BULK: "bulk",
};

export default {
    EMAIL_TONES,
    TONE_PROMPTS,
    COMPOSITION_MODES,
};
