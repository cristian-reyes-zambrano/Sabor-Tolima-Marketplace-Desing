import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerProfile, SellerProduct } from '../types';
import {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  createProduct,
  getProductsByRestaurant,
  updateProduct,
  deleteProduct,
} from '../../firebase/firestore.service';

interface SellerState {
  profile: SellerProfile | null;
  products: SellerProduct[];
  isLoading: boolean;
  isLoadingProducts: boolean;

  // Profile actions
  loadProfile: (sellerId: string) => Promise<void>;
  saveProfile: (profile: SellerProfile) => Promise<void>;
  updateProfile: (data: Partial<SellerProfile>) => Promise<void>;
  setProfile: (profile: SellerProfile | null) => void;

  // Product actions
  loadProducts: (restaurantId: string) => Promise<void>;
  addProduct: (product: Omit<SellerProduct, 'id' | 'createdAt'>) => Promise<string>;
  editProduct: (id: string, data: Partial<SellerProduct>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      profile: null,
      products: [],
      isLoading: false,
      isLoadingProducts: false,

      loadProfile: async (sellerId) => {
        set({ isLoading: true });
        try {
          const profile = await getSellerProfile(sellerId);
          set({ profile, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      saveProfile: async (profile) => {
        set({ isLoading: true });
        try {
          await createSellerProfile(profile);
          set({ profile, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      updateProfile: async (data) => {
        const { profile } = get();
        if (!profile) return;
        set({ isLoading: true });
        try {
          await updateSellerProfile(profile.sellerId, data);
          set({
            profile: { ...profile, ...data },
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      setProfile: (profile) => set({ profile }),

      loadProducts: async (restaurantId) => {
        set({ isLoadingProducts: true });
        try {
          const products = await getProductsByRestaurant(restaurantId);
          set({ products, isLoadingProducts: false });
        } catch {
          set({ isLoadingProducts: false });
        }
      },

      addProduct: async (productData) => {
        const id = await createProduct(productData);
        const newProduct: SellerProduct = {
          ...productData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        return id;
      },

      editProduct: async (id, data) => {
        await updateProduct(id, data);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      removeProduct: async (id) => {
        await deleteProduct(id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleProductAvailability: async (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        const newAvailable = !product.available;
        await updateProduct(id, { available: newAvailable });
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, available: newAvailable } : p
          ),
        }));
      },
    }),
    {
      name: 'sabor-tolima-seller',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
