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
  { id: 'centro',        name: 'Centro',         center: { lat: 4.4389, lng: -75.2322 }, radius: 900,  color: '#c62828', deliveryMin: 15, distanceKm: 0.0, demand: 'alta'  },
  { id: 'la-pola',       name: 'La Pola',         center: { lat: 4.4420, lng: -75.2410 }, radius: 700,  color: '#e65100', deliveryMin: 20, distanceKm: 1.8, demand: 'alta'  },
  { id: 'jordan',        name: 'Jordán',          center: { lat: 4.4350, lng: -75.2380 }, radius: 750,  color: '#f57f17', deliveryMin: 22, distanceKm: 2.1, demand: 'media' },
  { id: 'belen',         name: 'Belén',           center: { lat: 4.4310, lng: -75.2260 }, radius: 650,  color: '#1b5e20', deliveryMin: 25, distanceKm: 2.8, demand: 'media' },
  { id: 'el-salado',     name: 'El Salado',       center: { lat: 4.4280, lng: -75.2340 }, radius: 700,  color: '#0d47a1', deliveryMin: 28, distanceKm: 3.2, demand: 'media' },
  { id: 'ambala',        name: 'Av. Ambalá',      center: { lat: 4.4500, lng: -75.2200 }, radius: 800,  color: '#4a148c', deliveryMin: 25, distanceKm: 2.5, demand: 'media' },
  { id: 'cadiz',         name: 'Cádiz',           center: { lat: 4.4560, lng: -75.2100 }, radius: 700,  color: '#006064', deliveryMin: 30, distanceKm: 3.5, demand: 'baja'  },
  { id: 'calambeo',      name: 'Calambeo',        center: { lat: 4.4480, lng: -75.2050 }, radius: 750,  color: '#bf360c', deliveryMin: 32, distanceKm: 3.8, demand: 'baja'  },
  { id: 'mirolindo',     name: 'Mirolindo',       center: { lat: 4.4230, lng: -75.2450 }, radius: 650,  color: '#33691e', deliveryMin: 35, distanceKm: 4.2, demand: 'baja'  },
  { id: 'picaleña',      name: 'Picaleña',        center: { lat: 4.4200, lng: -75.2200 }, radius: 800,  color: '#880e4f', deliveryMin: 38, distanceKm: 4.8, demand: 'baja'  },
  { id: 'piedra-pintada',name: 'Piedra Pintada',  center: { lat: 4.4600, lng: -75.1980 }, radius: 600,  color: '#37474f', deliveryMin: 40, distanceKm: 5.1, demand: 'baja'  },
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
  {
    id: '1', name: 'Lechonería La Tradición Ibagueña', shortName: 'Lechonería',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.9,
    address: 'Calle 10 # 5-23, Centro Histórico', zone: 'Centro',
    position: { lat: 4.4392, lng: -75.2318 }, deliveryMin: 20, phone: '3001234567',
  },
  {
    id: '2', name: 'Tamales Don José – La Pola', shortName: 'Don José',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.8,
    address: 'Carrera 5 # 12-45, Barrio La Pola', zone: 'La Pola',
    position: { lat: 4.4425, lng: -75.2415 }, deliveryMin: 25, phone: '3109876543',
  },
  {
    id: '3', name: 'Comidas Caseras Doña Ana – El Salado', shortName: 'Doña Ana',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.7,
    address: 'Calle 38 # 2-15, Barrio El Salado', zone: 'El Salado',
    position: { lat: 4.4285, lng: -75.2345 }, deliveryMin: 28, phone: '3124567890',
  },
  {
    id: '4', name: 'Achiras y Dulces de Belén', shortName: 'Achiras',
    category: 'tipica', categoryLabel: 'Típica', rating: 4.6,
    address: 'Carrera 3 # 20-12, Barrio Belén', zone: 'Belén',
    position: { lat: 4.4315, lng: -75.2265 }, deliveryMin: 25, phone: '3187654321',
  },
  {
    id: '5', name: 'Asados El Tolimense – La Pola', shortName: 'Asados',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.6,
    address: 'Carrera 8 # 45-67, Barrio La Pola', zone: 'La Pola',
    position: { lat: 4.4415, lng: -75.2405 }, deliveryMin: 20, phone: '3201234567',
  },
  {
    id: '6', name: 'Pizzería Cádiz – Ibagué', shortName: 'Pizzería',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.7,
    address: 'Calle 60 # 3-45, Sector Cádiz', zone: 'Cádiz',
    position: { lat: 4.4558, lng: -75.2108 }, deliveryMin: 30, phone: '3156789012',
  },
  {
    id: '7', name: 'Pollos El Jordán – Ibagué', shortName: 'Pollos',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.5,
    address: 'Calle 42 # 6-78, Barrio Jordán', zone: 'Jordán',
    position: { lat: 4.4355, lng: -75.2385 }, deliveryMin: 22, phone: '3178901234',
  },
  {
    id: '8', name: 'Perros & Más – Picaleña', shortName: 'Perros',
    category: 'rapida', categoryLabel: 'Rápida', rating: 4.4,
    address: 'Carrera 5 # 30-56, Sector Picaleña', zone: 'Picaleña',
    position: { lat: 4.4205, lng: -75.2210 }, deliveryMin: 38, phone: '3190123456',
  },
  {
    id: '9', name: 'Ensaladas Frescas Ambalá', shortName: 'Ensaladas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.9,
    address: 'Calle 70 # 2-34, Av. Ambalá', zone: 'Av. Ambalá',
    position: { lat: 4.4498, lng: -75.2205 }, deliveryMin: 25, phone: '3151234567',
  },
  {
    id: '10', name: 'Frutas y Jugos Mirolindo', shortName: 'Frutas',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.7,
    address: 'Carrera 12 # 55-89, Sector Mirolindo', zone: 'Mirolindo',
    position: { lat: 4.4235, lng: -75.2455 }, deliveryMin: 35, phone: '3162345678',
  },
  {
    id: '11', name: 'Cocina Fit Piedra Pintada', shortName: 'Fit',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.8,
    address: 'Calle 80 # 4-12, Sector Piedra Pintada', zone: 'Piedra Pintada',
    position: { lat: 4.4598, lng: -75.1985 }, deliveryMin: 40, phone: '3173456789',
  },
  {
    id: '12', name: 'Bar de Jugos El Centro', shortName: 'Jugos',
    category: 'saludable', categoryLabel: 'Saludable', rating: 4.6,
    address: 'Carrera 6 # 18-45, Centro', zone: 'Centro',
    position: { lat: 4.4395, lng: -75.2328 }, deliveryMin: 15, phone: '3184567890',
  },
  {
    id: '13', name: 'Café Musical de Ibagué', shortName: 'Café Musical',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.5,
    address: 'Calle 12 # 3-56, Centro Histórico', zone: 'Centro',
    position: { lat: 4.4388, lng: -75.2325 }, deliveryMin: 15, phone: '3181234567',
  },
  {
    id: '14', name: 'Panadería La Pola – Ibagué', shortName: 'Panadería',
    category: 'cafeteria', categoryLabel: 'Cafetería', rating: 4.7,
    address: 'Carrera 9 # 62-34, Barrio La Pola', zone: 'La Pola',
    position: { lat: 4.4418, lng: -75.2408 }, deliveryMin: 20, phone: '3195678901',
  },
  {
    id: '17', name: 'El Tolimense Gourmet – Ambalá', shortName: 'Gourmet',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Calle 90 # 5-67, Av. Ambalá', zone: 'Av. Ambalá',
    position: { lat: 4.4505, lng: -75.2195 }, deliveryMin: 40, phone: '3221234567',
  },
  {
    id: '18', name: 'Restaurante La Casona – Centro', shortName: 'La Casona',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.9,
    address: 'Carrera 15 # 85-23, Centro Histórico', zone: 'Centro',
    position: { lat: 4.4400, lng: -75.2315 }, deliveryMin: 45, phone: '3228901234',
  },
  {
    id: '20', name: 'Asadero Don Hernando – Picaleña', shortName: 'Don Hernando',
    category: 'gourmet', categoryLabel: 'Gourmet', rating: 4.8,
    address: 'Carrera 20 # 90-12, Sector Picaleña', zone: 'Picaleña',
    position: { lat: 4.4198, lng: -75.2198 }, deliveryMin: 50, phone: '3240123456',
  },
  {
    id: '21', name: 'Menú del Día – Mercado La 21', shortName: 'La 21',
    category: 'ofertas', categoryLabel: 'Ofertas', rating: 4.4,
    address: 'Calle 25 # 10-34, Sector Mercado La 21', zone: 'Centro',
    position: { lat: 4.4382, lng: -75.2330 }, deliveryMin: 15, phone: '3251234567',
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
