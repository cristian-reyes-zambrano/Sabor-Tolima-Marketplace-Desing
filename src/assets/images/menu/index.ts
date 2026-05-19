/**
 * Imágenes de platos — Sabor Tolima Marketplace
 *
 * CÓMO AGREGAR FOTO DE UN PLATO:
 *   1. Pon tu JPG en: public/images/restaurants/rest-N/nombre-plato.jpg
 *      Ejemplo: public/images/restaurants/rest-2/tamal-clasico.jpg
 *
 *   2. Descomenta la línea correspondiente en MENU_IMAGES:
 *      'm2-1': '/images/restaurants/rest-2/tamal-clasico.jpg',
 *
 * FORMATOS: .jpg .jpeg .png .webp · Tamaño: 400×300px · Máx 300KB
 */

export const MENU_IMAGES: Record<string, string> = {
  // ── Restaurante 1 — Lechonería La Tradición ──────────────────────────────
  // 'm1-1': '/images/restaurants/rest-1/lechona-completa.jpg',
  // 'm1-2': '/images/restaurants/rest-1/media-lechona.jpg',
  // 'm1-3': '/images/restaurants/rest-1/tamal.jpg',
  // 'm1-4': '/images/restaurants/rest-1/avena.jpg',
  // 'm1-5': '/images/restaurants/rest-1/achiras.jpg',
  // 'm1-6': '/images/restaurants/rest-1/combo-familiar.jpg',
  // 'm1-7': '/images/restaurants/rest-1/sancocho.jpg',

  // ── Restaurante 2 — Tamales Don José ─────────────────────────────────────
  'm2-1': '/images/restaurants/rest-2/tamal-clasico.jpg',
  'm2-2': '/images/restaurants/rest-2/tamal-pipian.jpg',
  'm2-3': '/images/restaurants/rest-2/arepa-queso.jpg',
  'm2-4': '/images/restaurants/rest-2/avena-fria.jpg',
  'm2-5': '/images/restaurants/rest-2/combo-desayuno.jpg',
  'm2-6': '/images/restaurants/rest-2/docena-tamales.jpg',

  // ── Restaurante 3 — Comidas Caseras Doña Ana ──────────────────────────────
  'm3-1': '/images/restaurants/rest-3/sancocho-gallina.jpg',
  'm3-2': '/images/restaurants/rest-3/mondongo.jpg',
  'm3-3': '/images/restaurants/rest-3/almuerzo-casero.jpg',
  'm3-4': '/images/restaurants/rest-3/jugo-cholupa.jpg',
  'm3-5': '/images/restaurants/rest-3/natilla.jpg',

  // ── Restaurante 5 — Asados El Tolimense ──────────────────────────────────
  // 'm5-1': '/images/restaurants/rest-5/chorizo-parrilla.jpg',
  // 'm5-2': '/images/restaurants/rest-5/costillas-bbq.jpg',
  // 'm5-3': '/images/restaurants/rest-5/morcilla-longaniza.jpg',
  // 'm5-4': '/images/restaurants/rest-5/papa-criolla.jpg',
  // 'm5-5': '/images/restaurants/rest-5/limonada-panela.jpg',
  // 'm5-6': '/images/restaurants/rest-5/parrillada-familiar.jpg',
  // 'm5-7': '/images/restaurants/rest-5/postre-guanabana.jpg',

  // ── Restaurante 9 — Ensaladas Frescas Ambalá ─────────────────────────────
  // 'm9-1': '/images/restaurants/rest-9/bowl-proteico.jpg',
  // 'm9-2': '/images/restaurants/rest-9/ensalada-frutas.jpg',
  // 'm9-3': '/images/restaurants/rest-9/jugo-verde.jpg',
  // 'm9-4': '/images/restaurants/rest-9/wrap-vegano.jpg',
  // 'm9-5': '/images/restaurants/rest-9/combo-fit.jpg',
  // 'm9-6': '/images/restaurants/rest-9/granola.jpg',

  // ── Restaurante 13 — Café Musical de Ibagué ──────────────────────────────
  // 'm13-1': '/images/restaurants/rest-13/cafe-espresso.jpg',
  // 'm13-2': '/images/restaurants/rest-13/cafe-leche.jpg',
  // 'm13-3': '/images/restaurants/rest-13/almojabana.jpg',
  // 'm13-4': '/images/restaurants/rest-13/torta-novia.jpg',
  // 'm13-5': '/images/restaurants/rest-13/combo-desayuno.jpg',
  // 'm13-6': '/images/restaurants/rest-13/pandeyuca.jpg',

  // ── Restaurante 17 — El Tolimense Gourmet ────────────────────────────────
  // 'm17-1': '/images/restaurants/rest-17/lechona-gourmet.jpg',
  // 'm17-2': '/images/restaurants/rest-17/tamal-gourmet.jpg',
  // 'm17-3': '/images/restaurants/rest-17/ceviche-cachama.jpg',
  // 'm17-4': '/images/restaurants/rest-17/coctel-cholupa.jpg',
  // 'm17-5': '/images/restaurants/rest-17/postre-guanabana.jpg',
  // 'm17-6': '/images/restaurants/rest-17/menu-degustacion.jpg',
};

const PLACEHOLDER = '/images/products/product-placeholder.svg';

/**
 * Retorna la imagen de un plato.
 * Prioridad: foto local → fallbackUrl (Unsplash) → placeholder SVG
 */
export function getMenuImage(itemId: string, fallbackUrl?: string): string {
  return MENU_IMAGES[itemId] ?? fallbackUrl ?? PLACEHOLDER;
}
