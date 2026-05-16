import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, UserRole } from '../types';
import type { FirebaseUser } from '../../firebase/auth.service';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGooglePopupOrRedirect,
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

  /**
   * Google: intenta popup, cae a redirect si el popup es bloqueado.
   * - Si popup OK → retorna { user, isNewUser } y actualiza el estado.
   * - Si redirect iniciado → retorna null (la página se recargará).
   */
  loginWithGoogle: () => Promise<{ user: AppUser; isNewUser: boolean } | null>;

  /**
   * Captura el resultado del redirect al volver de Google.
   * Retorna { isNewUser } o null si no venía de un redirect.
   */
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

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const result = await loginWithGooglePopupOrRedirect();

          if (!result) {
            // Redirect iniciado — la página se recargará, no limpiar isLoading
            // para que el spinner se mantenga visible durante la redirección
            return null;
          }

          // Popup exitoso
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            ...(result.isNewUser ? { pendingGoogleUser: null } : {}),
          });
          return result;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      handleGoogleRedirectResult: async () => {
        try {
          const result = await checkRedirectResult();
          if (!result) return null;

          set({
            user: result.user,
            isAuthenticated: true,
            ...(result.isNewUser ? { pendingGoogleUser: result.firebaseUser } : {}),
          });
          return { isNewUser: result.isNewUser };
        } catch (err) {
          console.error('[Store] Error en handleGoogleRedirectResult:', err);
          throw err;
        }
      },

      completeGoogleSignup: async (role) => {
        const { pendingGoogleUser, user } = get();

        set({ isLoading: true });
        try {
          let updatedUser: AppUser;

          if (pendingGoogleUser) {
            updatedUser = await completeGoogleRegistration(pendingGoogleUser, role);
          } else if (user) {
            const { updateUserDocument } = await import('../../firebase/firestore.service');
            await updateUserDocument(user.id, { role });
            updatedUser = { ...user, role };
          } else {
            throw new Error('No hay usuario de Google pendiente');
          }

          set({
            user: updatedUser,
            isAuthenticated: true,
            isLoading: false,
            pendingGoogleUser: null,
          });
          return updatedUser;
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
