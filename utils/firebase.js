// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA0lqUY8adHV7wyHqQ-fKV-k2sSH_XEcoo",
  authDomain: "camvoyage-practice.firebaseapp.com",
  projectId: "camvoyage-practice",
  storageBucket: "camvoyage-practice.firebasestorage.app",
  messagingSenderId: "673082356161",
  appId: "1:673082356161:web:c1dc65ab5969541afdff40",
  measurementId: "G-L9LXFSBVPQ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export { app };
export const db = getFirestore(app);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);