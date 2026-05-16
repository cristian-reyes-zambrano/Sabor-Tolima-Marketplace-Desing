/**
 * Imágenes - Sabor Tolima Marketplace
 *
 * Prioridad de carga:
 *   1. /images/restaurants/rest-N.jpg  → foto real local (sube desde el Panel Vendedor)
 *   2. URL de Unsplash                 → foto de referencia mientras no hay local
 *   3. Placeholder SVG                 → fallback final
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

// ─── FOTOS DE REFERENCIA (Unsplash) ───────────────────────────────────────────
// Mientras el vendedor no sube su foto, se muestra esta imagen de referencia.
// Cuando sube su foto desde el Panel Vendedor → se guarda en Firebase Storage
// y reemplaza automáticamente esta referencia.
const UNSPLASH: Record<string, string> = {
  '1':  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80', // lechona
  '2':  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&q=80', // tamales
  '3':  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80', // sancocho
  '4':  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&q=80', // dulces
  '5':  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&q=80', // parrilla
  '6':  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80', // pizza
  '7':  'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop&q=80', // pollo
  '8':  'https://images.unsplash.com/photo-1619740455993-8e4b7f0ce1c6?w=600&h=400&fit=crop&q=80', // perros
  '9':  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=80', // ensaladas
  '10': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80', // frutas
  '11': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop&q=80', // bowl fit
  '12': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop&q=80', // jugos
  '13': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80', // café
  '14': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&q=80', // panadería
  '15': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80', // tortas
  '16': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80', // avena
  '17': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80', // gourmet
  '18': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&q=80', // casona
  '19': 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop&q=80', // parrilla
  '20': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80', // asadero
  '21': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80', // almuerzo
  '22': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop&q=80', // combos
};

// ─── RESTAURANTES ─────────────────────────────────────────────────────────────
// La ruta local tiene prioridad. SafeImage cae a Unsplash si no existe el JPG.
export const RESTAURANT_IMAGES: Record<string, string> = Object.fromEntries(
  Object.keys(UNSPLASH).map(id => [id, `/images/restaurants/rest-${id}.jpg`])
);

// Fallback de Unsplash por ID
export const RESTAURANT_UNSPLASH: Record<string, string> = UNSPLASH;

// ─── COMIDAS / PRODUCTOS ──────────────────────────────────────────────────────
export const FOOD_IMAGES: Record<string, string> = {
  lechona:    UNSPLASH['1'],
  tamal:      UNSPLASH['2'],
  sancocho:   UNSPLASH['3'],
  achiras:    UNSPLASH['4'],
  chorizo:    UNSPLASH['5'],
  pizza:      UNSPLASH['6'],
  pollo:      UNSPLASH['7'],
  hotdog:     UNSPLASH['8'],
  ensalada:   UNSPLASH['9'],
  frutas:     UNSPLASH['10'],
  bowl:       UNSPLASH['11'],
  jugo:       UNSPLASH['12'],
  cafe:       UNSPLASH['13'],
  panaderia:  UNSPLASH['14'],
  torta:      UNSPLASH['15'],
  avena:      UNSPLASH['16'],
  gourmet:    UNSPLASH['17'],
  almuerzo:   UNSPLASH['21'],
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
  CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] ?? PLACEHOLDER_IMAGES.restaurant;

export const getFoodImage = (food: string): string =>
  FOOD_IMAGES[food] ?? PLACEHOLDER_IMAGES.product;

/** URL de Unsplash de respaldo para SafeImage */
export const getRestaurantFallback = (id: string): string =>
  RESTAURANT_UNSPLASH[id] ?? PLACEHOLDER_IMAGES.restaurant;
