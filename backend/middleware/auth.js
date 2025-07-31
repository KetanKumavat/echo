import admin from "firebase-admin";
import initializeFirebaseAdmin from "../config/firebase.js";

initializeFirebaseAdmin();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login to continue.",
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);

            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name,
                picture: decodedToken.picture,
                emailVerified: decodedToken.email_verified,
                authTime: decodedToken.auth_time,
                issuer: decodedToken.iss,
                audience: decodedToken.aud,
                exp: decodedToken.exp,
                iat: decodedToken.iat,
            };

            console.log("Token verified for user:", req.user.email);
            next();
        } catch (tokenError) {
            console.error("Token verification failed:", tokenError.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please login again.",
                error:
                    process.env.NODE_ENV === "development"
                        ? tokenError.message
                        : undefined,
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication service error",
        });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(" ")[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name,
                picture: decodedToken.picture,
                emailVerified: decodedToken.email_verified,
            };
        } catch (tokenError) {
            console.warn("Invalid token in optional auth:", tokenError.message);
            req.user = null;
        }

        next();
    } catch (error) {
        console.error("Optional auth middleware error:", error);
        req.user = null;
        next();
    }
};

export { verifyToken as default, optionalAuth };
