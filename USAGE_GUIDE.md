# 🚀 GUÍA DE USO - Sabor Tolima Marketplace

Bienvenido al marketplace gastronómico premium "Sabor Tolima". Esta guía te mostrará cómo usar todas las características.

---

## 🎯 INICIO RÁPIDO

### 1. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abre http://localhost:5173
```

### 2. Build para Producción

```bash
npm run build
npm run preview
```

---

## 📱 CÓMO USAR LAS CARACTERÍSTICAS

### 🏠 Página Principal (Home)

**Secciones:**

1. **Hero Section**
   - Buscador principal
   - Descripción del servicio
   - Métricas rápidas

2. **Categorías**
   - Toca una categoría para filtrar
   - Toca nuevamente para limpiar
   - Combina con búsqueda

3. **Restaurantes Destacados**
   - Los 6 mejores por rating
   - Solo visible cuando sin filtro

4. **Tus Favoritos**
   - Restaurantes guardados
   - Persiste en el navegador
   - Máximo 3 mostrados

---

### 🔍 Búsqueda

**Cómo funciona:**

1. Escribe en el buscador (Hero o Navbar)
2. Busca por:
   - Nombre del restaurante
   - Descripción
   - Tags/categorías

3. Combina con filtros:
   - Búsqueda + categoría = resultados precisos

4. URL actualiza automáticamente:
   - Puedes compartir: `?q=tamales`

**Ejemplo:**
- Busca: "tamales"
- Filtro: "Típica"
- Resultado: Solo "Tamalería San Alejo"

---

### 🍲 Categorías

**6 Categorías Funcionales:**

| Emoji | Categoría | Contenido | Color |
|-------|-----------|-----------|-------|
| 🍲 | Típica | Lechona, Tamales, Sancocho | Naranja |
| 🍔 | Rápida | Hamburguesas, Pizza, Pollo | Rojo |
| 🥗 | Saludable | Ensaladas, Smoothies, Fit | Verde |
| ☕ | Cafetería | Café, Postres, Panadería | Ámbar |
| ✨ | Gourmet | Sushi, Francesa, Premium | Púrpura |
| 🔥 | Ofertas | Promociones y descuentos | Rosa |

**Cómo usar:**
1. Toca el botón de categoría
2. Se resaltará con ring y fondo color
3. Muestra solo restaurantes de esa categoría
4. Toca nuevamente para limpiar

---

### ❤️ Favoritos

**Agregar a Favoritos:**

1. Toca el corazón en la esquina superior derecha de la tarjeta
2. Se llena de color y guarda automáticamente
3. Aparece en "Tus Favoritos" en home

**Gestionar Favoritos:**

- El corazón muestra estado
- Click = Toggle (agregar/quitar)
- Se persisten en localStorage
- No requiere login

**Ver todos tus Favoritos:**

- En Home, sección "Tus Favoritos"
- Scrollea o accede desde Navbar

---

### 🛒 Carrito

**Estado Actual:**
- Badge muestra cantidad (3 demo)
- Toca icono carrito
- Va a página Cart (en desarrollo)

**Próximamente:**
- Agregar/quitar items
- Ajustar cantidades
- Checkout integrado

---

### 👤 Usuario

**Login:**

1. Toca icono usuario (desktop) o menú (mobile)
2. Click en "Iniciar sesión"
3. Página de login (Firebase ready)

**Opciones Móvil:**

- Menú hamburguesa abre opciones
- "Iniciar sesión" o "Crear cuenta"
- Links rápidos a funciones

---

## 📲 RESPONSIVE DESIGN

### Cómo se adapta:

**Mobile (< 640px)**
- 1 columna de restaurantes
- Menú hamburguesa
- Categorías en grid 3x2
- Tipografía más grande
- Touch-friendly (44x44px)

**Tablet (640-1024px)**
- 2 columnas de restaurantes
- Menú horizontal si cabe
- Categorías en grid 3x2
- Spacing medio
- Optimizado para landscape

**Desktop (> 1024px)**
- 3 columnas de restaurantes
- Navbar completo
- Categorías en grid 1x6
- Spacing amplio
- Hover effects completos

**Prueba:**
1. Abre en navegador
2. Redimensiona ventana
3. Verás cambios automáticos
4. Usa Device Tools (F12)

---

## 🎨 INTERFAZ

### Colores

- **Primario (Rojo)**: Botones principales, highlights
- **Acento (Dorado)**: Ratings, acciones secundarias
- **Verde**: Saludable, éxito
- **Gris**: Backgrounds, muted text

### Tipografía

- **Titulos**: Plus Jakarta Sans (bold)
- **Cuerpo**: Inter (regular)
- **Código**: Monospace

### Espaciado

- **Móvil**: px-4 (1rem)
- **Tablet**: px-6 (1.5rem)
- **Desktop**: px-8 (2rem)
- Gap entre items: gap-4 sm:gap-6

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

Crear `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... ver .env.example
```

### Tema

Editar en `src/app/constants/theme.ts`:

```typescript
export const THEME = {
  colors: { ... },
  breakpoints: { ... },
  spacing: { ... },
}
```

---

## 🚀 CARACTERÍSTICAS TÉCNICAS

### Performance

- ✅ Lazy loading de imágenes
- ✅ useMemo para optimización
- ✅ Code splitting ready
- ✅ No renders innecesarios

### Accesibilidad

- ✅ WCAG AA compliant
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus states

### Escalabilidad

- ✅ 100% TypeScript
- ✅ Componentes modulares
- ✅ Hooks reutilizables
- ✅ Easy to extend

---

## 📊 DATOS

### Restaurantes

Actualmente 22 restaurantes en la app:

**Típica (4):**
- Lechona Tradicional Tolima
- Tamalería San Alejo
- Sancocho del Centro
- Achiras del Tolima

**Rápida (4):**
- Burgers & Wings
- Pizzería Rápida Express
- Pollo Frito Premium
- Hot Dogs Gourmet

**Saludable (4):**
- Green Bowl Salads
- Smoothie Bowl Paradise
- Fit Meals Nutritivos
- Juice Bar Natural

**Cafetería (4):**
- Café del Centro
- Bakery & Coffee House
- Sweet Treats Pastry
- Avena Tolimense Tradicional

**Gourmet (4):**
- Sushi Master Premium
- Le Petit Restaurant
- Tapas & Wine Bar
- Steakhouse Premium

**Ofertas (2):**
- Mega Promociones Comida
- Flash Deal Restaurant

### Agregar Nuevos

Editar `src/app/data/restaurants.ts`:

```typescript
{
  id: '23',
  name: 'Mi Restaurante',
  categories: ['tipica', 'ofertas'],
  // ...
}
```

---

## 🐛 TROUBLESHOOTING

### El filtro no funciona

**Solución:**
1. Abre DevTools (F12)
2. Console debe estar limpia
3. Verifica que categoría sea válida
4. Limpia localStorage si es necesario

### Las imágenes no cargan

**Solución:**
1. Verifica conexión a internet
2. URLs de Unsplash están activas
3. Abre DevTools → Network
4. Prueba incógnito (cache issues)

### Favoritos no se guardan

**Solución:**
1. Verifica que localStorage esté habilitado
2. DevTools → Application → LocalStorage
3. Debe haber entrada "sabor-tolima-favorites"
4. Verifica privacidad del navegador

### Responsive no funciona

**Solución:**
1. Verifica que Device Mode esté ON (F12)
2. Recarga página (Ctrl+R)
3. Zoom al 100%
4. Prueba otro navegador

---

## 📞 SOPORTE

### Documentación

- `PROJECT_STRUCTURE.md` - Estructura completa
- `FIREBASE_SETUP.md` - Setup Firebase
- `IMPROVEMENTS.md` - Cambios realizados
- Inline comments en código

### Próximas Mejoras

- [ ] Firebase integration
- [ ] Carrito completo
- [ ] Checkout
- [ ] Pagos
- [ ] Reviews
- [ ] Chat
- [ ] Notificaciones

---

## ✅ CHECKLIST PARA PRODUCCIÓN

Antes de deployar:

- [ ] Variables de .env configuradas
- [ ] Firebase project creado
- [ ] HTTPS en servidor
- [ ] CDN configurado
- [ ] Imágenes optimizadas
- [ ] Build sin errores (`npm run build`)
- [ ] Tests pasando
- [ ] Lighthouse > 90

---

## 🎓 RECURSOS

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 🎉 PRONTO

Síguenos en redes para updates:
- Más categorías
- Nuevo diseño
- App móvil nativa
- Integraciones

---

**Gracias por usar Sabor Tolima 🍲**

Versión: 1.0.0  
Última actualización: Mayo 2026  
Made with ❤️ for Tolima
