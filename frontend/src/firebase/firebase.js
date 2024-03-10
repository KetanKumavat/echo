// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {auth, app};