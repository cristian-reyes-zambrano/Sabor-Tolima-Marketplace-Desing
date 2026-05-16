/**
 * Firebase Auth Service - Sabor Tolima Marketplace
 *
 * Estrategia Google:
 *   - Intenta signInWithPopup primero (mejor UX, sin recarga de página).
 *   - Si el popup falla por COOP/cross-origin (Vercel, Safari), cae
 *     automáticamente a signInWithRedirect.
 *   - checkRedirectResult() captura el resultado del redirect al volver.
 *   - onAuthStateChanged mantiene la sesión sincronizada siempre.
 *
 * Configuración Firebase Console:
 *   Authentication → Sign-in method → Google → Habilitar
 *   Authentication → Settings → Authorized domains → agregar tu dominio
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { createUserDocument, getUserDocument } from './firestore.service';
import type { AppUser, UserRole } from '../app/types';

// ─── Google Provider ──────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ─── Errores que indican que el popup fue bloqueado por COOP/browser ──────────
const POPUP_BLOCKED_ERRORS = [
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/operation-not-supported-in-this-environment',
];

// ─── Auth State Observer ──────────────────────────────────────────────────────
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): () => void {
  if (!isFirebaseConfigured()) return () => {};

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    // Construir usuario mínimo desde Firebase Auth (siempre disponible, sin red)
    const authUser: AppUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName
        ?? firebaseUser.email?.split('@')[0]
        ?? 'Usuario',
      email: firebaseUser.email ?? '',
      avatar: firebaseUser.photoURL ?? undefined,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Emitir inmediatamente con datos de Auth para que la UI no quede en blanco
    callback(authUser);

    // Intentar enriquecer con datos de Firestore (rol, teléfono, etc.)
    try {
      const userData = await getUserDocument(firebaseUser.uid);

      if (userData) {
        callback(userData);
        return;
      }

      // Sin documento en Firestore: crear uno con los datos de Auth
      await createUserDocument(authUser);
      // authUser ya fue emitido arriba, no hace falta volver a llamar callback
    } catch (err) {
      // Firestore offline o error de red — no pasa nada, ya emitimos authUser arriba
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'unavailable' || String(err).includes('offline')) {
        console.warn('[Auth] Firestore offline — usando datos de Firebase Auth');
      } else {
        console.error('[Auth] Error al cargar usuario de Firestore:', err);
      }
      // NO llamar callback(null) — el usuario de Auth sigue válido
    }
  });
}

// ─── Google: popup con fallback a redirect ────────────────────────────────────
/**
 * Intenta autenticar con popup.
 * Si el popup es bloqueado (COOP, Safari, Vercel), cae a redirect.
 *
 * Retorna AppUser si el popup tuvo éxito.
 * Retorna null si se inició un redirect (la página se recargará).
 */
export async function loginWithGooglePopupOrRedirect(): Promise<{
  user: AppUser;
  isNewUser: boolean;
} | null> {
  if (!isFirebaseConfigured()) {
    // Modo demo
    await new Promise((r) => setTimeout(r, 800));
    const demoUser: AppUser = {
      id: 'demo-google',
      name: 'Usuario Demo',
      email: 'demo@sabortolima.co',
      avatar: undefined,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    return { user: demoUser, isNewUser: false };
  }

  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    const existing = await getUserDocument(firebaseUser.uid);

    if (existing) {
      return { user: existing, isNewUser: false };
    }

    // Usuario nuevo: crear documento con rol customer
    const newUser: AppUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName
        ?? firebaseUser.email?.split('@')[0]
        ?? 'Usuario',
      email: firebaseUser.email ?? '',
      avatar: firebaseUser.photoURL ?? undefined,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await createUserDocument(newUser);
    return { user: newUser, isNewUser: true };

  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? '';
    const msg = err instanceof Error ? err.message : String(err);

    const isPopupBlocked = POPUP_BLOCKED_ERRORS.some((e) => code.includes(e) || msg.includes(e));

    if (isPopupBlocked) {
      // El popup fue bloqueado → caer a redirect silenciosamente
      console.warn('[Auth] Popup bloqueado, usando redirect como fallback...');
      await signInWithRedirect(auth, googleProvider);
      return null; // La página se recargará
    }

    // Error real (dominio no autorizado, red, etc.)
    throw translateAuthError(err);
  }
}

// ─── Google: capturar resultado del redirect ──────────────────────────────────
/**
 * Captura el resultado del redirect de Google al volver a la app.
 * Llamar en App.tsx al montar.
 * Retorna null si no hay resultado pendiente (carga normal).
 */
export async function checkRedirectResult(): Promise<{
  user: AppUser;
  isNewUser: boolean;
  firebaseUser: FirebaseUser;
} | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const result: UserCredential | null = await getRedirectResult(auth);

    if (!result) {
      return null;
    }

    const firebaseUser = result.user;

    const existing = await getUserDocument(firebaseUser.uid);

    if (existing) {
      return { user: existing, isNewUser: false, firebaseUser };
    }

    // Usuario nuevo: crear documento
    const newUser: AppUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName
        ?? firebaseUser.email?.split('@')[0]
        ?? 'Usuario',
      email: firebaseUser.email ?? '',
      avatar: firebaseUser.photoURL ?? undefined,
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await createUserDocument(newUser);
    console.log('[Auth] Nuevo usuario Google guardado (redirect):', newUser.name);
    return { user: newUser, isNewUser: true, firebaseUser };

  } catch (err: unknown) {
    throw translateAuthError(err);
  }
}

// ─── Completar registro Google (cambio de rol) ────────────────────────────────
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

// ─── Helpers internos ─────────────────────────────────────────────────────────
function translateAuthError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string })?.code ?? '';

  if (code.includes('unauthorized-domain') || msg.includes('unauthorized-domain')) {
    return new Error(
      'Dominio no autorizado en Firebase. Agrega este dominio en Firebase Console → Authentication → Authorized domains.'
    );
  }
  if (code.includes('network-request-failed') || msg.includes('network-request-failed')) {
    return new Error('Sin conexión a internet. Verifica tu red.');
  }
  if (code.includes('account-exists-with-different-credential')) {
    return new Error('Ya existe una cuenta con este correo. Usa email y contraseña.');
  }
  if (code.includes('user-disabled')) {
    return new Error('Esta cuenta ha sido deshabilitada.');
  }
  return err instanceof Error ? err : new Error(msg);
}

// ─── Mock helpers (modo demo sin Firebase) ────────────────────────────────────
async function mockRegister(name: string, email: string, role: UserRole): Promise<AppUser> {
  await new Promise((r) => setTimeout(r, 900));
  return {
    id: `demo-${Date.now()}`, name, email, role,
    status: 'active', createdAt: new Date().toISOString(),
  };
}

async function mockLogin(email: string): Promise<AppUser> {
  await new Promise((r) => setTimeout(r, 700));
  const role: UserRole =
    email.includes('seller') || email.includes('vendedor') ? 'seller' : 'customer';
  return {
    id: `demo-${Date.now()}`,
    name: email.split('@')[0].replace(/[._-]/g, ' '),
    email, role, status: 'active',
    createdAt: new Date().toISOString(),
  };
}

// Mantener compatibilidad con imports existentes
export { loginWithGooglePopupOrRedirect as startGoogleRedirect };
export type { FirebaseUser };
