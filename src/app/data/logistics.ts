/**
 * Datos logísticos de Ibagué — Sabor Tolima Marketplace
 * Zonas, restaurantes, tiempos y rutas dentro de la ciudad.
 * Coordenadas en sistema SVG (viewBox 0 0 800 600) mapeadas a Ibagué real.
 */

// ─── ZONAS DE IBAGUÉ ─────────────────────────────────────────────────────────
export interface Zone {
  id: string;
  name: string;
  /** Polígono SVG: array de [x, y] */
  polygon: [number, number][];
  color: string;
  /** Tiempo promedio de entrega desde el centro (min) */
  avgDeliveryMin: number;
  /** Distancia aproximada al centro (km) */
  distanceKm: number;
  /** Nivel de demanda */
  demand: 'alta' | 'media' | 'baja';
  /** Restaurantes en esta zona */
  restaurantIds: string[];
}

export const ZONES: Zone[] = [
  {
    id: 'centro',
    name: 'Centro',
    polygon: [[340,220],[420,220],[440,280],[420,340],[340,340],[320,280]],
    color: '#c62828',
    avgDeliveryMin: 15,
    distanceKm: 0,
    demand: 'alta',
    restaurantIds: ['1','3','12','13','16'],
  },
  {
    id: 'la-pola',
    name: 'La Pola',
    polygon: [[200,180],[320,180],[340,220],[320,280],[200,280],[180,230]],
    color: '#e65100',
    avgDeliveryMin: 20,
    distanceKm: 1.8,
    demand: 'alta',
    restaurantIds: ['2','5','14'],
  },
  {
    id: 'jordan',
    name: 'Jordán',
    polygon: [[200,280],[320,280],[340,340],[300,400],[200,400],[180,340]],
    color: '#f57f17',
    avgDeliveryMin: 22,
    distanceKm: 2.1,
    demand: 'media',
    restaurantIds: ['7','15'],
  },
  {
    id: 'belen',
    name: 'Belén',
    polygon: [[420,340],[500,320],[540,380],[500,440],[420,440],[400,390]],
    color: '#1b5e20',
    avgDeliveryMin: 25,
    distanceKm: 2.8,
    demand: 'media',
    restaurantIds: ['4'],
  },
  {
    id: 'el-salado',
    name: 'El Salado',
    polygon: [[300,400],[420,400],[440,460],[400,510],[300,510],[280,460]],
    color: '#0d47a1',
    avgDeliveryMin: 28,
    distanceKm: 3.2,
    demand: 'media',
    restaurantIds: ['3','22'],
  },
  {
    id: 'ambala',
    name: 'Av. Ambalá',
    polygon: [[440,180],[560,180],[580,240],[560,300],[440,300],[420,240]],
    color: '#4a148c',
    avgDeliveryMin: 25,
    distanceKm: 2.5,
    demand: 'media',
    restaurantIds: ['9','17'],
  },
  {
    id: 'cadiz',
    name: 'Cádiz',
    polygon: [[560,180],[660,200],[680,260],[640,320],[560,300],[540,240]],
    color: '#006064',
    avgDeliveryMin: 30,
    distanceKm: 3.5,
    demand: 'baja',
    restaurantIds: ['6','19'],
  },
  {
    id: 'calambeo',
    name: 'Calambeo',
    polygon: [[560,300],[660,300],[680,360],[640,420],[560,420],[540,360]],
    color: '#bf360c',
    avgDeliveryMin: 32,
    distanceKm: 3.8,
    demand: 'baja',
    restaurantIds: ['11'],
  },
  {
    id: 'mirolindo',
    name: 'Mirolindo',
    polygon: [[160,380],[280,380],[300,440],[260,500],[160,500],[140,440]],
    color: '#33691e',
    avgDeliveryMin: 35,
    distanceKm: 4.2,
    demand: 'baja',
    restaurantIds: ['10'],
  },
  {
    id: 'picaleña',
    name: 'Picaleña',
    polygon: [[440,460],[560,460],[580,520],[540,560],[440,560],[420,510]],
    color: '#880e4f',
    avgDeliveryMin: 38,
    distanceKm: 4.8,
    demand: 'baja',
    restaurantIds: ['8','20'],
  },
  {
    id: 'piedra-pintada',
    name: 'Piedra Pintada',
    polygon: [[640,380],[740,380],[760,440],[720,490],[640,490],[620,440]],
    color: '#37474f',
    avgDeliveryMin: 40,
    distanceKm: 5.1,
    demand: 'baja',
    restaurantIds: ['11'],
  },
];

// ─── PUNTOS DE RESTAURANTES ───────────────────────────────────────────────────
export interface RestaurantPoint {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  zoneId: string;
  category: 'tipica' | 'rapida' | 'saludable' | 'cafeteria' | 'gourmet' | 'ofertas';
}

