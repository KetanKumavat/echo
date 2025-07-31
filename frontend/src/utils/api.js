import { auth } from "../../firebase/firebaseConfig";

export const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    try {
        const token = await user.getIdToken(true);
        return token;
    } catch (error) {
        console.error("Error getting auth token:", error);
        throw error;
    }
};

export const authenticatedFetch = async (url, options = {}) => {
    try {
        const token = await getAuthToken();

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
        }

        return response;
    } catch (error) {
        console.error("Authenticated fetch error:", error);
        throw error;
    }
};

export const apiRequest = async (url, options = {}, requireAuth = false) => {
    try {
        let headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        const user = auth.currentUser;
        if (user && (requireAuth || user)) {
            try {
                const token = await user.getIdToken();
                headers.Authorization = `Bearer ${token}`;
            } catch (tokenError) {
                if (requireAuth) {
                    throw new Error("Failed to get authentication token");
                }
                console.warn("Could not get auth token, continuing without it");
            }
        } else if (requireAuth) {
            throw new Error("Authentication required but user not logged in");
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        return response;
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
};

export default { getAuthToken, authenticatedFetch, apiRequest };
