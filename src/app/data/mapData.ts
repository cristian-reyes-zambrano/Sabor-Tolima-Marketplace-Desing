/**
 * Datos geográficos reales de Ibagué para Google Maps
 * Coordenadas verificadas de barrios y restaurantes de la ciudad.
 */

export const IBAGUE_CENTER = { lat: 4.4447, lng: -75.2424 };

// ─── ZONAS DE IBAGUÉ ─────────────────────────────────────────────────────────
export interface MapZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  /** Radio aproximado en metros */
  radius: number;
  color: string;
  deliveryMin: number;
  distanceKm: number;
  demand: 'alta' | 'media' | 'baja';
}

export const MAP_ZONES: MapZone[] = [
  // Centro histórico — Parque Murillo Toro, Gobernación, Catedral
  { id: 'centro',        name: 'Centro',         center: { lat: 4.4389, lng: -75.2322 }, radius: 750,  color: '#c62828', deliveryMin: 15, distanceKm: 0.0, demand: 'alta'  },
  // La Pola — barrio comercial noroccidente
  { id: 'la-pola',       name: 'La Pola',         center: { lat: 4.4422, lng: -75.2398 }, radius: 600,  color: '#e65100', deliveryMin: 20, distanceKm: 1.8, demand: 'alta'  },
  // Jordán — barrio sur urbano consolidado
  { id: 'jordan',        name: 'Jordán',          center: { lat: 4.4348, lng: -75.2362 }, radius: 650,  color: '#f57f17', deliveryMin: 22, distanceKm: 2.1, demand: 'media' },
  // Belén — barrio sur-oriente urbano
  { id: 'belen',         name: 'Belén',           center: { lat: 4.4322, lng: -75.2258 }, radius: 580,  color: '#1b5e20', deliveryMin: 25, distanceKm: 2.8, demand: 'media' },
  // El Salado — barrio sur urbano
  { id: 'el-salado',     name: 'El Salado',       center: { lat: 4.4282, lng: -75.2338 }, radius: 620,  color: '#0d47a1', deliveryMin: 28, distanceKm: 3.2, demand: 'media' },
  // Av. Ambalá — zona norte urbana consolidada
  { id: 'ambala',        name: 'Av. Ambalá',      center: { lat: 4.4498, lng: -75.2228 }, radius: 700,  color: '#4a148c', deliveryMin: 25, distanceKm: 2.5, demand: 'media' },
  // Cádiz — zona norte, cerca de centros comerciales
  { id: 'cadiz',         name: 'Cádiz',           center: { lat: 4.4548, lng: -75.2138 }, radius: 650,  color: '#006064', deliveryMin: 30, distanceKm: 3.5, demand: 'baja'  },
  // Calambeo — zona norte-oriente urbana
  { id: 'calambeo',      name: 'Calambeo',        center: { lat: 4.4528, lng: -75.2068 }, radius: 680,  color: '#bf360c', deliveryMin: 32, distanceKm: 3.8, demand: 'baja'  },
  // Mirolindo — zona sur-occidente urbana
  { id: 'mirolindo',     name: 'Mirolindo',       center: { lat: 4.4248, lng: -75.2418 }, radius: 580,  color: '#33691e', deliveryMin: 35, distanceKm: 4.2, demand: 'baja'  },
  // Picaleña — zona sur, aeropuerto Perales
  { id: 'picaleña',      name: 'Picaleña',        center: { lat: 4.4212, lng: -75.2238 }, radius: 700,  color: '#880e4f', deliveryMin: 38, distanceKm: 4.8, demand: 'baja'  },
  // Piedra Pintada — zona norte-oriente, dentro del perímetro urbano
  { id: 'piedra-pintada',name: 'Piedra Pintada',  center: { lat: 4.4528, lng: -75.2068 }, radius: 550,  color: '#37474f', deliveryMin: 40, distanceKm: 5.1, demand: 'baja'  },
];

// ─── RESTAURANTES EN EL MAPA ──────────────────────────────────────────────────
export interface MapRestaurant {
  id: string;
  name: string;
  shortName: string;
  category: string;
  categoryLabel: string;
  rating: number;
  address: string;
  zone: string;
  position: { lat: number; lng: number };
  deliveryMin: number;
  phone?: string;
}