export const RESTAURANT_POINTS: RestaurantPoint[] = [
  { id:'1',  name:'Lechonería La Tradición',   shortName:'Lechonería',   x:370, y:265, zoneId:'centro',        category:'tipica'    },
  { id:'2',  name:'Tamales Don José',           shortName:'Don José',     x:255, y:225, zoneId:'la-pola',       category:'tipica'    },
  { id:'3',  name:'Comidas Doña Ana',           shortName:'Doña Ana',     x:355, y:455, zoneId:'el-salado',     category:'tipica'    },
  { id:'4',  name:'Achiras de Belén',           shortName:'Achiras',      x:460, y:390, zoneId:'belen',         category:'tipica'    },
  { id:'5',  name:'Asados El Tolimense',        shortName:'Asados',       x:240, y:250, zoneId:'la-pola',       category:'rapida'    },
  { id:'6',  name:'Pizzería Cádiz',             shortName:'Pizzería',     x:610, y:245, zoneId:'cadiz',         category:'rapida'    },
  { id:'7',  name:'Pollos El Jordán',           shortName:'Pollos',       x:245, y:340, zoneId:'jordan',        category:'rapida'    },
  { id:'8',  name:'Perros & Más Picaleña',      shortName:'Perros',       x:490, y:500, zoneId:'picaleña',      category:'rapida'    },
  { id:'9',  name:'Ensaladas Ambalá',           shortName:'Ensaladas',    x:490, y:240, zoneId:'ambala',        category:'saludable' },
  { id:'10', name:'Frutas Mirolindo',           shortName:'Frutas',       x:210, y:440, zoneId:'mirolindo',     category:'saludable' },
  { id:'11', name:'Cocina Fit Piedra Pintada',  shortName:'Fit',          x:680, y:430, zoneId:'piedra-pintada',category:'saludable' },
  { id:'12', name:'Bar de Jugos Centro',        shortName:'Jugos',        x:395, y:295, zoneId:'centro',        category:'saludable' },
  { id:'13', name:'Café Musical',               shortName:'Café Musical', x:360, y:245, zoneId:'centro',        category:'cafeteria' },
  { id:'14', name:'Panadería La Pola',          shortName:'Panadería',    x:270, y:210, zoneId:'la-pola',       category:'cafeteria' },
  { id:'15', name:'Dulcería Doña Carmen',       shortName:'Dulcería',     x:250, y:360, zoneId:'jordan',        category:'cafeteria' },
  { id:'16', name:'Avena Don Rodrigo',          shortName:'Avena',        x:385, y:275, zoneId:'centro',        category:'cafeteria' },
  { id:'17', name:'El Tolimense Gourmet',       shortName:'Gourmet',      x:505, y:255, zoneId:'ambala',        category:'gourmet'   },
  { id:'18', name:'La Casona Centro',           shortName:'La Casona',    x:405, y:255, zoneId:'centro',        category:'gourmet'   },
  { id:'19', name:'Parrilla El Cádiz',          shortName:'Parrilla',     x:625, y:295, zoneId:'cadiz',         category:'gourmet'   },
  { id:'20', name:'Asadero Don Hernando',       shortName:'Don Hernando', x:510, y:490, zoneId:'picaleña',      category:'gourmet'   },
  { id:'21', name:'Menú del Día La 21',         shortName:'La 21',        x:375, y:310, zoneId:'centro',        category:'ofertas'   },
  { id:'22', name:'Combos El Salado',           shortName:'Combos',       x:370, y:465, zoneId:'el-salado',     category:'ofertas'   },
];

// ─── RUTAS LOGÍSTICAS ─────────────────────────────────────────────────────────
export interface LogisticRoute {
  id: string;
  from: string;   // restaurantId
  to: string;     // zoneId destino
  /** Puntos de la ruta SVG */
  path: [number, number][];
  distanceKm: number;
  estimatedMin: number;
  active: boolean;
}

export const LOGISTIC_ROUTES: LogisticRoute[] = [
  {
    id: 'r1-jordan',
    from: '1', to: 'jordan',
    path: [[370,265],[340,300],[280,340],[245,340]],
    distanceKm: 2.1, estimatedMin: 18, active: true,
  },
  {
    id: 'r2-centro',
    from: '2', to: 'centro',
    path: [[255,225],[300,240],[340,255],[370,265]],
    distanceKm: 1.8, estimatedMin: 15, active: true,
  },
  {
    id: 'r5-belen',
    from: '5', to: 'belen',
    path: [[240,250],[300,270],[360,300],[420,350],[460,390]],
    distanceKm: 3.2, estimatedMin: 25, active: true,
  },
  {
    id: 'r13-lapola',
    from: '13', to: 'la-pola',
    path: [[360,245],[320,230],[280,215],[255,225]],
    distanceKm: 1.8, estimatedMin: 16, active: true,
  },
  {
    id: 'r17-cadiz',
    from: '17', to: 'cadiz',
    path: [[505,255],[550,250],[590,248],[610,245]],
    distanceKm: 2.8, estimatedMin: 22, active: false,
  },
  {
    id: 'r9-centro',
    from: '9', to: 'centro',
    path: [[490,240],[450,255],[420,260],[390,265]],
    distanceKm: 2.5, estimatedMin: 20, active: true,
  },
  {
    id: 'r7-salado',
    from: '7', to: 'el-salado',
    path: [[245,340],[270,380],[310,420],[355,455]],
    distanceKm: 2.8, estimatedMin: 22, active: false,
  },
  {
    id: 'r8-centro',
    from: '8', to: 'centro',
    path: [[490,500],[460,450],[430,400],[400,350],[385,300]],
    distanceKm: 4.8, estimatedMin: 35, active: true,
  },
];

// ─── ESTADÍSTICAS LOGÍSTICAS ──────────────────────────────────────────────────
export interface LogisticStats {
  totalRestaurants: number;
  zonesActive: number;
  avgDeliveryMin: number;
  maxCoverageKm: number;
  ordersToday: number;
  activeRoutes: number;
}

export const LOGISTIC_STATS: LogisticStats = {
  totalRestaurants: 22,
  zonesActive: 11,
  avgDeliveryMin: 27,
  maxCoverageKm: 5.1,
  ordersToday: 148,
  activeRoutes: 6,
};

// ─── COLORES POR CATEGORÍA ────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<string, string> = {
  tipica:    '#c62828',
  rapida:    '#e65100',
  saludable: '#2e7d32',
  cafeteria: '#6d4c41',
  gourmet:   '#4a148c',
  ofertas:   '#f57f17',
};

export const DEMAND_COLORS: Record<string, string> = {
  alta:  '#c62828',
  media: '#f57f17',
  baja:  '#2e7d32',
};
