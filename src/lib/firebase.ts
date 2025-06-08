
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Log at the very start of the module to see if it's even being executed
console.log("[firebase.ts] Module loaded. Checking environment variables...");

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Log the raw values (or undefined) and their types
console.log(`[firebase.ts] Raw NEXT_PUBLIC_FIREBASE_API_KEY: ${apiKey} (type: ${typeof apiKey})`);
console.log(`[firebase.ts] Raw NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${projectId} (type: ${typeof projectId})`);

if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
  const errorMessage = "[firebase.ts] CRITICAL Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing, not a string, or empty. Check your deployment environment variables.";
  console.error(errorMessage);
  console.error(`[firebase.ts] Detected API Key: '${apiKey}' (length: ${apiKey?.length})`);
  throw new Error(errorMessage);
}

if (!projectId || typeof projectId !== 'string' || projectId.trim() === "") {
  const errorMessage = "[firebase.ts] CRITICAL Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing, not a string, or empty. Check your deployment environment variables.";
  console.error(errorMessage);
  console.error(`[firebase.ts] Detected Project ID: '${projectId}' (length: ${projectId?.length})`);
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;

if (!getApps().length) {
  try {
    console.log("[firebase.ts] Attempting to initialize Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log("[firebase.ts] Firebase App initialized successfully.");
  } catch (error) {
    console.error("[firebase.ts] Error during Firebase initializeApp():", error);
    console.error("[firebase.ts] Firebase config used (sensitive values redacted for project ID and API key):", {
      apiKeyProvided: !!firebaseConfig.apiKey,
      authDomainProvided: !!firebaseConfig.authDomain,
      projectIdProvided: !!firebaseConfig.projectId,
      storageBucketProvided: !!firebaseConfig.storageBucket,
      messagingSenderIdProvided: !!firebaseConfig.messagingSenderId,
      appIdProvided: !!firebaseConfig.appId,
      measurementIdProvided: !!firebaseConfig.measurementId
    });
    throw new Error(`[firebase.ts] Firebase initializeApp() failed: ${error}`);
  }
} else {
  app = getApp();
  console.log("[firebase.ts] Firebase App already exists, using existing app.");
}

let analytics: Analytics | undefined;
// Analytics'i yalnızca istemci tarafında, app başarıyla başlatıldıysa ve measurementId mevcutsa başlatın
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app); // app is guaranteed to be defined here or an error would have been thrown
  } catch (error) {
     console.error("[firebase.ts] Firebase Analytics initialization failed (client-side):", error);
  }
}

export { app, analytics };
