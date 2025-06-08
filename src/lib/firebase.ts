
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from "firebase/analytics";
// İhtiyaç duyulursa diğer Firebase servislerini (getAuth, getFirestore vb.) buraya ekleyebilirsiniz.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase'i başlat
let app: FirebaseApp;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') { // Tarayıcı ortamında olduğumuzdan emin olalım
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
    }
  } else {
    app = getApp();
    if (firebaseConfig.measurementId) {
        // Zaten başlatılmış bir app varsa, analytics'i de buradan alabiliriz ya da getAnalytics(app) çağırabiliriz.
        // Genellikle getAnalytics(app) yeniden çağırmak güvenlidir.
        analytics = getAnalytics(app);
    }
  }
} else {
    // Sunucu tarafında veya build sırasında burası çalışabilir, app'i yine de başlatmaya çalışalım
    // ama analytics sadece client tarafında anlamlı.
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
}


// Firebase app örneğini ve analytics'i dışa aktar
export { app, analytics };

// Örnek Auth kullanımı (istek üzerine eklenebilir):
// import { getAuth } from 'firebase/auth';
// export const auth = getAuth(app);

// Örnek Firestore kullanımı (istek üzerine eklenebilir):
// import { getFirestore } from 'firebase/firestore';
// export const db = getFirestore(app);
