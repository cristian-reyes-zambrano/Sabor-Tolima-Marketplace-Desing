import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, UserRole } from '../types';
import {
  registerWithEmail,
  loginWithEmail,
  startGoogleRedirect,
  checkRedirectResult,
  logoutUser,
  onAuthStateChange,
} from '../../firebase/auth.service';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Acciones basicas
  login: (user: AppUser) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (v: boolean) => void;
  updateUser: (data: Partial<AppUser>) => void;

  // Acciones Firebase
  registerUser: (name: string, email: string, password: string, role: UserRole) => Promise<AppUser>;
  loginUser: (email: string, password: string) => Promise<AppUser>;

  // Google: inicia el redirect (redirige la pagina, no retorna usuario)
  loginWithGoogle: () => Promise<void>;

  // Google: captura el resultado al volver del redirect
  // Retorna el AppUser si venia de Google, null si es carga normal
  handleGoogleRedirectResult: () => Promise<AppUser | null>;

  // Inicia el listener de onAuthStateChanged
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      logout: async () => {
        await logoutUser();
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

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

      // Inicia el redirect a Google — la pagina se redirige
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await startGoogleRedirect();
          // La ejecucion no llega aqui porque la pagina se redirige
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // Captura el resultado del redirect y guarda el usuario en el store
      handleGoogleRedirectResult: async () => {
        try {
          const user = await checkRedirectResult();
          if (!user) return null;

          // Guardar en el store inmediatamente
          set({ user, isAuthenticated: true });
          console.log('[Store] Usuario Google autenticado y guardado:', user.name);
          return user;
        } catch (err) {
          console.error('[Store] Error en handleGoogleRedirectResult:', err);
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
            set((state) => ({
              ...(state.isInitialized ? { user: null, isAuthenticated: false } : {}),
              isInitialized: true,
            }));
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
