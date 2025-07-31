import { useState, useCallback } from "react";
import { COMPOSITION_MODES } from "../utils/constants";

export const useEmailForm = (user) => {
    const [formData, setFormData] = useState({
        sender: user?.displayName || "",
        senderEmail: user?.email || "",
        receiverEmail: "",
        recipientEmails: [],
        subject: "",
        emailContent: "",
        tone: "formal",
        isAIGenerated: false,
    });

    const [compositionMode, setCompositionMode] = useState(
        COMPOSITION_MODES.SINGLE
    );
    const [loading, setLoading] = useState(false);

    const updateFormData = useCallback((field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const clearForm = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            receiverEmail: "",
            recipientEmails: [],
            subject: "",
            emailContent: "",
            isAIGenerated: false,
        }));
    }, []);

    const setEmailContent = useCallback((content, isAI = false) => {
        setFormData((prev) => ({
            ...prev,
            emailContent: content,
            isAIGenerated: isAI,
        }));
    }, []);

    return {
        formData,
        compositionMode,
        loading,
        setCompositionMode,
        setLoading,
        updateFormData,
        clearForm,
        setEmailContent,
    };
};
