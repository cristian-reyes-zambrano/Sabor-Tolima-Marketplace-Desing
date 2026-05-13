/**
 * Configuración de tema y constantes de estilo
 * Garantiza consistencia visual en toda la app
 */

export const THEME = {
  colors: {
    // Colores principales
    primary: '#E53935', // Rojo Tolima
    accent: '#FB8C00', // Naranja dorado
    success: '#27AE60', // Verde éxito
    warning: '#F1C40F', // Amarillo warning
    destructive: '#E74C3C', // Rojo error

    // Colores neutros
    background: '#FFFFFF', // Fondo blanco
    foreground: '#212121', // Texto principal
    muted: '#757575', // Texto secundario
    border: '#E0E0E0', // Bordes
    card: '#FAFAFA', // Fondo cards

    // Colores especiales
    cream: '#FFF3E0', // Crema Tolima
    gold: '#FFD700', // Oro para highlights
    shadow: 'rgba(0, 0, 0, 0.1)', // Sombras
  },
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
} as const;

export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

export const RESPONSIVE_CLASSES = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  gridCols: {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    2: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  },
  gap: {
    default: 'gap-4 sm:gap-6',
    tight: 'gap-2 sm:gap-3',
    spacious: 'gap-6 sm:gap-8',
  },
} as const;

export const RESTAURANT_CATEGORIES = {
  tipica: {
    label: 'Típica',
    emoji: '🍲',
    description: 'Gastronomía Tolimense',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  rapida: {
    label: 'Rápida',
    emoji: '🍔',
    description: 'Comida Rápida',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  saludable: {
    label: 'Saludable',
    emoji: '🥗',
    description: 'Comida Sana',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  cafeteria: {
    label: 'Cafetería',
    emoji: '☕',
    description: 'Café & Repostería',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  gourmet: {
    label: 'Gourmet',
    emoji: '✨',
    description: 'Premium',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  ofertas: {
    label: 'Ofertas',
    emoji: '🔥',
    description: 'Descuentos',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
} as const;

export const MIN_ORDER_DISPLAY = {
  tipica: 25000,
  rapida: 15000,
  saludable: 22000,
  cafeteria: 10000,
  gourmet: 45000,
  ofertas: 12000,
} as const;
