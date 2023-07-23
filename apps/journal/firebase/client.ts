// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore/lite";
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from "firebase/storage";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";
import {
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from "firebase/functions";

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

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;
let functions: Functions;
let analytics: Analytics;

if (typeof window !== "undefined") {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  functions = getFunctions(app, "asia-northeast1");
  if (app.name) {
    analytics = getAnalytics(app);
  }
  if (process.env.NEXT_PUBLIC_FIREBASE_USING_EMULATOR === "true") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 7777);
  }
}

export { app, db, storage, auth, functions, analytics };
