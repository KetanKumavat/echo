import { auth } from "../firebase/firebaseConfig";

// Get the current user's auth token
export const getUserToken = async () => {
    try {
        if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken();
            return token;
        }
        return null;
    } catch (error) {
        console.error("Error getting user token:", error);
        return null;
    }
};

// Make authenticated API calls
export const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
        const token = await getUserToken();

        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        return response;
    } catch (error) {
        console.error("Error making authenticated request:", error);
        throw error;
    }
};

// Get user data from localStorage if available
export const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("userAuth");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error getting stored user:", error);
        return null;
    }
};

// Clear stored user data
export const clearStoredUser = () => {
    try {
        localStorage.removeItem("userAuth");
    } catch (error) {
        console.error("Error clearing stored user:", error);
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return auth.currentUser !== null || getStoredUser() !== null;
};
