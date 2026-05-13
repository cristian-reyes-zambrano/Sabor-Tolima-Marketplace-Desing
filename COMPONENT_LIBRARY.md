# 🎨 COMPONENT LIBRARY - Sabor Tolima

Documentación completa de todos los componentes disponibles.

---

## 📦 COMPONENTES REUTILIZABLES

### 1. RestaurantCard

**Ubicación:** `src/app/components/RestaurantCard.tsx`

**Props:**
```typescript
interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  tags: string[];
  verified: boolean;
  discount?: string;
}
```

**Uso:**
```tsx
<RestaurantCard
  id="1"
  name="Lechona Tradicional"
  image="https://..."
  rating={4.9}
  distance="0.8 km"
  estimatedTime="20-30 min"
  tags={['Lechona', 'Típica']}
  verified={true}
  discount="15% OFF"
/>
```

**Características:**
- ✅ Favoritos interactivos
- ✅ Hover animations
- ✅ Responsive completo
- ✅ Overlay effects
- ✅ Rating flotante

---

### 2. CategoryFilter

**Ubicación:** `src/app/components/CategoryFilter.tsx`

**Props:**
```typescript
interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}
```

**Uso:**
```tsx
const [selected, setSelected] = useState<Category | null>(null);

<CategoryFilter
  selectedCategory={selected}
  onSelectCategory={setSelected}
/>
```

**Categorías:**
- `tipica` - 🍲 Gastronomía Tolimense
- `rapida` - 🍔 Comida Rápida
- `saludable` - 🥗 Comida Saludable
- `cafeteria` - ☕ Cafeterías
- `gourmet` - ✨ Gourmet
- `ofertas` - 🔥 Ofertas

---

### 3. HeroSection

**Ubicación:** `src/app/components/HeroSection.tsx`

**Props:**
```typescript
interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}
```

**Uso:**
```tsx
<HeroSection
  onSearch={setSearchQuery}
  searchQuery={searchQuery}
/>
```

**Elementos:**
- Título principal
- Descripción
- Buscador integrado
- 3 Métricas
- Fondo decorativo

---

### 4. Navbar

**Ubicación:** `src/app/components/Navbar.tsx`

**Características:**
- Logo con emoji
- Buscador integrado
- Carrito con badge
- Usuario/Login
- Menú móvil completo

**Uso:**
```tsx
<Navbar />
```

---

### 5. LoadingState

**Ubicación:** `src/app/components/LoadingState.tsx`

**Props:**
```typescript
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Uso:**
```tsx
<LoadingState message="Cargando restaurantes..." size="md" />
```

**Tamaños:**
- `sm` - Pequeño (6x6)
- `md` - Medio (10x10) - Default
- `lg` - Grande (16x16)

---

### 6. EmptyState

**Ubicación:** `src/app/components/EmptyState.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  icon?: string;           // emoji
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}
```

**Uso:**
```tsx
<EmptyState
  icon="🔍"
  title="No encontramos resultados"
  description="Intenta con otra búsqueda"
  action={{
    label: "Ver todos",
    onClick: () => setQuery("")
  }}
/>
```

---

## 🎯 HOOKS PERSONALIZADOS

### useFavorites()

**Ubicación:** `src/app/hooks/useFavorites.ts`

**Retorna:**
```typescript
{
  getFavorites: () => string[]
  isFavorite: (id: string) => boolean
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => boolean
}
```

**Uso:**
```typescript
const { isFavorite, toggleFavorite } = useFavorites();

// Verificar
if (isFavorite(restaurantId)) { ... }

// Toggle
const isNowFavorite = toggleFavorite(restaurantId);
```

**Persistencia:**
- localStorage key: `sabor-tolima-favorites`
- Automática
- Sin backend

---

## 📊 DATA MODULE

### Ubicación
`src/app/data/restaurants.ts`

### Interfaces

```typescript
type Category = 
  | 'tipica'
  | 'rapida'
  | 'saludable'
  | 'cafeteria'
  | 'gourmet'
  | 'ofertas';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  tags: string[];
  verified: boolean;
  discount?: string;
  categories: Category[];
  description?: string;
  minOrder?: number;
  deliveryFee?: number;
}
```

### Funciones

```typescript
// Filtrar por categoría
getRestaurantsByCategory(category: Category): Restaurant[]

// Buscar por texto
searchRestaurants(query: string): Restaurant[]

// Top por rating
getTopRestaurants(limit?: number): Restaurant[]

// Con descuentos
getRestaurantsWithDiscounts(): Restaurant[]
```

**Ejemplo:**
```typescript
import {
  getRestaurantsByCategory,
  searchRestaurants,
  restaurants
} from '../data/restaurants';

// Obtener solo típicos
const tipicos = getRestaurantsByCategory('tipica');

// Buscar tamales
const results = searchRestaurants('tamales');

