// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCWmcC8L_1VVpZqRguraquvc0wk-HxrF_U",
    authDomain: "otp-based-auth-dc46e.firebaseapp.com",
    projectId: "otp-based-auth-dc46e",
    storageBucket: "otp-based-auth-dc46e.firebasestorage.app",
    messagingSenderId: "749380068778",
    appId: "1:749380068778:web:f85afb6430752492eff7d3",
    measurementId: "G-Q47ERQHQ1T"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };