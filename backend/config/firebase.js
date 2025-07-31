import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        try {
            if (
                process.env.FIREBASE_PRIVATE_KEY &&
                process.env.FIREBASE_CLIENT_EMAIL
            ) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
                            /\\n/g,
                            "\n"
                        ),
                    }),
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
                console.log(
                    "Firebase Admin initialized with environment variables"
                );
            } else {
                admin.initializeApp({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
                console.log(
                    "Firebase Admin initialized with default credentials"
                );
            }
        } catch (error) {
            console.error("Error initializing Firebase Admin:", error);
            throw error;
        }
    }
    return admin;
};

export default initializeFirebaseAdmin;
