/**
 * Firestore Service - Sabor Tolima Marketplace
 * CRUD completo con aislamiento por seller y soporte admin
 */
import {
  doc, getDoc, setDoc, updateDoc, collection, query,
  where, getDocs, addDoc, deleteDoc, orderBy, limit,
  serverTimestamp, Timestamp, writeBatch, getCountFromServer,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { AppUser, SellerProfile, SellerProduct, AppOrder } from '../app/types';

const C = {
  USERS: 'users',
  SELLERS: 'sellers',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  FAVORITES: 'favorites',
} as const;

// ─── Timestamp helper ────────────────────────────────────────────────────────
function tsToISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

// ─── USERS ───────────────────────────────────────────────────────────────────
export async function createUserDocument(user: AppUser): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, C.USERS, user.id), {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserDocument(uid: string): Promise<AppUser | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, C.USERS, uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, id: snap.id, createdAt: tsToISO(d.createdAt) } as AppUser;
}

export async function updateUserDocument(uid: string, data: Partial<AppUser>): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, C.USERS, uid), { ...data, updatedAt: serverTimestamp() });
}

// ─── SELLERS ─────────────────────────────────────────────────────────────────
export async function createSellerProfile(profile: SellerProfile): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, C.SELLERS, profile.sellerId), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getSellerProfile(sellerId: string): Promise<SellerProfile | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, C.SELLERS, sellerId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { ...d, sellerId: snap.id, createdAt: tsToISO(d.createdAt) } as SellerProfile;
}

export async function updateSellerProfile(sellerId: string, data: Partial<SellerProfile>): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, C.SELLERS, sellerId), { ...data, updatedAt: serverTimestamp() });
}

/** Admin: obtener todos los sellers */
export async function getAllSellers(): Promise<SellerProfile[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, C.SELLERS));
  return snap.docs.map((d) => ({ ...d.data(), sellerId: d.id } as SellerProfile));
}

/** Admin: cambiar estado de un seller */
export async function updateSellerStatus(
  sellerId: string,
  status: SellerProfile['status'],
  reason?: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, C.SELLERS, sellerId), {
    status,
    ...(reason ? { rejectionReason: reason } : {}),
    updatedAt: serverTimestamp(),
  });
}

// ─── PRODUCTS (aislados por restaurantId = sellerId) ─────────────────────────
export async function createProduct(
  product: Omit<SellerProduct, 'id' | 'createdAt'>
): Promise<string> {
  if (!isFirebaseConfigured()) return `demo-${Date.now()}`;
  const ref = await addDoc(collection(db, C.PRODUCTS), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProductsByRestaurant(restaurantId: string): Promise<SellerProduct[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(
    collection(db, C.PRODUCTS),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as SellerProduct));
}

export async function updateProduct(id: string, data: Partial<SellerProduct>): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, C.PRODUCTS, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await deleteDoc(doc(db, C.PRODUCTS, id));
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export async function createOrder(order: Omit<AppOrder, 'id' | 'createdAt'>): Promise<string> {
  if (!isFirebaseConfigured()) return `demo-order-${Date.now()}`;
  const ref = await addDoc(collection(db, C.ORDERS), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getOrdersByUser(userId: string): Promise<AppOrder[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(
    collection(db, C.ORDERS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...d.data(), id: d.id,
    createdAt: tsToISO(d.data().createdAt),
  } as AppOrder));
}

export async function getOrdersByRestaurant(restaurantId: string): Promise<AppOrder[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(
    collection(db, C.ORDERS),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...d.data(), id: d.id,
    createdAt: tsToISO(d.data().createdAt),
  } as AppOrder));
}

export async function updateOrderStatus(orderId: string, status: AppOrder['status']): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, C.ORDERS, orderId), { status, updatedAt: serverTimestamp() });
}

/** Admin: todos los pedidos */
export async function getAllOrders(limitCount = 100): Promise<AppOrder[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, C.ORDERS), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...d.data(), id: d.id,
    createdAt: tsToISO(d.data().createdAt),
  } as AppOrder));
}

// ─── FAVORITES (por usuario, en Firestore) ───────────────────────────────────
export interface FirestoreFavorites {
  restaurantIds: string[];
  menuItemIds: string[];
  updatedAt?: string;
}

export async function getFavorites(userId: string): Promise<FirestoreFavorites> {
  if (!isFirebaseConfigured()) return { restaurantIds: [], menuItemIds: [] };
  const snap = await getDoc(doc(db, C.FAVORITES, userId));
  if (!snap.exists()) return { restaurantIds: [], menuItemIds: [] };
  return snap.data() as FirestoreFavorites;
}

export async function saveFavorites(userId: string, data: FirestoreFavorites): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, C.FAVORITES, userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── ADMIN STATS ─────────────────────────────────────────────────────────────
export async function getAdminStats(): Promise<{
  totalSellers: number;
  pendingSellers: number;
  totalOrders: number;
  totalProducts: number;
}> {
  if (!isFirebaseConfigured()) {
    return { totalSellers: 22, pendingSellers: 3, totalOrders: 156, totalProducts: 89 };
  }
  const [sellersSnap, pendingSnap, ordersSnap, productsSnap] = await Promise.all([
    getCountFromServer(collection(db, C.SELLERS)),
    getCountFromServer(query(collection(db, C.SELLERS), where('status', '==', 'pending'))),
    getCountFromServer(collection(db, C.ORDERS)),
    getCountFromServer(collection(db, C.PRODUCTS)),
  ]);
  return {
    totalSellers: sellersSnap.data().count,
    pendingSellers: pendingSnap.data().count,
    totalOrders: ordersSnap.data().count,
    totalProducts: productsSnap.data().count,
  };
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
import type { Review, ReviewStats, ReviewRatings } from '../app/types';

const REVIEWS = 'reviews';

/** Calcula el promedio de las 4 categorías */
function calcAverage(ratings: ReviewRatings): number {
  const vals = [ratings.sabor, ratings.atencion, ratings.rapidez, ratings.precio];
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 10) / 10;
}

