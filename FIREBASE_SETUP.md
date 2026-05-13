# Firebase Configuration Guide

Sabor Tolima marketplace está completamente preparado para Firebase.

## 🔧 Setup Firebase

### 1. Crear proyecto en Firebase Console

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto
3. Habilitar Authentication
4. Habilitar Firestore Database
5. Configurar Google Sign-in

### 2. Instalar SDK Firebase

```bash
npm install firebase
npm install @react-oauth/google
```

### 3. Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### 4. Crear Firebase Config

Crear `src/app/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 5. Crear Hook de Autenticación

Crear `src/app/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithRedirect(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logout,
  };
}
```

### 6. Mejorar Login.tsx

```typescript
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/role-selection');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/role-selection');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // ... resto del componente
  );
}
```

## 🗄️ Estructura Firestore

### Colecciones

#### users
```
{
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: 'buyer' | 'seller'
  createdAt: timestamp
  favorites: string[] // restaurantIds
  addresses: Address[]
  phone: string
  verified: boolean
}
```

#### restaurants
```
{
  id: string
  name: string
  owner_uid: string
  description: string
  image: string
  categories: string[]
  rating: number
  reviews_count: number
  verified: boolean
  location: {
    lat: number
    lng: number
    address: string
  }
  delivery_fee: number
  min_order: number
  hours: {
    open: string
    close: string
  }
  created_at: timestamp
}
```

#### menu_items
```
{
  id: string
  restaurant_id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  created_at: timestamp
}
```

#### orders
```
{
  id: string
  buyer_uid: string
  restaurant_id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered'
  delivery_address: string
  notes: string
  created_at: timestamp
  estimated_delivery: timestamp
}
```

## 🔐 Reglas de Seguridad

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth != null; // Para perfiles públicos
    }

    // Restaurants (públicos)
    match /restaurants/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.owner_uid;
    }

    // Menu items (públicos)
    match /menu_items/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders (privado)
    match /orders/{document=**} {
      allow read: if request.auth.uid == resource.data.buyer_uid 
                  || request.auth.uid == resource.data.seller_uid;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.buyer_uid 
                    || request.auth.uid == resource.data.seller_uid;
    }
  }
}
```

## 📊 Funciones Cloud (Opcional)

```typescript
// calculateDelivery - Calcula tiempo de entrega
// processPayment - Procesa pagos
// notifyRestaurant - Notifica al restaurante
// trackOrder - Rastreo en tiempo real
```

## 🚀 Próximas Integraciones

- [ ] Google Sign-in
- [ ] Email/Password Auth
- [ ] Two-factor authentication
- [ ] Stripe/PayPal integration
- [ ] Real-time notifications
- [ ] Order tracking
- [ ] Reviews system
- [ ] Admin dashboard

## 📝 Checklist Final

- [ ] Firebase project creado
- [ ] Variables de entorno configuradas
- [ ] SDK instalado
- [ ] Hooks de auth creados
- [ ] Reglas de Firestore configuradas
- [ ] Storage de imágenes listo
- [ ] Login integrado en UI

---

**Documentación:** Firebase + React Integration  
**Versión:** 1.0.0
