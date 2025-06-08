
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

let app: FirebaseApp | undefined;

// Firebase'in yalnızca bir kez başlatıldığından emin olun ve temel yapılandırmanın mevcut olup olmadığını kontrol edin
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase Yapılandırma Hatası: NEXT_PUBLIC_FIREBASE_API_KEY veya NEXT_PUBLIC_FIREBASE_PROJECT_ID ayarlanmamış. Lütfen projenizin KÖK DİZİNİNDE .env.local dosyanızın olduğundan, doğru değerleri içerdiğinden ve değişikliklerden sonra geliştirme sunucunuzu YENİDEN BAŞLATTIĞINIZDAN emin olun."
  );
  // Firebase SDK, apiKey veya projectId initializeApp sırasında eksik/geçersiz ise kendi hatasını verecektir.
  // Burada app'i başlatmayarak bu durumu yönetiyoruz.
} else {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
}

let analytics: Analytics | undefined;
// Analytics'i yalnızca istemci tarafında, app başarıyla başlatıldıysa ve measurementId mevcutsa başlatın
if (app && typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
     console.error("Firebase Hatası: Firebase Analytics başlatılamadı:", error);
     // Analytics genellikle isteğe bağlıdır, bu yüzden uygulamanın geri kalanının çalışmasını engellememelidir.
  }
}

// Başlatılmış app ve analytics'i dışa aktar
export { app, analytics };

