import { TONE_PROMPTS } from "./constants";

// Generate enhanced prompt with tone and subject requirements
export const generateEnhancedPrompt = (
    userPrompt,
    tone = "formal",
    includeSubject = false
) => {
    const toneInstruction = TONE_PROMPTS[tone] || TONE_PROMPTS.formal;

    let prompt = `${toneInstruction}\n\n${userPrompt}\n\n`;

    if (includeSubject) {
        prompt += "Please provide both a subject line and the email body. ";
    }

    prompt +=
        "Format the response as clean HTML suitable for email. Use proper paragraph tags and maintain professional formatting.";

    return prompt;
};

// Generate subject line prompt
export const generateSubjectPrompt = (emailContent, tone = "formal") => {
    const toneInstruction = TONE_PROMPTS[tone] || TONE_PROMPTS.formal;

    return `${toneInstruction}

Based on this email content, generate 3 compelling subject line options:

Email content: ${emailContent}

Provide only the 3 subject lines, numbered 1-3, without any additional text or explanations.`;
};

// Parse AI response for subject and body
export const parseEmailResponse = (response) => {
    // Check if response contains both subject and body
    const subjectMatch = response.match(/Subject:\s*(.+?)(?:\n|$)/i);

    if (subjectMatch) {
        const subject = subjectMatch[1].trim();
        const body = response.replace(/Subject:\s*.+?(?:\n|$)/i, "").trim();
        return { subject, body };
    }

    return { subject: "", body: response };
};

// Validate email addresses
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Parse bulk email list
export const parseBulkEmails = (emailList) => {
    const emails = emailList
        .split(/[,\n;]/)
        .map((email) => email.trim())
        .filter((email) => email && validateEmail(email));

    return emails;
};

// Personalize email content
export const personalizeEmail = (
    template,
    recipientEmail,
    recipientName = ""
) => {
    const name = recipientName || recipientEmail.split("@")[0];

    return template
        .replace(/\{name\}/g, name)
        .replace(/\{email\}/g, recipientEmail)
        .replace(/\{firstName\}/g, name.split(" ")[0]);
};

export default {
    generateEnhancedPrompt,
    generateSubjectPrompt,
    parseEmailResponse,
    validateEmail,
    parseBulkEmails,
    personalizeEmail,
};
