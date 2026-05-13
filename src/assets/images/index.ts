/**
 * Imágenes Centralizadas - Sabor Tolima Marketplace
 * Todas las imágenes del proyecto organizadas por categoría
 * Usando URLs de alta calidad de Unsplash para gastronomía auténtica
 */

// RESTAURANTES - Imágenes específicas por restaurante
export const RESTAURANT_IMAGES = {
  // Típica - Gastronomía Tolimense
  '1': 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop', // Lechona
  '2': 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop', // Tamales
  '3': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Sancocho
  '4': 'https://images.unsplash.com/photo-1585599810694-13bae885ae21?w=400&h=300&fit=crop', // Achiras

  // Rápida
  '5': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', // Hamburguesa
  '6': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', // Pizza
  '7': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop', // Pollo
  '8': 'https://images.unsplash.com/photo-1619740455993-8e4b7f0ce1c6?w=400&h=300&fit=crop', // Hot Dog

  // Saludable
  '9': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // Ensalada
  '10': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', // Bowl saludable
  '11': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', // Smoothie
  '12': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', // Frutas

  // Cafetería
  '13': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', // Café
  '14': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Pasteles
  '15': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', // Panadería
  '16': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Avena

  // Gourmet
  '17': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', // Sushi
  '18': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // Francesa
  '19': 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop', // Tapas
  '20': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // Steak

  // Ofertas
  '21': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop', // Oferta 1
  '22': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', // Oferta 2
} as const;

// CATEGORÍAS - Iconos/imágenes representativas
export const CATEGORY_IMAGES = {
  tipica: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=64&h=64&fit=crop',
  rapida: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=64&h=64&fit=crop',
  saludable: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=64&h=64&fit=crop',
  cafeteria: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=64&h=64&fit=crop',
  gourmet: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=64&h=64&fit=crop',
  ofertas: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=64&h=64&fit=crop',
} as const;

// BANNERS - Para hero section y promociones
export const BANNER_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop', // Hero banner comida
  promotion: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=300&fit=crop', // Promoción
} as const;

// FOODS - Imágenes genéricas de comida por tipo
export const FOOD_IMAGES = {
  tamal: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=300&h=200&fit=crop',
  lechona: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=300&h=200&fit=crop',
  sancocho: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
  avena: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
  arepas: 'https://images.unsplash.com/photo-1585599810694-13bae885ae21?w=300&h=200&fit=crop',
  achiras: 'https://images.unsplash.com/photo-1585599810694-13bae885ae21?w=300&h=200&fit=crop',
  hamburguesa: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
  pollo: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop',
  hotdog: 'https://images.unsplash.com/photo-1619740455993-8e4b7f0ce1c6?w=300&h=200&fit=crop',
  ensalada: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
  bowl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
  smoothie: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
  frutas: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
  pasteles: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
  panaderia: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop',
  francesa: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
  tapas: 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=300&h=200&fit=crop',
  steak: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
} as const;

// LOGOS - Logo de la app y partners
export const LOGO_IMAGES = {
  main: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop', // Logo placeholder
  favicon: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=32&h=32&fit=crop',
} as const;

// PLACEHOLDERS - Para estados de carga o errores
export const PLACEHOLDER_IMAGES = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  food: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  error: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
  loading: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
} as const;

// Función helper para obtener imagen de restaurante por ID
export const getRestaurantImage = (id: string): string => {
  return RESTAURANT_IMAGES[id as keyof typeof RESTAURANT_IMAGES] || PLACEHOLDER_IMAGES.restaurant;
};

// Función helper para obtener imagen de categoría
export const getCategoryImage = (category: string): string => {
  return CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] || PLACEHOLDER_IMAGES.food;
};

// Función helper para obtener imagen de comida
export const getFoodImage = (food: string): string => {
  return FOOD_IMAGES[food as keyof typeof FOOD_IMAGES] || PLACEHOLDER_IMAGES.food;
};