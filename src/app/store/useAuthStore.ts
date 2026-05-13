import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, UserRole } from '../types';
import type { FirebaseUser } from '../../firebase/auth.service';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle as firebaseLoginWithGoogle,
  completeGoogleRegistration,
  logoutUser,
  onAuthStateChange,
} from '../../firebase/auth.service';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  // Temporal: usuario de Google pendiente de elegir rol
  pendingGoogleUser: FirebaseUser | null;

  // Actions
  login: (user: AppUser) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (v: boolean) => void;
  updateUser: (data: Partial<AppUser>) => void;
  setPendingGoogleUser: (u: FirebaseUser | null) => void;

  // Firebase actions
  registerUser: (name: string, email: string, password: string, role: UserRole) => Promise<AppUser>;
  loginUser: (email: string, password: string) => Promise<AppUser>;
  loginWithGoogle: () => Promise<{ isNewUser: boolean }>;
  completeGoogleSignup: (role: UserRole) => Promise<AppUser>;
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
          const result = await firebaseLoginWithGoogle();

          if (!result.isNewUser && result.user) {
            // Usuario existente → login directo
            set({ user: result.user, isAuthenticated: true, isLoading: false });
            return { isNewUser: false };
          }

          // Usuario nuevo → guardar firebase user para completar registro
          set({
            pendingGoogleUser: result.firebaseUser,
            isLoading: false,
          });
          return { isNewUser: true };
        } catch (err) {
          set({ isLoading: false });
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
        return onAuthStateChange((user) => {
          if (user) {
            set({ user, isAuthenticated: true, isInitialized: true });
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
