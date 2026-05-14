/**
 * Menús de restaurantes ibagueños — Sabor Tolima Marketplace
 * Platos con identidad gastronómica del Tolima y de Ibagué.
 *
 * Para agregar foto real de un plato:
 *   1. Coloca el JPG en: src/assets/images/menu/restaurante-X/nombre.jpg
 *   2. Importa en:       src/assets/images/menu/index.ts
 *   3. La ruta local reemplaza automáticamente el placeholder.
 */
import type { MenuItem } from '../types';
import { getMenuImage } from '../../assets/images/menu';

const PH = '/images/products/product-placeholder.svg';

export const menuData: Record<string, MenuItem[]> = {

  // ─── 1 — Lechonería La Tradición Ibagueña ────────────────────────────────
  '1': [
    {
      id: 'm1-1', restaurantId: '1',
      name: 'Lechona Tolimense Completa',
      description: 'Lechona entera rellena de arroz, arvejas y especias, horneada 12 horas. Porción generosa con arepa de chócolo y ají de maní.',
      price: 28000, image: getMenuImage('m1-1', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm1-2', restaurantId: '1',
      name: 'Media Lechona con Arepa',
      description: 'Porción mediana de lechona tolimense con arroz, arepa de chócolo y ají casero.',
      price: 18000, image: getMenuImage('m1-2', PH),
      category: 'principales', rating: 4.8, available: true,
    },
    {
      id: 'm1-3', restaurantId: '1',
      name: 'Tamal Tolimense',
      description: 'Tamal tradicional envuelto en hoja de plátano con pollo de campo, cerdo y arroz.',
      price: 12000, image: getMenuImage('m1-3', PH),
      category: 'entradas', isPopular: true, rating: 4.7, available: true,
    },
    {
      id: 'm1-4', restaurantId: '1',
      name: 'Avena Tolimense Caliente',
      description: 'Avena cremosa preparada al fuego de leña con canela, clavo y panela de la región.',
      price: 5000, image: getMenuImage('m1-4', PH),
      category: 'bebidas', rating: 4.6, available: true,
    },
    {
      id: 'm1-5', restaurantId: '1',
      name: 'Achiras del Tolima',
      description: 'Galletas de achira artesanales con queso campesino, el postre típico ibagueño.',
      price: 8000, image: getMenuImage('m1-5', PH),
      category: 'postres', rating: 4.5, available: true,
    },
    {
      id: 'm1-6', restaurantId: '1',
      name: 'Combo Lechona Familiar',
      description: 'Lechona completa + 4 tamales + 4 avenas tolimenses. Ideal para reunión familiar.',
      price: 75000, image: getMenuImage('m1-6', PH),
      category: 'combos', isPopular: true, discount: 15, rating: 4.9, available: true,
    },
    {
      id: 'm1-7', restaurantId: '1',
      name: 'Sancocho de Costilla Ibagueño',
      description: 'Sopa tradicional con costilla de res, papa criolla, yuca y plátano verde del Tolima.',
      price: 20000, image: getMenuImage('m1-7', PH),
      category: 'recomendados', isNew: true, rating: 4.8, available: true,
    },
  ],

  // ─── 2 — Tamales Don José – La Pola ──────────────────────────────────────
  '2': [
    {
      id: 'm2-1', restaurantId: '2',
      name: 'Tamal Tolimense Clásico',
      description: 'Tamal con pollo de campo, cerdo criollo, arroz y arvejas en hoja de plátano fresca.',
      price: 12000, image: getMenuImage('m2-1', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm2-2', restaurantId: '2',
      name: 'Tamal de Pipián Tolimense',
      description: 'Tamal especial con salsa de pipián, maní tostado y especias de la región.',
      price: 14000, image: getMenuImage('m2-2', PH),
      category: 'principales', isNew: true, rating: 4.7, available: true,
    },
    {
      id: 'm2-3', restaurantId: '2',
      name: 'Arepa de Chócolo con Queso',
      description: 'Arepa de maíz chócolo artesanal con queso campesino del Tolima derretido.',
      price: 6000, image: getMenuImage('m2-3', PH),
      category: 'entradas', rating: 4.6, available: true,
    },
    {
      id: 'm2-4', restaurantId: '2',
      name: 'Avena Fría Tolimense',
      description: 'Avena tolimense fría con leche, canela, clavo y panela de la región.',
      price: 5000, image: getMenuImage('m2-4', PH),
      category: 'bebidas', rating: 4.8, available: true,
    },
    {
      id: 'm2-5', restaurantId: '2',
      name: 'Combo Desayuno Ibagueño',
      description: '2 tamales tolimenses + arepa de chócolo con queso + avena fría. El desayuno de Ibagué.',
      price: 28000, image: getMenuImage('m2-5', PH),
      category: 'combos', isPopular: true, discount: 20, rating: 4.9, available: true,
    },
    {
      id: 'm2-6', restaurantId: '2',
      name: 'Docena de Tamales para Llevar',
      description: '12 tamales tolimenses empacados para eventos, reuniones o regalos.',
      price: 120000, image: getMenuImage('m2-6', PH),
      category: 'recomendados', discount: 10, rating: 4.8, available: true,
    },
  ],

  // ─── 3 — Comidas Caseras Doña Ana – El Salado ────────────────────────────
  '3': [
    {
      id: 'm3-1', restaurantId: '3',
      name: 'Sancocho de Gallina Criolla',
      description: 'Sancocho de gallina criolla del Tolima con papa, yuca, plátano y cilantro fresco.',
      price: 22000, image: getMenuImage('m3-1', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm3-2', restaurantId: '3',
      name: 'Mondongo Ibagueño',
      description: 'Mondongo preparado con panza de res, papa criolla, garbanzos y especias tolimenses.',
      price: 20000, image: getMenuImage('m3-2', PH),
      category: 'principales', rating: 4.7, available: true,
    },
    {
      id: 'm3-3', restaurantId: '3',
      name: 'Almuerzo Casero Completo',
      description: 'Sopa del día + seco con arroz, frijoles y proteína + jugo de fruta natural.',
      price: 18000, image: getMenuImage('m3-3', PH),
      category: 'combos', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm3-4', restaurantId: '3',
      name: 'Jugo de Cholupa Natural',
      description: 'Jugo de cholupa tolimense natural, sin azúcar añadida. Fruta de la región.',
      price: 5000, image: getMenuImage('m3-4', PH),
      category: 'bebidas', rating: 4.7, available: true,
    },
    {
      id: 'm3-5', restaurantId: '3',
      name: 'Natilla Tolimense',
      description: 'Natilla de maíz con canela y panela, postre tradicional de Ibagué.',
      price: 7000, image: getMenuImage('m3-5', PH),
      category: 'postres', rating: 4.6, available: true,
    },
  ],

  // ─── 5 — Asados El Tolimense – La Pola ───────────────────────────────────
  '5': [
    {
      id: 'm5-1', restaurantId: '5',
      name: 'Chorizo Tolimense a la Parrilla',
      description: 'Chorizo artesanal de cerdo tolimense a las brasas con papa criolla y ají de maní.',
      price: 18000, image: getMenuImage('m5-1', PH),
      category: 'principales', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm5-2', restaurantId: '5',
      name: 'Costillas BBQ Tolimenses',
      description: 'Costillas de cerdo criollo marinadas en salsa BBQ con panela y especias locales.',
      price: 32000, image: getMenuImage('m5-2', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm5-3', restaurantId: '5',
      name: 'Morcilla y Longaniza',
      description: 'Morcilla de arroz y longaniza tolimense a la parrilla. Acompañadas de arepa.',
      price: 22000, image: getMenuImage('m5-3', PH),
      category: 'entradas', isPopular: true, rating: 4.7, available: true,
    },
    {
      id: 'm5-4', restaurantId: '5',
      name: 'Papa Criolla Asada',
      description: 'Papa criolla del Tolima asada a las brasas con mantequilla y sal marina.',
      price: 10000, image: getMenuImage('m5-4', PH),
      category: 'entradas', rating: 4.5, available: true,
    },
    {
      id: 'm5-5', restaurantId: '5',
      name: 'Limonada de Panela',
      description: 'Limonada artesanal con panela de la región, limón y hierbabuena fresca.',
      price: 6000, image: getMenuImage('m5-5', PH),
      category: 'bebidas', rating: 4.6, available: true,
    },
    {
      id: 'm5-6', restaurantId: '5',
      name: 'Parrillada Familiar La Pola',
      description: 'Chorizo + costillas + morcilla + longaniza + papa criolla + 4 bebidas.',
      price: 75000, image: getMenuImage('m5-6', PH),
      category: 'combos', isPopular: true, discount: 15, rating: 4.9, available: true,
    },
    {
      id: 'm5-7', restaurantId: '5',
      name: 'Postre de Guanábana',
      description: 'Mousse de guanábana tolimense con galleta de achira. Postre fresco y cremoso.',
      price: 10000, image: getMenuImage('m5-7', PH),
      category: 'postres', rating: 4.6, available: true,
    },
  ],

  // ─── 9 — Ensaladas Frescas Ambalá ────────────────────────────────────────
  '9': [
    {
      id: 'm9-1', restaurantId: '9',
      name: 'Bowl Proteico Tolimense',
      description: 'Quinoa, pollo de campo grillado, aguacate hass, zanahoria y aderezo de maracuyá.',
      price: 28000, image: getMenuImage('m9-1', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm9-2', restaurantId: '9',
      name: 'Ensalada de Frutas Tropicales',
      description: 'Mango, maracuyá, guanábana, badea y cholupa con miel de abejas del Tolima.',
      price: 18000, image: getMenuImage('m9-2', PH),
      category: 'principales', rating: 4.7, available: true,
    },
    {
      id: 'm9-3', restaurantId: '9',
      name: 'Jugo Verde Detox Ambalá',
      description: 'Espinaca, manzana verde, pepino, jengibre y limón. Ingredientes frescos de la vereda.',
      price: 14000, image: getMenuImage('m9-3', PH),
      category: 'bebidas', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm9-4', restaurantId: '9',
      name: 'Wrap Vegano de la Región',
      description: 'Tortilla integral con hummus, vegetales asados del Tolima y aguacate hass.',
      price: 20000, image: getMenuImage('m9-4', PH),
      category: 'entradas', isNew: true, rating: 4.6, available: true,
    },
    {
      id: 'm9-5', restaurantId: '9',
      name: 'Combo Fit Ibagueño',
      description: 'Bowl proteico + jugo verde detox + fruta de temporada tolimense.',
      price: 38000, image: getMenuImage('m9-5', PH),
      category: 'combos', discount: 10, rating: 4.9, available: true,
    },
    {
      id: 'm9-6', restaurantId: '9',
      name: 'Granola con Frutas del Tolima',
      description: 'Yogur natural, granola artesanal, mango, maracuyá y miel de abejas regional.',
      price: 16000, image: getMenuImage('m9-6', PH),
      category: 'postres', rating: 4.7, available: true,
    },
  ],

  // ─── 13 — Café Musical de Ibagué ─────────────────────────────────────────
  '13': [
    {
      id: 'm13-1', restaurantId: '13',
      name: 'Café Tolimense Espresso',
      description: 'Espresso doble de granos de origen tolimense, tostado artesanal en Ibagué.',
      price: 6000, image: getMenuImage('m13-1', PH),
      category: 'bebidas', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm13-2', restaurantId: '13',
      name: 'Café con Leche Ibagueño',
      description: 'Café tolimense con leche fresca de la región, servido en pocillo de barro.',
      price: 8000, image: getMenuImage('m13-2', PH),
      category: 'bebidas', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm13-3', restaurantId: '13',
      name: 'Almojábana con Queso',
      description: 'Almojábana recién horneada con queso campesino del Tolima. Clásico ibagueño.',
      price: 7000, image: getMenuImage('m13-3', PH),
      category: 'entradas', rating: 4.7, available: true,
    },
    {
      id: 'm13-4', restaurantId: '13',
      name: 'Torta de Novia Tolimense',
      description: 'Torta de novia con bocadillo de guayaba y arequipe. Postre tradicional de Ibagué.',
      price: 12000, image: getMenuImage('m13-4', PH),
      category: 'postres', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm13-5', restaurantId: '13',
      name: 'Combo Desayuno Musical',
      description: 'Café tolimense + almojábana + jugo de cholupa. El desayuno del ibagueño.',
      price: 18000, image: getMenuImage('m13-5', PH),
      category: 'combos', discount: 10, rating: 4.8, available: true,
    },
    {
      id: 'm13-6', restaurantId: '13',
      name: 'Pandeyuca Artesanal',
      description: 'Pandeyuca de yuca y queso campesino, horneado al momento. Acompañado de café.',
      price: 6000, image: getMenuImage('m13-6', PH),
      category: 'recomendados', isNew: true, rating: 4.7, available: true,
    },
  ],

  // ─── 17 — El Tolimense Gourmet – Ambalá ──────────────────────────────────
  '17': [
    {
      id: 'm17-1', restaurantId: '17',
      name: 'Lechona Deconstruida',
      description: 'Reinterpretación gourmet de la lechona tolimense con técnicas contemporáneas. Crujiente de piel, mousse de arroz y gel de ají.',
      price: 55000, image: getMenuImage('m17-1', PH),
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm17-2', restaurantId: '17',
      name: 'Tamal Gourmet de Autor',
      description: 'Tamal tolimense con relleno de pato confitado, trufa y reducción de panela.',
      price: 48000, image: getMenuImage('m17-2', PH),
      category: 'principales', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm17-3', restaurantId: '17',
      name: 'Ceviche de Cachama Tolimense',
      description: 'Cachama del río Magdalena en leche de tigre con cholupa, cilantro y ají amarillo.',
      price: 38000, image: getMenuImage('m17-3', PH),
      category: 'entradas', rating: 4.7, available: true,
    },
    {
      id: 'm17-4', restaurantId: '17',
      name: 'Coctel de Cholupa y Ron',
      description: 'Coctel artesanal con cholupa tolimense, ron blanco, panela y hierbabuena.',
      price: 22000, image: getMenuImage('m17-4', PH),
      category: 'bebidas', rating: 4.8, available: true,
    },
    {
      id: 'm17-5', restaurantId: '17',
      name: 'Postre de Guanábana y Achira',
      description: 'Mousse de guanábana con crumble de achira y caramelo de panela negra.',
      price: 20000, image: getMenuImage('m17-5', PH),
      category: 'postres', isNew: true, rating: 4.9, available: true,
    },
    {
      id: 'm17-6', restaurantId: '17',
      name: 'Menú Degustación Tolimense',
      description: 'Experiencia completa: entrada + plato principal + postre + coctel de cholupa.',
      price: 120000, image: getMenuImage('m17-6', PH),
      category: 'combos', discount: 10, rating: 4.9, available: true,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMenuByRestaurant(restaurantId: string): MenuItem[] {
  return menuData[restaurantId] ?? generateDefaultMenu(restaurantId);
}

function generateDefaultMenu(restaurantId: string): MenuItem[] {
  const PH = '/images/products/product-placeholder.svg';
  return [
    {
      id: `${restaurantId}-d1`, restaurantId,
      name: 'Almuerzo del Día',
      description: 'Sopa + seco con arroz, frijoles y proteína del día. Preparado con ingredientes frescos de Ibagué.',
      price: 18000, image: getMenuImage(`${restaurantId}-d1`, PH),
      category: 'principales', isPopular: true, rating: 4.5, available: true,
    },
    {
      id: `${restaurantId}-d2`, restaurantId,
      name: 'Sopa Criolla Ibagueña',
      description: 'Sopa casera con papa criolla, yuca y verduras frescas del mercado local.',
      price: 12000, image: getMenuImage(`${restaurantId}-d2`, PH),
      category: 'entradas', rating: 4.4, available: true,
    },
    {
      id: `${restaurantId}-d3`, restaurantId,
      name: 'Jugo de Fruta Tolimense',
      description: 'Jugo natural de fruta de temporada del Tolima: cholupa, maracuyá o guanábana.',
      price: 5000, image: getMenuImage(`${restaurantId}-d3`, PH),
      category: 'bebidas', rating: 4.5, available: true,
    },
    {
      id: `${restaurantId}-d4`, restaurantId,
      name: 'Postre Casero',
      description: 'Natilla, manjar blanco o arroz con leche. Postre artesanal del día.',
      price: 8000, image: getMenuImage(`${restaurantId}-d4`, PH),
      category: 'postres', rating: 4.4, available: true,
    },
    {
      id: `${restaurantId}-d5`, restaurantId,
      name: 'Combo Almuerzo Completo',
      description: 'Sopa + seco + jugo de fruta tolimense + postre del día.',
      price: 32000, image: getMenuImage(`${restaurantId}-d5`, PH),
      category: 'combos', discount: 10, rating: 4.6, available: true,
    },
  ];
}

export function getMenuByCategory(restaurantId: string, category: string): MenuItem[] {
  return getMenuByRestaurant(restaurantId).filter((item) => item.category === category);
}

export function getPopularItems(restaurantId: string): MenuItem[] {
  return getMenuByRestaurant(restaurantId).filter((item) => item.isPopular);
}