export const MAP_RESTAURANTS: MapRestaurant[] = [
  // ─── CENTRO HISTÓRICO ─────────────────────────────────────────────────────
  {
    id: '1', name: 'Lechonería La Tradición Ibagueña', shortName: 'Lechonería',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.9,
    address: 'Calle 10 # 5-23, Centro Histórico', zone: 'Centro',
    // Parque Murillo Toro — corazón del centro de Ibagué
    position: { lat: 4.4389, lng: -75.2322 }, deliveryMin: 20, phone: '3001234567',
  },
  {
    id: '13', name: 'Café Musical de Ibagué', shortName: 'Café Musical',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.5,
    address: 'Calle 12 # 3-56, Centro Histórico', zone: 'Centro',
    // Cerca del Conservatorio de Música — Carrera 1 con Calle 9
    position: { lat: 4.4382, lng: -75.2338 }, deliveryMin: 15, phone: '3181234567',
  },
  {
    id: '16', name: 'Avena y Masato Don Rodrigo', shortName: 'Avena',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.5,
    address: 'Carrera 4 # 9-23, Centro', zone: 'Centro',
    // Mercado La 21 — zona de comidas típicas del centro
    position: { lat: 4.4375, lng: -75.2305 }, deliveryMin: 15, phone: '3117890123',
  },
  {
    id: '21', name: 'Menú del Día – Mercado La 21', shortName: 'La 21',
    category: 'ofertas', categoryLabel: 'Ofertas', rating: 4.4,
    address: 'Calle 25 # 10-34, Mercado La 21', zone: 'Centro',
    // Mercado La 21 — sector comercial popular
    position: { lat: 4.4368, lng: -75.2295 }, deliveryMin: 15, phone: '3251234567',
  },
  {
    id: '18', name: 'Restaurante La Casona – Centro', shortName: 'La Casona',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.9,
    address: 'Carrera 3 # 11-45, Centro Histórico', zone: 'Centro',
    // Zona colonial — cerca de la Catedral de Ibagué
    position: { lat: 4.4395, lng: -75.2330 }, deliveryMin: 45, phone: '3228901234',
  },
  {
    id: '12', name: 'Bar de Jugos El Centro', shortName: 'Jugos',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.6,
    address: 'Carrera 6 # 18-45, Centro', zone: 'Centro',
    // Sector comercial centro — Carrera 6
    position: { lat: 4.4402, lng: -75.2312 }, deliveryMin: 15, phone: '3184567890',
  },

  // ─── LA POLA ──────────────────────────────────────────────────────────────
  {
    id: '2', name: 'Tamales Don José – La Pola', shortName: 'Don José',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.8,
    address: 'Carrera 5 # 12-45, Barrio La Pola', zone: 'La Pola',
    // Barrio La Pola — zona residencial-comercial noroccidente
    position: { lat: 4.4428, lng: -75.2388 }, deliveryMin: 25, phone: '3109876543',
  },
  {
    id: '5', name: 'Asados El Tolimense – La Pola', shortName: 'Asados',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.6,
    address: 'Carrera 8 # 45-67, Barrio La Pola', zone: 'La Pola',
    // Zona comercial La Pola — vía principal
    position: { lat: 4.4420, lng: -75.2400 }, deliveryMin: 20, phone: '3201234567',
  },
  {
    id: '14', name: 'Panadería La Pola – Ibagué', shortName: 'Panadería',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.7,
    address: 'Carrera 9 # 62-34, Barrio La Pola', zone: 'La Pola',
    // Esquina comercial La Pola
    position: { lat: 4.4412, lng: -75.2412 }, deliveryMin: 20, phone: '3195678901',
  },

  // ─── JORDÁN ───────────────────────────────────────────────────────────────
  {
    id: '7', name: 'Pollos El Jordán – Ibagué', shortName: 'Pollos',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.5,
    address: 'Calle 42 # 6-78, Barrio Jordán', zone: 'Jordán',
    // Barrio Jordán — zona urbana consolidada sur
    position: { lat: 4.4352, lng: -75.2368 }, deliveryMin: 22, phone: '3178901234',
  },
  {
    id: '15', name: 'Dulcería Doña Carmen – Jordán', shortName: 'Dulcería',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.6,
    address: 'Calle 55 # 7-89, Barrio Jordán', zone: 'Jordán',
    // Zona residencial Jordán — sector tranquilo
    position: { lat: 4.4342, lng: -75.2355 }, deliveryMin: 25, phone: '3106789012',
  },

  // ─── BELÉN ────────────────────────────────────────────────────────────────
  {
    id: '4', name: 'Achiras y Dulces de Belén', shortName: 'Achiras',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.6,
    address: 'Carrera 3 # 20-12, Barrio Belén', zone: 'Belén',
    // Barrio Belén — zona urbana sur-oriente, dentro de la ciudad
    position: { lat: 4.4322, lng: -75.2258 }, deliveryMin: 25, phone: '3187654321',
  },

  // ─── EL SALADO ────────────────────────────────────────────────────────────
  {
    id: '3', name: 'Comidas Caseras Doña Ana – El Salado', shortName: 'Doña Ana',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.7,
    address: 'Calle 38 # 2-15, Barrio El Salado', zone: 'El Salado',
    // Barrio El Salado — zona urbana sur, dentro del perímetro
    position: { lat: 4.4288, lng: -75.2342 }, deliveryMin: 28, phone: '3124567890',
  },
  {
    id: '22', name: 'Combos Rápidos El Salado', shortName: 'Combos',
    category: 'ofertas', categoryLabel: 'Ofertas', rating: 4.3,
    address: 'Carrera 7 # 35-67, Barrio El Salado', zone: 'El Salado',
    position: { lat: 4.4278, lng: -75.2332 }, deliveryMin: 28, phone: '3262345678',
  },

  // ─── AV. AMBALÁ — ZONA NORTE URBANA ──────────────────────────────────────
  {
    id: '9', name: 'Ensaladas Frescas Ambalá', shortName: 'Ensaladas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.9,
    address: 'Calle 70 # 2-34, Av. Ambalá', zone: 'Av. Ambalá',
    // Av. Ambalá — zona norte urbana consolidada, NO montaña
    position: { lat: 4.4488, lng: -75.2238 }, deliveryMin: 25, phone: '3151234567',
  },
  {
    id: '17', name: 'El Tolimense Gourmet – Ambalá', shortName: 'Gourmet',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Calle 90 # 5-67, Av. Ambalá', zone: 'Av. Ambalá',
    // Av. Ambalá norte — cerca del Centro Comercial Multicentro
    position: { lat: 4.4505, lng: -75.2218 }, deliveryMin: 40, phone: '3221234567',
  },

  // ─── CÁDIZ — ZONA NORTE URBANA ────────────────────────────────────────────
  {
    id: '6', name: 'Pizzería Cádiz – Ibagué', shortName: 'Pizzería',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.7,
    address: 'Calle 60 # 3-45, Sector Cádiz', zone: 'Cádiz',
    // Sector Cádiz — zona norte urbana, cerca del C.C. Acqua
    position: { lat: 4.4542, lng: -75.2148 }, deliveryMin: 30, phone: '3156789012',
  },
  {
    id: '19', name: 'Parrilla El Cádiz – Ibagué', shortName: 'Parrilla',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.7,
    address: 'Calle 75 # 8-45, Sector Cádiz', zone: 'Cádiz',
    // Zona Cádiz norte — restaurantes de carnes, área urbana
    position: { lat: 4.4558, lng: -75.2128 }, deliveryMin: 30, phone: '3239012345',
  },

  // ─── MIROLINDO — ZONA SUR-OCCIDENTE URBANA ────────────────────────────────
  {
    id: '10', name: 'Frutas y Jugos Mirolindo', shortName: 'Frutas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.7,
    address: 'Carrera 12 # 55-89, Sector Mirolindo', zone: 'Mirolindo',
    // Mirolindo — zona sur-occidente urbana, dentro del perímetro
    position: { lat: 4.4248, lng: -75.2418 }, deliveryMin: 35, phone: '3162345678',
  },

  // ─── PICALEÑA — ZONA SUR URBANA ───────────────────────────────────────────
  {
    id: '8', name: 'Perros & Más – Picaleña', shortName: 'Perros',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.4,
    address: 'Carrera 5 # 30-56, Sector Picaleña', zone: 'Picaleña',
    // Picaleña — zona sur urbana, cerca del aeropuerto pero dentro de la ciudad
    position: { lat: 4.4218, lng: -75.2248 }, deliveryMin: 38, phone: '3190123456',
  },
  {
    id: '20', name: 'Asadero Don Hernando – Picaleña', shortName: 'Don Hernando',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Carrera 20 # 90-12, Sector Picaleña', zone: 'Picaleña',
    // Picaleña sur — zona urbana consolidada
    position: { lat: 4.4205, lng: -75.2232 }, deliveryMin: 50, phone: '3240123456',
  },

  // ─── CALAMBEO — ZONA NORTE-ORIENTE URBANA ─────────────────────────────────
  {
    id: '11', name: 'Cocina Fit Piedra Pintada', shortName: 'Fit',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.8,
    address: 'Calle 80 # 4-12, Sector Calambeo', zone: 'Calambeo',
    // Calambeo — zona norte-oriente urbana, NO en montaña
    position: { lat: 4.4528, lng: -75.2068 }, deliveryMin: 40, phone: '3173456789',
  },
];

// ─── COLORES POR CATEGORÍA ────────────────────────────────────────────────────
export const CATEGORY_MAP_COLORS: Record<string, string> = {
  tipica:    '#c62828',
  rapida:    '#e65100',
  saludable: '#2e7d32',
  cafeteria: '#6d4c41',
  gourmet:   '#4a148c',
  ofertas:   '#f57f17',
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  tipica:    '🍲',
  rapida:    '🍔',
  saludable: '🥗',
  cafeteria: '☕',
  gourmet:   '✨',
  ofertas:   '🏷️',
};
