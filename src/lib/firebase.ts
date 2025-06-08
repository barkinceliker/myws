
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

let app: FirebaseApp;

// Firebase'in yalnızca bir kez başlatıldığından emin olun
if (!getApps().length) {
  if (!firebaseConfig.apiKey) {
    // Bu konsol hatası, geliştirme sırasında sorunu teşhis etmeye yardımcı olur.
    console.error(
      "Firebase Yapılandırma Hatası: NEXT_PUBLIC_FIREBASE_API_KEY ayarlanmamış. Lütfen .env.local dosyanızı ve bu değişkenin doğru şekilde yüklendiğini kontrol edin."
    );
    // Firebase SDK, apiKey initializeApp sırasında eksik/geçersiz ise kendi hatasını verecektir.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let analytics: Analytics | undefined;
// Analytics'i yalnızca istemci tarafında ve measurementId mevcutsa başlatın
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    // getAnalytics'i çağırmadan önce 'app' örneğinin geçerli olduğundan emin olun
    if (app) {
        analytics = getAnalytics(app);
    } else {
        console.error("Firebase Hatası: Firebase app örneği Analytics başlatma için mevcut değil.");
    }
  } catch (error) {
     console.error("Firebase Hatası: Firebase Analytics başlatılamadı:", error);
     // Analytics genellikle isteğe bağlıdır, bu yüzden uygulamanın geri kalanının çalışmasını engellememelidir.
  }
}

// Başlatılmış app ve analytics'i dışa aktar
export { app, analytics };
