/**
 * Imágenes Centralizadas - Sabor Tolima Marketplace
 *
 * PRIORIDAD:
 *   1. /images/restaurants/rest-N.jpg  → foto real local (coloca aquí tu JPG)
 *   2. URL de Unsplash                 → foto de referencia mientras no hay local
 *
 * PARA AGREGAR TU FOTO REAL:
 *   1. Guarda el JPG en: public/images/restaurants/rest-N.jpg
 *   2. Listo — SafeImage la carga automáticamente, Unsplash queda como fallback
 */

// ─── PLACEHOLDERS ─────────────────────────────────────────────────────────────
export const PLACEHOLDER_IMAGES = {
  restaurant: '/images/restaurants/restaurant-placeholder.svg',
  product:    '/images/products/product-placeholder.svg',
  user:       '/images/users/user-placeholder.svg',
  food:       '/images/products/product-placeholder.svg',
  avatar:     '/images/users/user-placeholder.svg',
  error:      '/images/restaurants/restaurant-placeholder.svg',
  loading:    '/images/restaurants/restaurant-placeholder.svg',
} as const;

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
export const CATEGORY_IMAGES = {
  tipica:    '/images/cat-tipica.svg',
  rapida:    '/images/cat-rapida.svg',
  saludable: '/images/cat-saludable.svg',
  cafeteria: '/images/cat-cafeteria.svg',
  gourmet:   '/images/cat-gourmet.svg',
  ofertas:   '/images/cat-ofertas.svg',
} as const;

// ─── BANNERS ──────────────────────────────────────────────────────────────────
export const BANNER_IMAGES = {
  hero:      '/images/placeholder-hero.svg',
  promotion: '/images/restaurants/restaurant-placeholder.svg',
} as const;

// ─── FOTOS DE REFERENCIA POR RESTAURANTE (Unsplash — gastronomía colombiana) ──
// Cada URL corresponde al tipo de comida del restaurante.
// Reemplaza con tu foto local en public/images/restaurants/rest-N.jpg
const UNSPLASH: Record<string, string> = {
  // 1 — Lechonería La Tradición (lechona / cerdo asado)
  '1':  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80',
  // 2 — Tamales Don José (tamales / comida envuelta)
  '2':  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&q=80',
  // 3 — Comidas Caseras Doña Ana (sancocho / sopa)
  '3':  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80',
  // 4 — Achiras y Dulces de Belén (dulces / postres artesanales)
  '4':  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&q=80',
  // 5 — Asados El Tolimense (parrilla / asados)
  '5':  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&q=80',
  // 6 — Pizzería Cádiz (pizza)
  '6':  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80',
  // 7 — Pollos El Jordán (pollo frito)
  '7':  'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop&q=80',
  // 8 — Perros & Más Picaleña (perros calientes)
  '8':  'https://images.unsplash.com/photo-1619740455993-8e4b7f0ce1c6?w=600&h=400&fit=crop&q=80',
  // 9 — Ensaladas Frescas Ambalá (ensaladas / bowls)
  '9':  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=80',
  // 10 — Frutas y Jugos Mirolindo (frutas tropicales)
  '10': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80',
  // 11 — Cocina Fit Piedra Pintada (comida saludable)
  '11': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop&q=80',
  // 12 — Bar de Jugos El Centro (jugos naturales)
  '12': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop&q=80',
  // 13 — Café Musical de Ibagué (café colombiano)
  '13': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80',
  // 14 — Panadería La Pola (panadería / almojábanas)
  '14': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&q=80',
  // 15 — Dulcería Doña Carmen (dulces / tortas)
  '15': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80',
  // 16 — Avena y Masato Don Rodrigo (bebidas calientes)
  '16': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
  // 17 — El Tolimense Gourmet (alta cocina colombiana)
  '17': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80',
  // 18 — Restaurante La Casona (restaurante elegante)
  '18': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&q=80',
  // 19 — Parrilla El Cádiz (carnes a la parrilla)
  '19': 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop&q=80',
  // 20 — Asadero Don Hernando (asadero familiar)
  '20': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80',
  // 21 — Menú del Día La 21 (almuerzo casero)
  '21': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
  // 22 — Combos Rápidos El Salado (combos económicos)
  '22': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop&q=80',
};

// ─── RESTAURANTES ─────────────────────────────────────────────────────────────
// Intenta cargar foto local primero; si no existe, usa Unsplash.
// SafeImage maneja el fallback automáticamente con onError.
export const RESTAURANT_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(UNSPLASH).map(([id, unsplashUrl]) => [
    id,
    // La foto local tiene prioridad — SafeImage cae a unsplashUrl si no existe
    `/images/restaurants/rest-${id}.jpg`,
  ])
);

// URL de Unsplash de respaldo por ID (usada en SafeImage como segundo fallback)
export const RESTAURANT_UNSPLASH: Record<string, string> = UNSPLASH;

// ─── COMIDAS / PRODUCTOS ──────────────────────────────────────────────────────
export const FOOD_IMAGES: Record<string, string> = {
  tamal:       'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&q=80',
  lechona:     'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80',
  sancocho:    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80',
  avena:       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  arepas:      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&q=80',
  achiras:     'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&q=80',
  hamburguesa: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80',
  pizza:       'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&q=80',
  pollo:       'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&q=80',
  hotdog:      'https://images.unsplash.com/photo-1619740455993-8e4b7f0ce1c6?w=400&h=300&fit=crop&q=80',
  ensalada:    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80',
  bowl:        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80',
  smoothie:    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&q=80',
  frutas:      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&q=80',
  cafe:        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&q=80',
  pasteles:    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
  panaderia:   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80',
  steak:       'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80',
  chorizo:     'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&q=80',
  costillas:   'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80',
  almuerzo:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80',
};

// ─── LOGOS ────────────────────────────────────────────────────────────────────
export const LOGO_IMAGES = {
  main:    '/images/restaurants/restaurant-placeholder.svg',
  favicon: '/images/restaurants/restaurant-placeholder.svg',
} as const;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const getRestaurantImage = (id: string): string =>
  RESTAURANT_IMAGES[id] ?? PLACEHOLDER_IMAGES.restaurant;

export const getCategoryImage = (category: string): string =>
  CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES]
  ?? PLACEHOLDER_IMAGES.restaurant;

export const getFoodImage = (food: string): string =>
  FOOD_IMAGES[food] ?? PLACEHOLDER_IMAGES.product;

/** Retorna la URL de Unsplash de respaldo para un restaurante */
export const getRestaurantFallback = (id: string): string =>
  RESTAURANT_UNSPLASH[id] ?? PLACEHOLDER_IMAGES.restaurant;
