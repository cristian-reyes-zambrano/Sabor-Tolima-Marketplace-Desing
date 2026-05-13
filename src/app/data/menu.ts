/**
 * Datos de menú por restaurante
 * Cada restaurante tiene su propio menú con categorías y platos reales
 */
import type { MenuItem } from '../types';

export const menuData: Record<string, MenuItem[]> = {
  // ─── LECHONA TRADICIONAL TOLIMA ─────────────────────────────────────────────
  '1': [
    {
      id: 'm1-1', restaurantId: '1', name: 'Lechona Tolimense Completa',
      description: 'Lechona entera rellena de arroz, arvejas y especias, horneada por 12 horas. Porción generosa con arepa y ají.',
      price: 28000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm1-2', restaurantId: '1', name: 'Media Lechona',
      description: 'Porción mediana de lechona con arroz y arepa tolimense.',
      price: 18000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
      category: 'principales', rating: 4.8, available: true,
    },
    {
      id: 'm1-3', restaurantId: '1', name: 'Tamal Tolimense',
      description: 'Tamal tradicional envuelto en hoja de plátano con pollo, cerdo y arroz.',
      price: 12000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop',
      category: 'entradas', isPopular: true, rating: 4.7, available: true,
    },
    {
      id: 'm1-4', restaurantId: '1', name: 'Avena Tolimense',
      description: 'Avena cremosa preparada al fuego de leña con canela y panela.',
      price: 5000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'bebidas', rating: 4.6, available: true,
    },
    {
      id: 'm1-5', restaurantId: '1', name: 'Achiras del Tolima',
      description: 'Galletas de achira artesanales, el postre típico tolimense.',
      price: 8000, image: 'https://images.unsplash.com/photo-1585599810694-13bae885ae21?w=400&h=300&fit=crop',
      category: 'postres', rating: 4.5, available: true,
    },
    {
      id: 'm1-6', restaurantId: '1', name: 'Combo Lechona Familiar',
      description: 'Lechona completa + 4 tamales + 4 avenas. Ideal para familia.',
      price: 75000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
      category: 'combos', isPopular: true, discount: 15, rating: 4.9, available: true,
    },
    {
      id: 'm1-7', restaurantId: '1', name: 'Sancocho de Costilla',
      description: 'Sopa tradicional con costilla de res, papa, yuca y plátano.',
      price: 20000, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      category: 'recomendados', isNew: true, rating: 4.8, available: true,
    },
  ],

  // ─── TAMALERÍA SAN ALEJO ────────────────────────────────────────────────────
  '2': [
    {
      id: 'm2-1', restaurantId: '2', name: 'Tamal Tolimense Clásico',
      description: 'Tamal tradicional con pollo, cerdo, arroz y arvejas en hoja de plátano.',
      price: 12000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm2-2', restaurantId: '2', name: 'Tamal de Pipián',
      description: 'Tamal especial con salsa de pipián, maní y especias secretas.',
      price: 14000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop',
      category: 'principales', isNew: true, rating: 4.7, available: true,
    },
    {
      id: 'm2-3', restaurantId: '2', name: 'Arepa con Queso',
      description: 'Arepa de maíz artesanal con queso campesino derretido.',
      price: 6000, image: 'https://images.unsplash.com/photo-1585599810694-13bae885ae21?w=400&h=300&fit=crop',
      category: 'entradas', rating: 4.6, available: true,
    },
    {
      id: 'm2-4', restaurantId: '2', name: 'Avena Fría',
      description: 'Avena tolimense fría con leche, canela y panela.',
      price: 5000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'bebidas', rating: 4.8, available: true,
    },
    {
      id: 'm2-5', restaurantId: '2', name: 'Combo Desayuno Tolimense',
      description: '2 tamales + arepa con queso + avena. El desayuno perfecto.',
      price: 28000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop',
      category: 'combos', isPopular: true, discount: 20, rating: 4.9, available: true,
    },
    {
      id: 'm2-6', restaurantId: '2', name: 'Docena de Tamales',
      description: '12 tamales tolimenses para llevar. Perfectos para eventos.',
      price: 120000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=400&h=300&fit=crop',
      category: 'recomendados', discount: 10, rating: 4.8, available: true,
    },
  ],

  // ─── BURGERS & WINGS ────────────────────────────────────────────────────────
  '5': [
    {
      id: 'm5-1', restaurantId: '5', name: 'Burger Clásica',
      description: 'Carne 180g, lechuga, tomate, cebolla caramelizada y salsa especial.',
      price: 22000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.7, available: true,
    },
    {
      id: 'm5-2', restaurantId: '5', name: 'Burger BBQ Doble',
      description: 'Doble carne, bacon crujiente, queso cheddar y salsa BBQ ahumada.',
      price: 32000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm5-3', restaurantId: '5', name: 'Wings Buffalo (10 und)',
      description: '10 alitas de pollo en salsa buffalo picante con dip de queso azul.',
      price: 28000, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
      category: 'entradas', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm5-4', restaurantId: '5', name: 'Papas Fritas Cargadas',
      description: 'Papas fritas con queso cheddar, bacon y cebollín.',
      price: 14000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'entradas', rating: 4.5, available: true,
    },
    {
      id: 'm5-5', restaurantId: '5', name: 'Limonada de Coco',
      description: 'Limonada fresca con leche de coco y menta.',
      price: 8000, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      category: 'bebidas', rating: 4.6, available: true,
    },
    {
      id: 'm5-6', restaurantId: '5', name: 'Combo Burger + Wings',
      description: 'Burger clásica + 6 wings + papas fritas + bebida.',
      price: 45000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'combos', isPopular: true, discount: 15, rating: 4.8, available: true,
    },
    {
      id: 'm5-7', restaurantId: '5', name: 'Brownie con Helado',
      description: 'Brownie de chocolate caliente con helado de vainilla.',
      price: 12000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'postres', rating: 4.7, available: true,
    },
  ],

  // ─── GREEN BOWL SALADS ──────────────────────────────────────────────────────
  '9': [
    {
      id: 'm9-1', restaurantId: '9', name: 'Buddha Bowl Proteico',
      description: 'Quinoa, pollo grillado, aguacate, edamame, zanahoria y aderezo tahini.',
      price: 28000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm9-2', restaurantId: '9', name: 'Ensalada César Premium',
      description: 'Lechuga romana, pollo a la plancha, crutones artesanales y aderezo césar.',
      price: 24000, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      category: 'principales', rating: 4.7, available: true,
    },
    {
      id: 'm9-3', restaurantId: '9', name: 'Smoothie Verde Detox',
      description: 'Espinaca, manzana verde, pepino, jengibre y limón.',
      price: 14000, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      category: 'bebidas', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm9-4', restaurantId: '9', name: 'Wrap Vegano',
      description: 'Tortilla integral con hummus, vegetales asados y aguacate.',
      price: 20000, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      category: 'entradas', isNew: true, rating: 4.6, available: true,
    },
    {
      id: 'm9-5', restaurantId: '9', name: 'Combo Fit Completo',
      description: 'Buddha bowl + smoothie verde + fruta de temporada.',
      price: 38000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'combos', discount: 10, rating: 4.9, available: true,
    },
    {
      id: 'm9-6', restaurantId: '9', name: 'Parfait de Granola',
      description: 'Yogur griego, granola artesanal, frutas frescas y miel.',
      price: 16000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'postres', rating: 4.7, available: true,
    },
  ],

  // ─── CAFÉ DEL CENTRO ────────────────────────────────────────────────────────
  '13': [
    {
      id: 'm13-1', restaurantId: '13', name: 'Café Espresso Doble',
      description: 'Espresso doble de origen colombiano, tostado medio.',
      price: 6000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      category: 'bebidas', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm13-2', restaurantId: '13', name: 'Cappuccino Artesanal',
      description: 'Espresso con leche vaporizada y arte latte.',
      price: 9000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      category: 'bebidas', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm13-3', restaurantId: '13', name: 'Croissant de Mantequilla',
      description: 'Croissant francés recién horneado con mantequilla premium.',
      price: 8000, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      category: 'entradas', rating: 4.6, available: true,
    },
    {
      id: 'm13-4', restaurantId: '13', name: 'Cheesecake de Frutos Rojos',
      description: 'Cheesecake cremoso con coulis de frutos rojos frescos.',
      price: 14000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'postres', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm13-5', restaurantId: '13', name: 'Combo Desayuno Café',
      description: 'Cappuccino + croissant + jugo natural. El desayuno perfecto.',
      price: 22000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      category: 'combos', discount: 10, rating: 4.8, available: true,
    },
    {
      id: 'm13-6', restaurantId: '13', name: 'Tostada Francesa',
      description: 'Pan brioche con huevo, canela y sirope de arce.',
      price: 12000, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      category: 'recomendados', isNew: true, rating: 4.7, available: true,
    },
  ],

  // ─── SUSHI MASTER PREMIUM ───────────────────────────────────────────────────
  '17': [
    {
      id: 'm17-1', restaurantId: '17', name: 'Salmón Roll (8 piezas)',
      description: 'Roll de salmón fresco con aguacate, pepino y salsa ponzu.',
      price: 38000, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.9, available: true,
    },
    {
      id: 'm17-2', restaurantId: '17', name: 'Dragon Roll (8 piezas)',
      description: 'Roll especial con camarón tempura, aguacate y salsa eel.',
      price: 45000, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.8, available: true,
    },
    {
      id: 'm17-3', restaurantId: '17', name: 'Edamame con Sal Marina',
      description: 'Edamame al vapor con sal marina y aceite de sésamo.',
      price: 12000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'entradas', rating: 4.6, available: true,
    },
    {
      id: 'm17-4', restaurantId: '17', name: 'Sake Premium',
      description: 'Sake japonés importado, servido frío.',
      price: 18000, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      category: 'bebidas', rating: 4.7, available: true,
    },
    {
      id: 'm17-5', restaurantId: '17', name: 'Mochi de Té Verde',
      description: 'Mochi artesanal relleno de helado de té matcha.',
      price: 16000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'postres', isNew: true, rating: 4.8, available: true,
    },
    {
      id: 'm17-6', restaurantId: '17', name: 'Combo Sushi Master',
      description: '2 rolls a elección + edamame + sake o bebida.',
      price: 85000, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      category: 'combos', discount: 10, rating: 4.9, available: true,
    },
  ],
};

