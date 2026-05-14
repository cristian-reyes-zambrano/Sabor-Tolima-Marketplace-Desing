/**
 * Tipos centralizados - Sabor Tolima Marketplace
 * Single source of truth para todas las interfaces
 */

// ─── ROLES ─────────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'seller' | 'admin';
export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type UserStatus = 'active' | 'inactive' | 'banned';

// ─── CATEGORÍAS ────────────────────────────────────────────────────────────
export type Category =
  | 'tipica'
  | 'rapida'
  | 'saludable'
  | 'cafeteria'
  | 'gourmet'
  | 'ofertas';

export type MenuCategory =
  | 'entradas'
  | 'principales'
  | 'bebidas'
  | 'postres'
  | 'combos'
  | 'recomendados';

// ─── USUARIO ───────────────────────────────────────────────────────────────
export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  status: UserStatus;
  createdAt: string;
}

// Alias para compatibilidad con código anterior
export type User = AppUser;

// ─── SELLER PROFILE ────────────────────────────────────────────────────────
export interface SellerProfile {
  sellerId: string;           // = user.id
  restaurantName: string;
  description: string;
  category: Category;
  address: string;
  city: string;
  phone: string;
  schedule: string;
  estimatedTime: string;
  deliveryFee: number;
  minOrder: number;
  status: SellerStatus;

  // Media
  logo?: string;
  banner?: string;
  images?: string[];

  // Documents
  documents: {
    identity?: string;       // URL
    foodHandler?: string;    // Certificado manipulación alimentos
    rut?: string;            // RUT o doc comercial
    sanitary?: string;       // Permiso sanitario
  };

  // Stats (calculados)
  rating?: number;
  reviewCount?: number;
  totalOrders?: number;
  totalRevenue?: number;

  createdAt?: string;
  updatedAt?: string;
}

// ─── RESTAURANTE (vista pública) ───────────────────────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  bannerImage: string;
  rating: number;
  reviewCount: number;
  distance: string;
  estimatedTime: string;
  tags: string[];
  verified: boolean;
  discount?: string;
  categories: Category[];
  description: string;
  minOrder: number;
  deliveryFee: number;
  schedule: string;
  address: string;
  phone?: string;
  paymentMethods: string[];
}

// ─── PRODUCTO DEL VENDEDOR ─────────────────────────────────────────────────
export interface SellerProduct {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  available: boolean;
  ingredients?: string[];
  discount?: number;        // porcentaje
  isPopular?: boolean;
  isNew?: boolean;
  rating?: number;
  calories?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Alias para compatibilidad
export type MenuItem = SellerProduct;

// ─── CARRITO ───────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
}

// ─── PEDIDO ────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface AppOrder {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  address: string;
  paymentMethod: 'cash' | 'card' | 'pse';
  notes?: string;
  specialInstructions?: string;  // instrucciones para el restaurante
  estimatedTime: string;
  createdAt: string;
  hasReview?: boolean;           // si ya dejó reseña
}

// Alias
export type Order = AppOrder;

// ─── RESEÑA ────────────────────────────────────────────────────────────────

/** Calificaciones por categoría (1-5 cada una) */
export interface ReviewRatings {
  sabor: number;       // Sabor de la comida
  atencion: number;    // Atención / servicio
  rapidez: number;     // Rapidez de entrega
  precio: number;      // Relación precio-calidad
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  orderId?: string;          // pedido relacionado (compradores verificados)
  /** Promedio calculado de las 4 categorías */
  rating: number;
  /** Calificaciones individuales por categoría */
  ratings: ReviewRatings;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful?: number;
  verifiedPurchase?: boolean;
}

export type ReviewFilter = 'recent' | 'best' | 'verified';

export interface ReviewStats {
  average: number;
  total: number;
  /** Promedio por categoría */
  categoryAverages: ReviewRatings;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

// ─── FAVORITOS ─────────────────────────────────────────────────────────────
export interface FavoritesState {
  restaurantIds: string[];
  menuItemIds: string[];
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface SellerOnboardingData {
  // Step 1: Business info
  restaurantName: string;
  description: string;
  category: Category | '';
  address: string;
  city: string;
  phone: string;
  schedule: string;
  estimatedTime: string;
  deliveryFee: number;
  minOrder: number;

  // Step 2: Media
  logo: File | null;
  logoPreview: string;
  banner: File | null;
  bannerPreview: string;

  // Step 3: Documents
  identityDoc: File | null;
  foodHandlerDoc: File | null;
  rutDoc: File | null;
  sanitaryDoc: File | null;
}
