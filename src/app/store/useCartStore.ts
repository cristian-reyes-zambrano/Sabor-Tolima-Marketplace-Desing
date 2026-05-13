/**
 * Cart Store - Zustand con persistencia y creación de pedidos en Firestore
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, AppOrder } from '../types';
import { createOrder } from '../../firebase/firestore.service';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  discount: () => number;
  total: () => number;

  // Actions
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;

  // Checkout
  placeOrder: (
    userId: string,
    address: string,
    paymentMethod: AppOrder['paymentMethod'],
    notes?: string,
    specialInstructions?: string
  ) => Promise<string>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      deliveryFee: () => (get().items.length > 0 ? 5000 : 0),
      discount: () => {
        const sub = get().subtotal();
        return sub > 50000 ? Math.round(sub * 0.1) : 0;
      },
      total: () => get().subtotal() + get().deliveryFee() - get().discount(),

      addItem: (menuItem, restaurantId, restaurantName) => {
        const { items, restaurantId: currentId } = get();

        // Clear cart if switching restaurants
        if (currentId && currentId !== restaurantId) {
          set({ items: [], restaurantId: null, restaurantName: null });
        }

        const existing = items.find((i) => i.menuItemId === menuItem.id);
        const finalPrice = menuItem.discount
          ? Math.round(menuItem.price * (1 - menuItem.discount / 100))
          : menuItem.price;

        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          const cartItem: CartItem = {
            id: `cart-${menuItem.id}-${Date.now()}`,
            menuItemId: menuItem.id,
            restaurantId,
            restaurantName,
            name: menuItem.name,
            price: finalPrice,
            image: menuItem.image,
            quantity: 1,
          };
          set((state) => ({
            items: [...state.items, cartItem],
            restaurantId,
            restaurantName,
          }));
        }
      },

      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? null : state.restaurantName,
          };
        }),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getItemQuantity: (menuItemId) =>
        get().items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0,

      placeOrder: async (userId, address, paymentMethod, notes, specialInstructions) => {
        const { items, restaurantId, restaurantName, subtotal, deliveryFee, discount, total } = get();

        if (!restaurantId || items.length === 0) throw new Error('Carrito vacío');

        const order: Omit<AppOrder, 'id' | 'createdAt'> = {
          userId,
          restaurantId,
          restaurantName: restaurantName ?? '',
          items,
          subtotal: subtotal(),
          deliveryFee: deliveryFee(),
          discount: discount(),
          total: total(),
          status: 'pending',
          address,
          paymentMethod,
          notes,
          specialInstructions,
          estimatedTime: '25-35 min',
        };

        const orderId = await createOrder(order);
        get().clearCart();
        return orderId;
      },
    }),
    { name: 'sabor-tolima-cart' }
  )
);
