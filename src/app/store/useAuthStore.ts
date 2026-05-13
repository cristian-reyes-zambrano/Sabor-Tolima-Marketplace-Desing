import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, UserRole } from '../types';
import type { FirebaseUser } from '../../firebase/auth.service';
import {
  registerWithEmail,
  loginWithEmail,
  startGoogleRedirect,
  checkRedirectResult,
  completeGoogleRegistration,
  logoutUser,
  onAuthStateChange,
} from '../../firebase/auth.service';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  // Usuario de Google pendiente de elegir rol (nuevo usuario)
  pendingGoogleUser: FirebaseUser | null;

  // Acciones básicas
  login: (user: AppUser) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (v: boolean) => void;
  updateUser: (data: Partial<AppUser>) => void;
  setPendingGoogleUser: (u: FirebaseUser | null) => void;

  // Acciones Firebase
  registerUser: (name: string, email: string, password: string, role: UserRole) => Promise<AppUser>;
  loginUser: (email: string, password: string) => Promise<AppUser>;

  // Google: inicia el redirect (no retorna usuario, redirige la página)
  loginWithGoogle: () => Promise<void>;

  // Google: captura el resultado al volver del redirect
  // Retorna { isNewUser } o null si no hay resultado pendiente
  handleGoogleRedirectResult: () => Promise<{ isNewUser: boolean } | null>;

  // Completa el registro de un usuario nuevo de Google con el rol elegido
  completeGoogleSignup: (role: UserRole) => Promise<AppUser>;

  // Inicia el listener de onAuthStateChanged
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      pendingGoogleUser: null,

      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      logout: async () => {
        await logoutUser();
        set({ user: null, isAuthenticated: false, pendingGoogleUser: null });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setPendingGoogleUser: (pendingGoogleUser) => set({ pendingGoogleUser }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      registerUser: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const user = await registerWithEmail(name, email, password, role);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      loginUser: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await loginWithEmail(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // Inicia el redirect a Google — la página se redirige, no retorna usuario
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await startGoogleRedirect();
          // La ejecución no llega aquí porque la página se redirige
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // Captura el resultado del redirect al volver de Google
      handleGoogleRedirectResult: async () => {
        try {
          const result = await checkRedirectResult();
          if (!result) return null; // No venía de un redirect de Google

          if (!result.isNewUser && result.user) {
            // Usuario existente → login directo
            set({ user: result.user, isAuthenticated: true });
            console.log('[Store] Usuario Google existente autenticado:', result.user.name);
            return { isNewUser: false };
          }

          // Usuario nuevo → guardar para completar registro con rol
          set({ pendingGoogleUser: result.firebaseUser });
          console.log('[Store] Usuario Google nuevo, pendiente de rol');
          return { isNewUser: true };
        } catch (err) {
          console.error('[Store] Error en handleGoogleRedirectResult:', err);
          throw err;
        }
      },

      completeGoogleSignup: async (role) => {
        const { pendingGoogleUser } = get();
        if (!pendingGoogleUser) throw new Error('No hay usuario de Google pendiente');

        set({ isLoading: true });
        try {
          const user = await completeGoogleRegistration(pendingGoogleUser, role);
          set({ user, isAuthenticated: true, isLoading: false, pendingGoogleUser: null });
          return user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      initAuthListener: () => {
        return onAuthStateChange((firebaseAppUser) => {
          if (firebaseAppUser) {
            set({
              user: firebaseAppUser,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            if (get().isInitialized) {
              set({ user: null, isAuthenticated: false });
            }
            set({ isInitialized: true });
          }
        });
      },
    }),
    {
      name: 'sabor-tolima-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
