/**
 * Imágenes locales de platos — Sabor Tolima Marketplace
 *
 * CÓMO AGREGAR FOTO DE UN PLATO:
 *   1. Pon tu JPG en la carpeta del restaurante:
 *        src/assets/images/menu/restaurante-1/lechona.jpg
 *   2. Importa aquí (descomenta la línea):
 *        import lechonaImg from './restaurante-1/lechona.jpg';
 *   3. Agrega al mapa MENU_IMAGES con el ID del plato:
 *        'm1-1': lechonaImg,
 *
 * ESTRUCTURA:
 *   restaurante-1/   → Lechonería La Tradición Ibagueña
 *   restaurante-2/   → Tamales Don José – La Pola
 *   restaurante-5/   → Asados El Tolimense – La Pola
 *   restaurante-9/   → Ensaladas Frescas Ambalá
 *   restaurante-13/  → Café Musical de Ibagué
 *   restaurante-17/  → El Tolimense Gourmet – Ambalá
 *   restaurante-general/ → Fotos genéricas de respaldo
 *
 * FORMATOS: .jpg .jpeg .png .webp · Tamaño recomendado: 400×300px · Máx 500KB
 */

// ── Descomenta e importa tus fotos locales aquí ──────────────────────────────

// Restaurante 1 — Lechonería La Tradición Ibagueña
// import lechonaCompleta from './restaurante-1/lechona-completa.jpg';
// import mediaLechona    from './restaurante-1/media-lechona.jpg';
// import tamalR1         from './restaurante-1/tamal.jpg';
// import avenaR1         from './restaurante-1/avena.jpg';
// import achirasR1       from './restaurante-1/achiras.jpg';
// import comboLechona    from './restaurante-1/combo-familiar.jpg';
// import sancochoCostilla from './restaurante-1/sancocho.jpg';

// Restaurante 2 — Tamales Don José – La Pola
// import tamalClasico    from './restaurante-2/tamal-clasico.jpg';
// import tamalPipian     from './restaurante-2/tamal-pipian.jpg';
// import arepaCon Queso  from './restaurante-2/arepa-queso.jpg';
// import avenaFria       from './restaurante-2/avena-fria.jpg';

// Restaurante 5 — Asados El Tolimense – La Pola
// import chorizoParrilla from './restaurante-5/chorizo.jpg';
// import costillasBBQ    from './restaurante-5/costillas.jpg';
// import morcillaLonganiza from './restaurante-5/morcilla.jpg';

// Restaurante 9 — Ensaladas Frescas Ambalá
// import bowlProteico    from './restaurante-9/bowl-proteico.jpg';
// import ensaladaFrutas  from './restaurante-9/ensalada-frutas.jpg';
// import jugoVerde       from './restaurante-9/jugo-verde.jpg';

// Restaurante 13 — Café Musical de Ibagué
// import cafeEspresso    from './restaurante-13/espresso.jpg';
// import cafeLecheCafe   from './restaurante-13/cafe-leche.jpg';
// import almojabana      from './restaurante-13/almojabana.jpg';
// import tortaNovia      from './restaurante-13/torta-novia.jpg';

// Restaurante 17 — El Tolimense Gourmet – Ambalá
// import lechonaGourmet  from './restaurante-17/lechona-gourmet.jpg';
// import tamalGourmet    from './restaurante-17/tamal-gourmet.jpg';
// import cevicheCachama  from './restaurante-17/ceviche.jpg';

// ── Mapa de imágenes por ID de plato ─────────────────────────────────────────
export const MENU_IMAGES: Record<string, string> = {
  // Descomenta cuando tengas la foto local:

  // 'm1-1': lechonaCompleta,
  // 'm1-2': mediaLechona,
  // 'm1-3': tamalR1,
  // 'm1-4': avenaR1,
  // 'm1-5': achirasR1,
  // 'm1-6': comboLechona,
  // 'm1-7': sancochoCostilla,

  // 'm2-1': tamalClasico,
  // 'm2-2': tamalPipian,
  // 'm2-4': avenaFria,

  // 'm5-1': chorizoParrilla,
  // 'm5-2': costillasBBQ,
  // 'm5-3': morcillaLonganiza,

  // 'm9-1': bowlProteico,
  // 'm9-2': ensaladaFrutas,
  // 'm9-3': jugoVerde,

  // 'm13-1': cafeEspresso,
  // 'm13-2': cafeLecheCafe,
  // 'm13-3': almojabana,
  // 'm13-4': tortaNovia,

  // 'm17-1': lechonaGourmet,
  // 'm17-2': tamalGourmet,
  // 'm17-3': cevicheCachama,
};

const PLACEHOLDER = '/images/products/product-placeholder.svg';

/**
 * Retorna la imagen de un plato.
 * Prioridad: foto local → fallbackUrl (Unsplash) → placeholder SVG
 */
export function getMenuImage(itemId: string, fallbackUrl?: string): string {
  return MENU_IMAGES[itemId] ?? fallbackUrl ?? PLACEHOLDER;
}
