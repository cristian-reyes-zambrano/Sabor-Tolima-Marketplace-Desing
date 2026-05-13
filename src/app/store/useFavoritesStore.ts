/**
 * Favorites Store - Zustand + Firestore sync
 * Persiste localmente y sincroniza con Firestore cuando hay usuario autenticado
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFavorites, saveFavorites } from '../../firebase/firestore.service';

interface FavoritesState {
  restaurantIds: string[];
  menuItemIds: string[];
  isSyncing: boolean;

  // Actions
  toggleRestaurant: (id: string, userId?: string) => void;
  toggleMenuItem: (id: string, userId?: string) => void;
  isRestaurantFavorite: (id: string) => boolean;
  isMenuItemFavorite: (id: string) => boolean;
  totalFavorites: () => number;

  // Sync with Firestore
  syncFromFirestore: (userId: string) => Promise<void>;
  syncToFirestore: (userId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      restaurantIds: [],
      menuItemIds: [],
      isSyncing: false,

      toggleRestaurant: (id, userId) => {
        set((state) => ({
          restaurantIds: state.restaurantIds.includes(id)
            ? state.restaurantIds.filter((r) => r !== id)
            : [...state.restaurantIds, id],
        }));
        if (userId) get().syncToFirestore(userId);
      },

      toggleMenuItem: (id, userId) => {
        set((state) => ({
          menuItemIds: state.menuItemIds.includes(id)
            ? state.menuItemIds.filter((m) => m !== id)
            : [...state.menuItemIds, id],
        }));
        if (userId) get().syncToFirestore(userId);
      },

      isRestaurantFavorite: (id) => get().restaurantIds.includes(id),
      isMenuItemFavorite: (id) => get().menuItemIds.includes(id),
      totalFavorites: () => get().restaurantIds.length + get().menuItemIds.length,

      syncFromFirestore: async (userId) => {
        set({ isSyncing: true });
        try {
          const data = await getFavorites(userId);
          set({
            restaurantIds: data.restaurantIds ?? [],
            menuItemIds: data.menuItemIds ?? [],
            isSyncing: false,
          });
        } catch {
          set({ isSyncing: false });
        }
      },

      syncToFirestore: async (userId) => {
        const { restaurantIds, menuItemIds } = get();
        try {
          await saveFavorites(userId, { restaurantIds, menuItemIds });
        } catch {
          // Silently fail — local state is still valid
        }
      },
    }),
    { name: 'sabor-tolima-favorites' }
  )
);
