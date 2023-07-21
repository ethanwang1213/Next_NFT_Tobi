// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "@firebase/app";
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore";
import { connectStorageEmulator, getStorage } from "@firebase/storage";
import { getAuth, connectAuthEmulator } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "@firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "asia-northeast1");
export const analytics =
  app.name && typeof window !== "undefined" ? getAnalytics(app) : null;
if (process.env.NEXT_PUBLIC_FIREBASE_USING_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectStorageEmulator(storage, "localhost", 7777);
}
