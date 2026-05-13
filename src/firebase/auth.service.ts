/**
 * Firebase Auth Service - Sabor Tolima Marketplace
 *
 * Usa signInWithRedirect (no popup) para compatibilidad con Vercel y Chrome.
 * El popup falla con COOP: same-origin-allow-popups que Vercel envia por defecto.
 *
 * Flujo Google:
 *   1. startGoogleRedirect()  -> redirige la pagina a Google
 *   2. Google autentica       -> redirige de vuelta a la app
 *   3. checkRedirectResult()  -> captura el resultado al volver
 *   4. onAuthStateChanged     -> detecta la sesion activa
 *
 * Configuracion Firebase Console:
 *   Authentication -> Sign-in method -> Google -> Habilitar
 *   Authentication -> Settings -> Authorized domains -> agregar tu dominio
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

// ─── Auth State Observer ──────────────────────────────────────────────────────
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): () => void {
  if (!isFirebaseConfigured()) return () => {};

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      console.log('[Auth] Sin sesion activa');
      callback(null);
      return;
    }

    console.log('[Auth] Sesion detectada:', firebaseUser.email);

    try {
      const userData = await getUserDocument(firebaseUser.uid);

      if (userData) {
        console.log('[Auth] Usuario cargado desde Firestore:', userData.name);
        callback(userData);
        return;
      }

      // No hay documento: crear uno ahora para que el perfil siempre persista.
      // Esto cubre el caso de usuarios que autenticaron antes de que existiera
      // la logica de guardado, o si Firestore fallo durante el redirect.
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
      console.log('[Auth] Documento creado automaticamente para:', newUser.name);
      callback(newUser);
    } catch (err) {
      console.error('[Auth] Error al cargar/crear usuario de Firestore:', err);
      // Si Firestore falla, devolver datos minimos de Firebase Auth
      // para que la UI no quede en blanco con sesion activa
      if (firebaseUser.email) {
        const fallback: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName ?? firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL ?? undefined,
          role: 'customer',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        callback(fallback);
      } else {
        callback(null);
      }
    }
  });
}

// ─── Google: iniciar redirect ─────────────────────────────────────────────────
/**
 * Redirige la pagina a Google para autenticar.
 * No retorna usuario — la pagina se redirige.
 * El resultado se captura con checkRedirectResult() al volver.
 */
export async function startGoogleRedirect(): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.log('[Auth Demo] Redirect simulado (Firebase no configurado)');
    return;
  }
  console.log('[Auth] Iniciando redirect a Google...');
  await signInWithRedirect(auth, googleProvider);
}

// ─── Google: capturar resultado del redirect ──────────────────────────────────
/**
 * Captura el resultado del redirect de Google al volver a la app.
 * Llamar en App.tsx al montar.
 * Retorna null si no hay resultado pendiente (carga normal).
 *
 * COMPORTAMIENTO:
 * - Usuario existente en Firestore → retorna sus datos directamente.
 * - Usuario NUEVO → crea el documento en Firestore con rol 'customer'
 *   y retorna isNewUser:true para que la UI ofrezca cambiar a vendedor.
 *   El perfil SIEMPRE se guarda, independientemente de si elige rol o no.
 */
export async function checkRedirectResult(): Promise<{
  user: AppUser;
  isNewUser: boolean;
  firebaseUser: FirebaseUser;
} | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    console.log('[Auth] Verificando resultado de redirect...');
    const result: UserCredential | null = await getRedirectResult(auth);

    if (!result) {
      console.log('[Auth] Sin resultado de redirect pendiente');
      return null;
    }

    const firebaseUser = result.user;
    console.log('[Auth] Redirect exitoso:', firebaseUser.email, firebaseUser.displayName);

    // Verificar si ya existe en Firestore
    const existing = await getUserDocument(firebaseUser.uid);

    if (existing) {
      console.log('[Auth] Usuario existente en Firestore:', existing.name);
      return { user: existing, isNewUser: false, firebaseUser };
    }

    // Usuario nuevo: crear documento AHORA con rol customer por defecto.
    // Esto garantiza que el perfil siempre se guarda sin depender del modal.
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
    console.log('[Auth] Nuevo usuario Google guardado en Firestore:', newUser.name);

    // isNewUser:true para que la UI ofrezca opción de cambiar a vendedor
    return { user: newUser, isNewUser: true, firebaseUser };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Auth] Error en getRedirectResult:', msg);

    if (msg.includes('unauthorized-domain')) {
      throw new Error(
        'Dominio no autorizado en Firebase. Agrega este dominio en Firebase Console -> Authentication -> Authorized domains.'
      );
    }
    if (msg.includes('network-request-failed')) {
      throw new Error('Sin conexion a internet. Verifica tu red.');
    }
    throw err;
  }
}

// ─── Completar registro Google ────────────────────────────────────────────────
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
  console.log('[Auth] Registro Google completado con rol:', role);
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
  console.log('[Auth] Registro con email exitoso:', email);
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
  console.log('[Auth] Login con email exitoso:', email);
  return userData;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await signOut(auth);
  console.log('[Auth] Sesion cerrada');
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    await new Promise((r) => setTimeout(r, 800));
    return;
  }
  await sendPasswordResetEmail(auth, email);
  console.log('[Auth] Email de recuperacion enviado a:', email);
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

export type { FirebaseUser };