/**
 * Obtiene el menú de un restaurante por ID
 */
export function getMenuByRestaurant(restaurantId: string): MenuItem[] {
  return menuData[restaurantId] ?? generateDefaultMenu(restaurantId);
}

/**
 * Genera un menú genérico para restaurantes sin menú específico
 */
function generateDefaultMenu(restaurantId: string): MenuItem[] {
  return [
    {
      id: `${restaurantId}-d1`, restaurantId, name: 'Plato del Día',
      description: 'Plato especial preparado con ingredientes frescos del día.',
      price: 22000, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      category: 'principales', isPopular: true, rating: 4.5, available: true,
    },
    {
      id: `${restaurantId}-d2`, restaurantId, name: 'Sopa del Día',
      description: 'Sopa casera preparada con receta tradicional.',
      price: 14000, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      category: 'entradas', rating: 4.4, available: true,
    },
    {
      id: `${restaurantId}-d3`, restaurantId, name: 'Jugo Natural',
      description: 'Jugo de fruta natural del día.',
      price: 6000, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      category: 'bebidas', rating: 4.3, available: true,
    },
    {
      id: `${restaurantId}-d4`, restaurantId, name: 'Postre Casero',
      description: 'Postre artesanal preparado diariamente.',
      price: 10000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      category: 'postres', rating: 4.4, available: true,
    },
    {
      id: `${restaurantId}-d5`, restaurantId, name: 'Combo Almuerzo',
      description: 'Sopa + plato del día + jugo natural.',
      price: 35000, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      category: 'combos', discount: 10, rating: 4.6, available: true,
    },
  ];
}

/**
 * Obtiene items de menú por categoría
 */
export function getMenuByCategory(
  restaurantId: string,
  category: string
): MenuItem[] {
  return getMenuByRestaurant(restaurantId).filter(
    (item) => item.category === category
  );
}

/**
 * Obtiene items populares de un restaurante
 */
export function getPopularItems(restaurantId: string): MenuItem[] {
  return getMenuByRestaurant(restaurantId).filter((item) => item.isPopular);
}
