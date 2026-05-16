/**
 * Firebase Configuration - Sabor Tolima Marketplace
 * Proyecto: gastronomiatolima-be554
 */
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Evitar re-inicialización en HMR
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db   = getFirestore(app);
export const storage = getStorage(app);
export default app;

/**
 * Configura persistencia LOCAL para que la sesión sobreviva
 * al cerrar y reabrir el navegador / refrescar la página.
 * Se llama una sola vez al arrancar la app.
 */
export async function configurePersistence(): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (err) {
    console.warn('[Firebase] No se pudo configurar persistencia:', err);
  }
}

/**
 * Retorna true si las credenciales reales están cargadas.
 */
export const isFirebaseConfigured = (): boolean => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(key && key !== 'your_api_key_here' && key.length > 10);
};
