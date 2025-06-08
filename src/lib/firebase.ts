
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// İhtiyaç duyulursa diğer Firebase servislerini (getAuth, getFirestore vb.) buraya ekleyebilirsiniz.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase'i başlat
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Firebase app örneğini dışa aktar (ve gerekirse diğer servisleri)
export { app };

// Örnek Auth kullanımı (istek üzerine eklenebilir):
// import { getAuth } from 'firebase/auth';
// export const auth = getAuth(app);

// Örnek Firestore kullanımı (istek üzerine eklenebilir):
// import { getFirestore } from 'firebase/firestore';
// export const db = getFirestore(app);
