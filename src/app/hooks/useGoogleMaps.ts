/**
 * useGoogleMaps — Carga la Google Maps JavaScript API de forma segura.
 *
 * - Evita cargar el script más de una vez (idempotente).
 * - Retorna { isLoaded, hasApiKey } para que el componente decida qué mostrar.
 * - Si no hay API key configurada, retorna hasApiKey=false y el componente
 *   muestra el mapa SVG de fallback en lugar de crashear.
 */
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google?: typeof google;
    __googleMapsLoading?: boolean;
  }
}

interface UseGoogleMapsResult {
  isLoaded: boolean;
  hasApiKey: boolean;
  error: string | null;
}

export function useGoogleMaps(): UseGoogleMapsResult {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const hasApiKey = Boolean(apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && apiKey.length > 10);

  const [isLoaded, setIsLoaded] = useState(
    // Ya estaba cargado de una visita anterior en la misma sesión
    typeof window !== 'undefined' && !!window.google?.maps
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasApiKey || isLoaded) return;

    // Ya hay un script cargando — esperar
    if (window.__googleMapsLoading) {
      const check = setInterval(() => {
        if (window.google?.maps) {
          setIsLoaded(true);
          clearInterval(check);
        }
      }, 100);
      return () => clearInterval(check);
    }

    // Verificar si el script ya existe en el DOM
    const existing = document.querySelector('script[data-gmaps]');
    if (existing) {
      if (window.google?.maps) {
        setIsLoaded(true);
      }
      return;
    }

    window.__googleMapsLoading = true;

    const script = document.createElement('script');
    script.setAttribute('data-gmaps', 'true');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=es&region=CO`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.__googleMapsLoading = false;
      setIsLoaded(true);
    };

    script.onerror = () => {
      window.__googleMapsLoading = false;
      setError('No se pudo cargar Google Maps. Verifica tu API key.');
    };

    document.head.appendChild(script);
  }, [hasApiKey, isLoaded, apiKey]);

  return { isLoaded, hasApiKey, error };
}
