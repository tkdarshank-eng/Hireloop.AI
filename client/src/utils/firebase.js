
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interview-28a53.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interview-28a53",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interview-28a53.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "575143530745",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:575143530745:web:d1dbbdbfa439ec468ad228",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NVVG35X4S6"
};

// Without the API key Firebase throws on load and the whole page goes blank,
// so only Google sign-in is switched off until VITE_FIREBASE_APIKEY is set at build time
const auth = firebaseConfig.apiKey ? getAuth(initializeApp(firebaseConfig)) : null;

const provider = new GoogleAuthProvider()

export {auth , provider}