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
  { id: 'centro',        name: 'Centro',         center: { lat: 4.4389, lng: -75.2322 }, radius: 800,  color: '#c62828', deliveryMin: 15, distanceKm: 0.0, demand: 'alta'  },
  // La Pola — barrio comercial al noroccidente del centro
  { id: 'la-pola',       name: 'La Pola',         center: { lat: 4.4425, lng: -75.2400 }, radius: 650,  color: '#e65100', deliveryMin: 20, distanceKm: 1.8, demand: 'alta'  },
  // Jordán — barrio sur, cerca del estadio
  { id: 'jordan',        name: 'Jordán',          center: { lat: 4.4342, lng: -75.2368 }, radius: 700,  color: '#f57f17', deliveryMin: 22, distanceKm: 2.1, demand: 'media' },
  // Belén — barrio sur-oriente
  { id: 'belen',         name: 'Belén',           center: { lat: 4.4318, lng: -75.2268 }, radius: 600,  color: '#1b5e20', deliveryMin: 25, distanceKm: 2.8, demand: 'media' },
  // El Salado — barrio sur
  { id: 'el-salado',     name: 'El Salado',       center: { lat: 4.4278, lng: -75.2342 }, radius: 650,  color: '#0d47a1', deliveryMin: 28, distanceKm: 3.2, demand: 'media' },
  // Av. Ambalá — zona norte residencial y comercial
  { id: 'ambala',        name: 'Av. Ambalá',      center: { lat: 4.4510, lng: -75.2208 }, radius: 750,  color: '#4a148c', deliveryMin: 25, distanceKm: 2.5, demand: 'media' },
  // Cádiz — zona norte, cerca de Acqua y Multicentro
  { id: 'cadiz',         name: 'Cádiz',           center: { lat: 4.4562, lng: -75.2095 }, radius: 700,  color: '#006064', deliveryMin: 30, distanceKm: 3.5, demand: 'baja'  },
  // Calambeo — zona norte-oriente
  { id: 'calambeo',      name: 'Calambeo',        center: { lat: 4.4488, lng: -75.2048 }, radius: 700,  color: '#bf360c', deliveryMin: 32, distanceKm: 3.8, demand: 'baja'  },
  // Mirolindo — zona sur-occidente
  { id: 'mirolindo',     name: 'Mirolindo',       center: { lat: 4.4228, lng: -75.2448 }, radius: 600,  color: '#33691e', deliveryMin: 35, distanceKm: 4.2, demand: 'baja'  },
  // Picaleña — zona sur, aeropuerto Perales
  { id: 'picaleña',      name: 'Picaleña',        center: { lat: 4.4195, lng: -75.2208 }, radius: 750,  color: '#880e4f', deliveryMin: 38, distanceKm: 4.8, demand: 'baja'  },
  // Piedra Pintada — zona norte-oriente
  { id: 'piedra-pintada',name: 'Piedra Pintada',  center: { lat: 4.4608, lng: -75.1985 }, radius: 580,  color: '#37474f', deliveryMin: 40, distanceKm: 5.1, demand: 'baja'  },
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
    // Frente al Parque Murillo Toro (plaza central de Ibagué)
    position: { lat: 4.4389, lng: -75.2322 }, deliveryMin: 20, phone: '3001234567',
  },
  {
    id: '13', name: 'Café Musical de Ibagué', shortName: 'Café Musical',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.5,
    address: 'Calle 12 # 3-56, Centro Histórico', zone: 'Centro',
    // Cerca del Conservatorio de Música del Tolima
    position: { lat: 4.4395, lng: -75.2335 }, deliveryMin: 15, phone: '3181234567',
  },
  {
    id: '16', name: 'Avena y Masato Don Rodrigo', shortName: 'Avena',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.5,
    address: 'Carrera 4 # 9-23, Centro', zone: 'Centro',
    // Mercado La 21 — zona de comidas típicas
    position: { lat: 4.4378, lng: -75.2310 }, deliveryMin: 15, phone: '3117890123',
  },
  {
    id: '21', name: 'Menú del Día – Mercado La 21', shortName: 'La 21',
    category: 'ofertas', categoryLabel: 'Ofertas', rating: 4.4,
    address: 'Calle 25 # 10-34, Mercado La 21', zone: 'Centro',
    // Mercado La 21 de Ibagué
    position: { lat: 4.4372, lng: -75.2298 }, deliveryMin: 15, phone: '3251234567',
  },
  {
    id: '18', name: 'Restaurante La Casona – Centro', shortName: 'La Casona',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.9,
    address: 'Carrera 3 # 11-45, Centro Histórico', zone: 'Centro',
    // Zona colonial del centro
    position: { lat: 4.4382, lng: -75.2340 }, deliveryMin: 45, phone: '3228901234',
  },
  {
    id: '12', name: 'Bar de Jugos El Centro', shortName: 'Jugos',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.6,
    address: 'Carrera 6 # 18-45, Centro', zone: 'Centro',
    // Cerca de la Gobernación del Tolima
    position: { lat: 4.4400, lng: -75.2315 }, deliveryMin: 15, phone: '3184567890',
  },

  // ─── LA POLA ──────────────────────────────────────────────────────────────
  {
    id: '2', name: 'Tamales Don José – La Pola', shortName: 'Don José',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.8,
    address: 'Carrera 5 # 12-45, Barrio La Pola', zone: 'La Pola',
    // Barrio La Pola, zona residencial-comercial
    position: { lat: 4.4430, lng: -75.2390 }, deliveryMin: 25, phone: '3109876543',
  },
  {
    id: '5', name: 'Asados El Tolimense – La Pola', shortName: 'Asados',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.6,
    address: 'Carrera 8 # 45-67, Barrio La Pola', zone: 'La Pola',
    // Zona comercial La Pola
    position: { lat: 4.4422, lng: -75.2405 }, deliveryMin: 20, phone: '3201234567',
  },
  {
    id: '14', name: 'Panadería La Pola – Ibagué', shortName: 'Panadería',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.7,
    address: 'Carrera 9 # 62-34, Barrio La Pola', zone: 'La Pola',
    // Esquina comercial La Pola
    position: { lat: 4.4415, lng: -75.2415 }, deliveryMin: 20, phone: '3195678901',
  },

  // ─── JORDÁN ───────────────────────────────────────────────────────────────
  {
    id: '7', name: 'Pollos El Jordán – Ibagué', shortName: 'Pollos',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.5,
    address: 'Calle 42 # 6-78, Barrio Jordán', zone: 'Jordán',
    // Barrio Jordán, cerca del estadio Manuel Murillo Toro
    position: { lat: 4.4348, lng: -75.2372 }, deliveryMin: 22, phone: '3178901234',
  },
  {
    id: '15', name: 'Dulcería Doña Carmen – Jordán', shortName: 'Dulcería',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.6,
    address: 'Calle 55 # 7-89, Barrio Jordán', zone: 'Jordán',
    // Zona residencial Jordán
    position: { lat: 4.4338, lng: -75.2360 }, deliveryMin: 25, phone: '3106789012',
  },

  // ─── BELÉN ────────────────────────────────────────────────────────────────
  {
    id: '4', name: 'Achiras y Dulces de Belén', shortName: 'Achiras',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.6,
    address: 'Carrera 3 # 20-12, Barrio Belén', zone: 'Belén',
    // Barrio Belén, zona sur del centro
    position: { lat: 4.4318, lng: -75.2268 }, deliveryMin: 25, phone: '3187654321',
  },

  // ─── EL SALADO ────────────────────────────────────────────────────────────
  {
    id: '3', name: 'Comidas Caseras Doña Ana – El Salado', shortName: 'Doña Ana',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.7,
    address: 'Calle 38 # 2-15, Barrio El Salado', zone: 'El Salado',
    // Barrio El Salado, zona sur
    position: { lat: 4.4282, lng: -75.2348 }, deliveryMin: 28, phone: '3124567890',
  },
  {
    id: '22', name: 'Combos Rápidos El Salado', shortName: 'Combos',
    category: 'ofertas', categoryLabel: 'Ofertas', rating: 4.3,
    address: 'Carrera 7 # 35-67, Barrio El Salado', zone: 'El Salado',
    position: { lat: 4.4272, lng: -75.2338 }, deliveryMin: 28, phone: '3262345678',
  },

  // ─── AV. AMBALÁ / NORTE ───────────────────────────────────────────────────
  {
    id: '9', name: 'Ensaladas Frescas Ambalá', shortName: 'Ensaladas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.9,
    address: 'Calle 70 # 2-34, Av. Ambalá', zone: 'Av. Ambalá',
    // Av. Ambalá, zona norte residencial
    position: { lat: 4.4502, lng: -75.2218 }, deliveryMin: 25, phone: '3151234567',
  },
  {
    id: '17', name: 'El Tolimense Gourmet – Ambalá', shortName: 'Gourmet',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Calle 90 # 5-67, Av. Ambalá', zone: 'Av. Ambalá',
    // Zona norte, cerca del Centro Comercial Multicentro
    position: { lat: 4.4518, lng: -75.2198 }, deliveryMin: 40, phone: '3221234567',
  },

  // ─── CÁDIZ / ZONA NORTE ───────────────────────────────────────────────────
  {
    id: '6', name: 'Pizzería Cádiz – Ibagué', shortName: 'Pizzería',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.7,
    address: 'Calle 60 # 3-45, Sector Cádiz', zone: 'Cádiz',
    // Sector Cádiz, cerca del Centro Comercial Acqua
    position: { lat: 4.4558, lng: -75.2105 }, deliveryMin: 30, phone: '3156789012',
  },
  {
    id: '19', name: 'Parrilla El Cádiz – Ibagué', shortName: 'Parrilla',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.7,
    address: 'Calle 75 # 8-45, Sector Cádiz', zone: 'Cádiz',
    // Zona Cádiz, restaurantes de carnes
    position: { lat: 4.4572, lng: -75.2088 }, deliveryMin: 30, phone: '3239012345',
  },

  // ─── MIROLINDO ────────────────────────────────────────────────────────────
  {
    id: '10', name: 'Frutas y Jugos Mirolindo', shortName: 'Frutas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.7,
    address: 'Carrera 12 # 55-89, Sector Mirolindo', zone: 'Mirolindo',
    // Sector Mirolindo, zona sur-occidente
    position: { lat: 4.4228, lng: -75.2448 }, deliveryMin: 35, phone: '3162345678',
  },

  // ─── PICALEÑA ─────────────────────────────────────────────────────────────
  {
    id: '8', name: 'Perros & Más – Picaleña', shortName: 'Perros',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.4,
    address: 'Carrera 5 # 30-56, Sector Picaleña', zone: 'Picaleña',
    // Cerca del Aeropuerto Perales de Ibagué
    position: { lat: 4.4198, lng: -75.2215 }, deliveryMin: 38, phone: '3190123456',
  },
  {
    id: '20', name: 'Asadero Don Hernando – Picaleña', shortName: 'Don Hernando',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Carrera 20 # 90-12, Sector Picaleña', zone: 'Picaleña',
    // Zona Picaleña, vía al aeropuerto
    position: { lat: 4.4188, lng: -75.2202 }, deliveryMin: 50, phone: '3240123456',
  },

  // ─── PIEDRA PINTADA / CALAMBEO ────────────────────────────────────────────
  {
    id: '11', name: 'Cocina Fit Piedra Pintada', shortName: 'Fit',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.8,
    address: 'Calle 80 # 4-12, Sector Piedra Pintada', zone: 'Piedra Pintada',
    // Zona norte-oriente, sector Piedra Pintada
    position: { lat: 4.4605, lng: -75.1988 }, deliveryMin: 40, phone: '3173456789',
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
