/**
 * Imágenes locales del menú - Sabor Tolima Marketplace
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CÓMO AGREGAR TUS PROPIAS FOTOS:
 *
 * 1. Pon tu imagen JPG/PNG/WEBP en la carpeta correspondiente:
 *    src/assets/images/menu/restaurante-1/lechona.jpg
 *    src/assets/images/menu/restaurante-1/tamal.jpg
 *    src/assets/images/menu/restaurante-general/placeholder.jpg
 *
 * 2. Importa la imagen aquí abajo (descomenta o agrega la línea):
 *    import lechonaImg from './restaurante-1/lechona.jpg';
 *
 * 3. Agrégala al objeto MENU_IMAGES con el ID del plato:
 *    'm1-1': lechonaImg,
 *
 * 4. En src/app/data/menu.ts el campo `image` del plato se reemplaza
 *    automáticamente con tu foto local.
 *
 * ─── ESTRUCTURA DE CARPETAS ──────────────────────────────────────────────────
 *
 *  src/assets/images/menu/
 *  ├── restaurante-1/     ← Lechona Tradicional Tolima
 *  │   ├── lechona.jpg
 *  │   ├── tamal.jpg
 *  │   └── avena.jpg
 *  ├── restaurante-2/     ← Tamalería San Alejo
 *  ├── restaurante-5/     ← Burgers & Wings
 *  ├── restaurante-9/     ← Green Bowl Salads
 *  ├── restaurante-13/    ← Café del Centro
 *  ├── restaurante-17/    ← Sushi Master Premium
 *  └── restaurante-general/  ← Imágenes genéricas de respaldo
 *
 * ─── FORMATOS SOPORTADOS ─────────────────────────────────────────────────────
 *  .jpg  .jpeg  .png  .webp  .avif
 *  Tamaño recomendado: 400×300px mínimo, menos de 500KB por imagen
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Importa aquí tus imágenes locales ────────────────────────────────────────
// Descomenta y ajusta la ruta cuando agregues una foto:

// import lechonaCompleta   from './restaurante-1/lechona-completa.jpg';
// import mediaLechona      from './restaurante-1/media-lechona.jpg';
// import tamalTolimense    from './restaurante-1/tamal.jpg';
// import avenaTolimense    from './restaurante-1/avena.jpg';
// import achiras           from './restaurante-1/achiras.jpg';
// import comboLechona      from './restaurante-1/combo-familiar.jpg';
// import sancocho          from './restaurante-1/sancocho.jpg';

// import tamalSanAlejo     from './restaurante-2/tamal-clasico.jpg';
// import tamalPipian       from './restaurante-2/tamal-pipian.jpg';
// import arepaCon Queso    from './restaurante-2/arepa-queso.jpg';

// import burgerClasica     from './restaurante-5/burger-clasica.jpg';
// import burgerBBQ         from './restaurante-5/burger-bbq.jpg';
// import wingsBuffalo      from './restaurante-5/wings-buffalo.jpg';

// import buddahBowl        from './restaurante-9/buddha-bowl.jpg';
// import ensaladaCesar     from './restaurante-9/ensalada-cesar.jpg';

// import cafeEspresso      from './restaurante-13/espresso.jpg';
// import cappuccino        from './restaurante-13/cappuccino.jpg';
// import cheesecake        from './restaurante-13/cheesecake.jpg';

// import salmonRoll        from './restaurante-17/salmon-roll.jpg';
// import dragonRoll        from './restaurante-17/dragon-roll.jpg';

// ── Mapa de imágenes por ID de plato ─────────────────────────────────────────
// La clave es el `id` del plato en src/app/data/menu.ts
// El valor es la imagen importada arriba

export const MENU_IMAGES: Record<string, string> = {
  // Restaurante 1 — Lechona Tradicional Tolima
  // 'm1-1': lechonaCompleta,
  // 'm1-2': mediaLechona,
  // 'm1-3': tamalTolimense,
  // 'm1-4': avenaTolimense,
  // 'm1-5': achiras,
  // 'm1-6': comboLechona,
  // 'm1-7': sancocho,

  // Restaurante 2 — Tamalería San Alejo
  // 'm2-1': tamalSanAlejo,
  // 'm2-2': tamalPipian,

  // Restaurante 5 — Burgers & Wings
  // 'm5-1': burgerClasica,
  // 'm5-2': burgerBBQ,
  // 'm5-3': wingsBuffalo,

  // Restaurante 9 — Green Bowl Salads
  // 'm9-1': buddahBowl,
  // 'm9-2': ensaladaCesar,

  // Restaurante 13 — Café del Centro
  // 'm13-1': cafeEspresso,
  // 'm13-2': cappuccino,
  // 'm13-4': cheesecake,

  // Restaurante 17 — Sushi Master Premium
  // 'm17-1': salmonRoll,
  // 'm17-2': dragonRoll,
};

/** Placeholder local para platos sin imagen */
const LOCAL_FOOD_PLACEHOLDER = '/images/products/product-placeholder.svg';

/**
 * Obtiene la imagen de un plato.
 * Prioridad: imagen local → fallbackUrl externo → placeholder local
 */
export function getMenuImage(itemId: string, fallbackUrl?: string): string {
  return MENU_IMAGES[itemId] ?? fallbackUrl ?? LOCAL_FOOD_PLACEHOLDER;
}
