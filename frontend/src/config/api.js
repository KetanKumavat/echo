const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
    GENERATE_EMAIL: `${API_BASE_URL}/generate-email`,
    SEND_EMAIL: `${API_BASE_URL}/send-email`,
    SEND_BULK_EMAIL: `${API_BASE_URL}/send-bulk-email`,
    GENERATE_SUBJECT: `${API_BASE_URL}/generate-subject`,
    EMAIL_HISTORY: `${API_BASE_URL}/api/emails`,
    DELETE_EMAIL: `${API_BASE_URL}/api/email`,
};

export default API_BASE_URL;
