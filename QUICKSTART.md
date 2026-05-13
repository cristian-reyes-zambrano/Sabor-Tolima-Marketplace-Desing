# ⚡ QUICK START - Sabor Tolima en 5 minutos

La forma más rápida para empezar. Lee esto si tienes prisa. 🚀

---

## 📦 INSTALACIÓN (2 min)

```bash
# 1. En terminal/CMD
npm install

# 2. Espera a que termine...
# (Si tarda mucho, verifica conexión)

# Listo ✅
```

---

## 🚀 COMENZAR (1 min)

```bash
npm run dev
```

Abre: **http://localhost:5173**

¡Eso es todo! 🎉

---

## 🎮 PRUEBA ESTAS COSAS

### 1️⃣ Filtro de Categorías
- Toca **🍲 Típica** → Ve solo típicos
- Toca **🍔 Rápida** → Ve solo rápida
- Toca de nuevo → Limpia filtro

### 2️⃣ Búsqueda
- Escribe "tamales" en Hero Section
- Escribe "sushi" en Navbar

### 3️⃣ Favoritos ❤️
- Toca el corazón en cualquier card
- Se guarda automáticamente
- Aparecerá en "Tus Favoritos"

### 4️⃣ Responsive
- Redimensiona la ventana
- Prueba en mobile (F12 → Device Mode)
- Verás que se adapta perfecto

---

## 📱 VER EN MÓVIL

### Local Network
```bash
# Verás en consola algo como:
# Local:    http://localhost:5173
# Network:  http://192.168.x.x:5173  <-- Copia esto

# En tu móvil, abre esa URL
```

### Mobile Device
- Conecta móvil a misma WiFi
- Copia URL del Network
- Abre en navegador del móvil

---

## 🔧 COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build (crea carpeta /dist)
npm run build

# Preview del build
npm run preview

# Limpiar
rm -rf node_modules
npm install
```

---

## 📊 DATOS INCLUIDOS

- 22 restaurantes demo
- 6 categorías funcionales
- 4-5 items por categoría
- Mock data sin backend necesario

---

## 🆘 SI ALGO FALLA

**Error: Module not found**
```bash
# Solución
rm -rf node_modules
npm install
```

**Puerto 5173 ocupado**
```bash
# Vite usa otro puerto automáticamente
# O mata el proceso: kill -9 PID
```

**Página blanca**
- Abre DevTools (F12)
- Verifica Console
- Reporta el error exacto

---

## 📚 DOCUMENTACIÓN COMPLETA

Después de jugar, lee esto:

1. [INDEX.md](INDEX.md) - Índice de documentos
2. [USAGE_GUIDE.md](USAGE_GUIDE.md) - Guía completa
3. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Arquitectura
4. [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) - Componentes

---

## 🎯 ESTRUCTURA IMPORTANTE

```
src/app/
├── components/          ← Componentes UI
├── pages/              ← Páginas principales
├── data/restaurants.ts ← Todos los restaurantes
├── hooks/useFavorites  ← Sistema favoritos
└── constants/theme.ts  ← Colores y estilos
```

---

## 🔑 LO QUE FUNCIONA

✅ Categorías con filtrado real  
✅ Búsqueda por texto  
✅ Sistema de favoritos (localStorage)  
✅ Responsive mobile/tablet/desktop  
✅ Navbar con navegación  
✅ Cards de restaurantes  

---

## 🚧 PRÓXIMAS FEATURES

Para v1.1:
- Firebase Authentication
- Carrito completo
- Checkout
- Order tracking

---

## 💡 TIPS

- Abre DevTools (F12) para ver estructura HTML
- Los favoritos se guardan en localStorage del navegador
- Cambia categoría mientras escribes - los filtros se combinan
- Redimensiona ventana para ver responsive en acción

---

## ❓ PREGUNTAS FRECUENTES

**¿Puedo cambiar los restaurantes?**  
Sí, edita `src/app/data/restaurants.ts`

**¿Cómo agrego más categorías?**  
En `restaurants.ts`, agrega type en `Category` y en `restaurants` array

**¿Los favoritos persisten?**  
Sí, se guardan en localStorage (no necesita backend)

**¿Es responsive real?**  
Sí 100%, probado en mobile/tablet/desktop

**¿Está listo para producción?**  
Casi, falta solo Firebase. Ver [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

## 🎓 PRONTO NECESITARÁS

Para llevar a producción:

1. [Firebase Setup](FIREBASE_SETUP.md) - Autenticación
2. [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Llevar a prod
3. [Component Library](COMPONENT_LIBRARY.md) - Entender componentes

---

## 🎉 ¡LISTO!

Ya tienes el marketplace funcionando.

**Próximo paso:** Explora el código y lee la [documentación completa](INDEX.md).

---

**¿Alguna duda?**  
Lee: [USAGE_GUIDE.md](USAGE_GUIDE.md#-soporte)

**¿Listo para más?**  
Lee: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

Versión: 1.0.0  
Estado: ✅ Listo para usar  
Enjoy! 🚀