// Top 10
const top = getTopRestaurants(10);
```

---

## 🧩 SHADCN/UI COMPONENTS

Todos disponibles en `src/app/components/ui/`:

### Layout
- `card.tsx` - Card container
- `separator.tsx` - Divider
- `scroll-area.tsx` - Scrollable area

### Forms
- `input.tsx` - Input field
- `button.tsx` - Button
- `checkbox.tsx` - Checkbox
- `radio-group.tsx` - Radio group
- `select.tsx` - Select dropdown
- `textarea.tsx` - Text area
- `toggle.tsx` - Toggle button

### Feedback
- `alert.tsx` - Alert box
- `alert-dialog.tsx` - Alert dialog
- `badge.tsx` - Badge
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Skeleton loader

### Navigation
- `tabs.tsx` - Tabbed interface
- `breadcrumb.tsx` - Breadcrumb
- `pagination.tsx` - Pagination
- `navigation-menu.tsx` - Nav menu

### Overlays
- `dialog.tsx` - Modal dialog
- `dropdown-menu.tsx` - Dropdown
- `popover.tsx` - Popover
- `hover-card.tsx` - Hover card
- `sheet.tsx` - Side sheet
- `context-menu.tsx` - Context menu

### Data
- `table.tsx` - Data table
- `carousel.tsx` - Carousel
- `chart.tsx` - Charts

### Utilities
- `label.tsx` - Label
- `aspect-ratio.tsx` - Aspect ratio
- `avatar.tsx` - Avatar
- `drawer.tsx` - Drawer
- `menubar.tsx` - Menubar
- `resizable.tsx` - Resizable
- `slider.tsx` - Slider
- `switch.tsx` - Switch
- `toggle-group.tsx` - Toggle group
- `tooltip.tsx` - Tooltip
- `input-otp.tsx` - OTP input
- `command.tsx` - Command palette
- `form.tsx` - Form helpers

**Uso:**
```tsx
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
```

---

## ⚙️ CONSTANTES

### Ubicación
`src/app/constants/theme.ts`

### Contenido

```typescript
// Colores
THEME.colors.primary      // #E74C3C (Rojo)
THEME.colors.accent       // #F39C12 (Dorado)
THEME.colors.success      // #27AE60 (Verde)

// Breakpoints
THEME.breakpoints.sm      // 640px
THEME.breakpoints.md      // 768px
THEME.breakpoints.lg      // 1024px

// Spacing
THEME.spacing.sm          // 1rem
THEME.spacing.md          // 1.5rem
THEME.spacing.lg          // 2rem

// Categorías con metadata
RESTAURANT_CATEGORIES.tipica.label    // "Típica"
RESTAURANT_CATEGORIES.tipica.emoji    // "🍲"
RESTAURANT_CATEGORIES.tipica.color    // "text-orange-600"
```

---

## 🎨 ESTILOS GLOBALES

### Ubicación
`src/styles/globals.css`

### Utilidades Disponibles

```html
<!-- Container seguro -->
<div className="container-safe">

<!-- Grid responsive -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

<!-- Animaciones -->
<div className="animate-fade-in">
<div className="animate-slide-in-up">
<div className="animate-scale-in">

<!-- Text balance -->
<h1 className="text-balance-fix">

<!-- Card hover effect -->
<div className="card-hover-effect">

<!-- Gradient primary -->
<div className="gradient-primary">
```

### Animaciones CSS

```css
@keyframes fadeIn      /* 300ms */
@keyframes slideInUp   /* 400ms */
@keyframes slideInDown /* 400ms */
@keyframes scaleIn     /* 300ms */
```

---

## 🔄 FLUJOS DE USO

### Filtrado Categoría

```tsx
import { useState } from 'react';
import { getRestaurantsByCategory, Category } from '../data/restaurants';
import { CategoryFilter } from '../components/CategoryFilter';
import { RestaurantCard } from '../components/RestaurantCard';

export function MyComponent() {
  const [selected, setSelected] = useState<Category | null>(null);
  
  const restaurants = selected 
    ? getRestaurantsByCategory(selected)
    : [];

  return (
    <>
      <CategoryFilter 
        selectedCategory={selected}
        onSelectCategory={setSelected}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} {...r} />
        ))}
      </div>
    </>
  );
}
```

### Favoritos Toggle

```tsx
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useState } from 'react';

export function FavoriteButton({ restaurantId }: { restaurantId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(isFavorite(restaurantId));

  const handleClick = () => {
    const newState = toggleFavorite(restaurantId);
    setFavorite(newState);
  };

  return (
    <button onClick={handleClick}>
      <Heart className={favorite ? 'fill-current' : ''} />
    </button>
  );
}
```

### Búsqueda Integrada

```tsx
import { useState } from 'react';
import { searchRestaurants } from '../data/restaurants';

export function SearchResults() {
  const [query, setQuery] = useState('');
  const results = query ? searchRestaurants(query) : [];

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(r => (
          <RestaurantCard key={r.id} {...r} />
        ))}
      </div>
    </>
  );
}
```

---

## 📚 REFERENCIAS

- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Hooks](https://react.dev/reference/react)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Component Library Versión:** 1.0.0  
Completo y listo para usar 🚀
