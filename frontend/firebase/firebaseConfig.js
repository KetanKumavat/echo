// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBesX0XY6yxDCD7anPZqJYydbUs99XOxQ",
  authDomain: "echo-fce3f.firebaseapp.com",
  projectId: "echo-fce3f",
  storageBucket: "echo-fce3f.appspot.com",
  messagingSenderId: "315570477481",
  appId: "1:315570477481:web:72f7d38fec81c6e9730cb8",
  measurementId: "G-BRJCR5E6ET",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;