export async function createReview(
  review: Omit<Review, 'id' | 'createdAt' | 'rating'>
): Promise<string> {
  const rating = calcAverage(review.ratings);
  if (!isFirebaseConfigured()) return `demo-review-${Date.now()}`;
  const ref = await addDoc(collection(db, REVIEWS), {
    ...review,
    rating,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReviewsByRestaurant(
  restaurantId: string,
  limitCount = 30
): Promise<Review[]> {
  if (!isFirebaseConfigured()) return DEMO_REVIEWS.filter((r) => r.restaurantId === restaurantId);
  const q = query(
    collection(db, REVIEWS),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...d.data(),
    id: d.id,
    createdAt: tsToISO(d.data().createdAt),
  } as Review));
}

export async function hasUserReviewedRestaurant(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const q = query(
    collection(db, REVIEWS),
    where('userId', '==', userId),
    where('restaurantId', '==', restaurantId),
    limit(1)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getReviewStats(restaurantId: string): Promise<ReviewStats> {
  const reviews = await getReviewsByRestaurant(restaurantId, 200);
  const empty: ReviewStats = {
    average: 0,
    total: 0,
    categoryAverages: { sabor: 0, atencion: 0, rapidez: 0, precio: 0 },
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
  if (reviews.length === 0) return empty;

  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sumTotal = 0;
  const catSum: ReviewRatings = { sabor: 0, atencion: 0, rapidez: 0, precio: 0 };

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    dist[star]++;
    sumTotal += r.rating;
    if (r.ratings) {
      catSum.sabor    += r.ratings.sabor    ?? 0;
      catSum.atencion += r.ratings.atencion ?? 0;
      catSum.rapidez  += r.ratings.rapidez  ?? 0;
      catSum.precio   += r.ratings.precio   ?? 0;
    }
  });

  const n = reviews.length;
  return {
    average: Math.round((sumTotal / n) * 10) / 10,
    total: n,
    categoryAverages: {
      sabor:    Math.round((catSum.sabor    / n) * 10) / 10,
      atencion: Math.round((catSum.atencion / n) * 10) / 10,
      rapidez:  Math.round((catSum.rapidez  / n) * 10) / 10,
      precio:   Math.round((catSum.precio   / n) * 10) / 10,
    },
    distribution: dist,
  };
}

// Demo reviews
const DEMO_REVIEWS: Review[] = [
  {
    id: 'r1', userId: 'u1', userName: 'María Fernanda Perdomo',
    userAvatar: undefined,
    restaurantId: '1', rating: 4.8,
    ratings: { sabor: 5, atencion: 5, rapidez: 4, precio: 5 },
    comment: 'La lechona de la familia Perdomo es insuperable. Llegó caliente, bien empacada y con el ají de maní que la hace única en Ibagué. Llevo 10 años siendo cliente.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    verifiedPurchase: true, helpful: 12,
  },
  {
    id: 'r2', userId: 'u2', userName: 'Carlos Andrés Vargas',
    userAvatar: undefined,
    restaurantId: '1', rating: 4.0,
    ratings: { sabor: 4, atencion: 4, rapidez: 4, precio: 4 },
    comment: 'Muy buena atención y las porciones son generosas. El tamal tolimense es espectacular. Recomendado para quien quiera comer auténtico en el Centro de Ibagué.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    verifiedPurchase: true, helpful: 8,
  },
  {
    id: 'r3', userId: 'u3', userName: 'Ana Lucía Ospina',
    userAvatar: undefined,
    restaurantId: '1', rating: 4.5,
    ratings: { sabor: 5, atencion: 4, rapidez: 5, precio: 4 },
    comment: 'La avena tolimense preparada al fuego de leña es increíble. Sabe exactamente como la que hacía mi abuela en Ibagué. Volveré pronto.',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    verifiedPurchase: false, helpful: 5,
  },
  {
    id: 'r4', userId: 'u4', userName: 'Luis Eduardo Torres',
    userAvatar: undefined,
    restaurantId: '1', rating: 3.8,
    ratings: { sabor: 4, atencion: 4, rapidez: 3, precio: 4 },
    comment: 'Buena comida típica ibagueña, porciones generosas. El servicio fue un poco lento pero la calidad lo vale.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    verifiedPurchase: false, helpful: 3,
  },
  {
    id: 'r5', userId: 'u5', userName: 'Sofía Herrera Ríos',
    userAvatar: undefined,
    restaurantId: '5', rating: 4.8,
    ratings: { sabor: 5, atencion: 5, rapidez: 5, precio: 4 },
    comment: 'Los chorizos tolimenses a la parrilla son increíbles. El ají de maní que los acompaña es adictivo. El mejor asadero de La Pola sin duda.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    verifiedPurchase: true, helpful: 15,
  },
  {
    id: 'r6', userId: 'u6', userName: 'Diego Morales Ibáñez',
    userAvatar: undefined,
    restaurantId: '5', rating: 4.0,
    ratings: { sabor: 4, atencion: 4, rapidez: 4, precio: 4 },
    comment: 'Las costillas BBQ con panela tolimense son una delicia. Llegaron rápido y calientes. Excelente relación precio-calidad para Ibagué.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    verifiedPurchase: true, helpful: 7,
  },
];
