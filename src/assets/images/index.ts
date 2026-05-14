/**
 * Imágenes Centralizadas - Sabor Tolima Marketplace
 *
 * Todas las rutas apuntan a /public/images/ (servido estático por Vite y Vercel).
 * Para agregar fotos reales: coloca el archivo en la carpeta correspondiente
 * y actualiza la ruta aquí. SafeImage maneja el fallback automáticamente.
 */

// ─── PLACEHOLDERS ─────────────────────────────────────────────────────────────
export const PLACEHOLDER_IMAGES = {
  restaurant: '/images/restaurants/restaurant-placeholder.svg',
  product:    '/images/products/product-placeholder.svg',
  user:       '/images/users/user-placeholder.svg',
  // legacy aliases
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

// ─── RESTAURANTES ─────────────────────────────────────────────────────────────
// Para agregar foto real del restaurante N:
//   1. Coloca el archivo en: public/images/restaurants/rest-N.jpg
//   2. Cambia la ruta aquí: '/images/restaurants/rest-N.jpg'
// SafeImage mostrará el placeholder si el archivo no existe.
export const RESTAURANT_IMAGES: Record<string, string> = {
  '1':  '/images/restaurants/rest-1.jpg',
  '2':  '/images/restaurants/rest-2.jpg',
  '3':  '/images/restaurants/rest-3.jpg',
  '4':  '/images/restaurants/rest-4.jpg',
  '5':  '/images/restaurants/rest-5.jpg',
  '6':  '/images/restaurants/rest-6.jpg',
  '7':  '/images/restaurants/rest-7.jpg',
  '8':  '/images/restaurants/rest-8.jpg',
  '9':  '/images/restaurants/rest-9.jpg',
  '10': '/images/restaurants/rest-10.jpg',
  '11': '/images/restaurants/rest-11.jpg',
  '12': '/images/restaurants/rest-12.jpg',
  '13': '/images/restaurants/rest-13.jpg',
  '14': '/images/restaurants/rest-14.jpg',
  '15': '/images/restaurants/rest-15.jpg',
  '16': '/images/restaurants/rest-16.jpg',
  '17': '/images/restaurants/rest-17.jpg',
  '18': '/images/restaurants/rest-18.jpg',
  '19': '/images/restaurants/rest-19.jpg',
  '20': '/images/restaurants/rest-20.jpg',
  '21': '/images/restaurants/rest-21.jpg',
  '22': '/images/restaurants/rest-22.jpg',
};

// ─── COMIDAS / PRODUCTOS ──────────────────────────────────────────────────────
// Para agregar foto real: public/images/products/nombre.jpg
export const FOOD_IMAGES: Record<string, string> = {
  tamal:       '/images/products/tamal.jpg',
  lechona:     '/images/products/lechona.jpg',
  sancocho:    '/images/products/sancocho.jpg',
  avena:       '/images/products/avena.jpg',
  arepas:      '/images/products/arepas.jpg',
  achiras:     '/images/products/achiras.jpg',
  hamburguesa: '/images/products/hamburguesa.jpg',
  pizza:       '/images/products/pizza.jpg',
  pollo:       '/images/products/pollo.jpg',
  hotdog:      '/images/products/hotdog.jpg',
  ensalada:    '/images/products/ensalada.jpg',
  bowl:        '/images/products/bowl.jpg',
  smoothie:    '/images/products/smoothie.jpg',
  frutas:      '/images/products/frutas.jpg',
  cafe:        '/images/products/cafe.jpg',
  pasteles:    '/images/products/pasteles.jpg',
  panaderia:   '/images/products/panaderia.jpg',
  sushi:       '/images/products/sushi.jpg',
  francesa:    '/images/products/francesa.jpg',
  tapas:       '/images/products/tapas.jpg',
  steak:       '/images/products/steak.jpg',
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
