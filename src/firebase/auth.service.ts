/**
 * Firebase Auth Service - Sabor Tolima
 * Maneja autenticación con Email/Password y Google
 *
 * ─── CONFIGURACIÓN GOOGLE LOGIN ────────────────────────────────────────────
 * Para activar Google Login en Firebase Console:
 * 1. Ve a https://console.firebase.google.com
 * 2. Selecciona tu proyecto → Authentication → Sign-in method
 * 3. Habilita "Google" como proveedor
 * 4. Agrega tu dominio en "Authorized domains" (ej: localhost, tu-dominio.com)
 * 5. Guarda los cambios
 * ───────────────────────────────────────────────────────────────────────────
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { createUserDocument, getUserDocument } from './firestore.service';
import type { AppUser, UserRole } from '../app/types';

// ─── Google Provider ─────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
// Forzar selección de cuenta cada vez (mejor UX)
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Auth State Observer ─────────────────────────────────────────────────────
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): () => void {
  if (!isFirebaseConfigured()) return () => {};

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) { callback(null); return; }
    try {
      const userData = await getUserDocument(firebaseUser.uid);
      callback(userData ?? null);
    } catch {
      callback(null);
    }
  });
}

// ─── Google Login ─────────────────────────────────────────────────────────────
/**
 * Inicia sesión con Google usando popup.
 * Retorna el usuario de Firestore si ya existe,
 * o null si es la primera vez (necesita seleccionar rol).
 */
export async function loginWithGoogle(): Promise<{
  user: AppUser | null;
  isNewUser: boolean;
  firebaseUser: FirebaseUser;
}> {
  if (!isFirebaseConfigured()) {
    // Modo demo
    await new Promise((r) => setTimeout(r, 800));
    const demoUser: AppUser = {
      id: `google-demo-${Date.now()}`,
      name: 'Usuario Google Demo',
      email: 'demo@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    return { user: demoUser, isNewUser: false, firebaseUser: {} as FirebaseUser };
  }

  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  // Verificar si ya existe en Firestore
  const existing = await getUserDocument(firebaseUser.uid);

  if (existing) {
    return { user: existing, isNewUser: false, firebaseUser };
  }

  // Usuario nuevo — necesita elegir rol
  return { user: null, isNewUser: true, firebaseUser };
}

/**
 * Completa el registro de un usuario de Google con el rol elegido.
 * Crea el documento en Firestore.
 */
export async function completeGoogleRegistration(
  firebaseUser: FirebaseUser,
  role: UserRole
): Promise<AppUser> {
  const appUser: AppUser = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? 'Usuario',
    email: firebaseUser.email ?? '',
    avatar: firebaseUser.photoURL ?? undefined,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  await createUserDocument(appUser);
  return appUser;
}

// ─── Email Register ───────────────────────────────────────────────────────────
export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<AppUser> {
  if (!isFirebaseConfigured()) return mockRegister(name, email, role);

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  const appUser: AppUser = {
    id: credential.user.uid,
    name,
    email,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  await createUserDocument(appUser);
  return appUser;
}

// ─── Email Login ──────────────────────────────────────────────────────────────
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AppUser> {
  if (!isFirebaseConfigured()) return mockLogin(email);

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userData = await getUserDocument(credential.user.uid);

  if (!userData) throw new Error('Usuario no encontrado en la base de datos');
  return userData;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await signOut(auth);
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    await new Promise((r) => setTimeout(r, 800));
    return;
  }
  await sendPasswordResetEmail(auth, email);
}

// ─── Mock helpers (modo demo) ─────────────────────────────────────────────────
async function mockRegister(name: string, email: string, role: UserRole): Promise<AppUser> {
  await new Promise((r) => setTimeout(r, 900));
  return { id: `demo-${Date.now()}`, name, email, role, status: 'active', createdAt: new Date().toISOString() };
}

async function mockLogin(email: string): Promise<AppUser> {
  await new Promise((r) => setTimeout(r, 700));
  const role: UserRole = email.includes('seller') || email.includes('vendedor') ? 'seller' : 'customer';
  return {
    id: `demo-${Date.now()}`,
    name: email.split('@')[0].replace(/[._-]/g, ' '),
    email, role, status: 'active',
    createdAt: new Date().toISOString(),
  };
}

export type { FirebaseUser };
