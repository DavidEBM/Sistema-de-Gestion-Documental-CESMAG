import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
export const firebaseApp = firebaseEnabled
  ? getApps().length ? getApp() : initializeApp(firebaseConfig)
  : null;
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const googleProvider = firebaseEnabled ? new GoogleAuthProvider() : null;
