/**
 * MapPage — Mapa interactivo de Ibagué con Google Maps
 *
 * Estrategia de carga:
 *   1. Si VITE_GOOGLE_MAPS_API_KEY está configurada → Google Maps real
 *   2. Si no hay key o falla la carga → mapa SVG de fallback (sin crash)
 *
 * Funcionalidades con Google Maps:
 *   - Marcadores de restaurantes con InfoWindow
 *   - Círculos de zonas de cobertura
 *   - Ruta de entrega simulada con Directions API
 *   - Marcador de ubicación del usuario (geolocalización)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin, Clock, Navigation, Star, Filter, Truck,
  ChevronRight, X, Locate, Info, ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import {
  IBAGUE_CENTER, MAP_ZONES, MAP_RESTAURANTS,
  CATEGORY_MAP_COLORS, CATEGORY_EMOJIS,
  type MapRestaurant,
} from '../data/mapData';

// ─── Tipos Google Maps (sin instalar @types/google.maps) ──────────────────────
type GMap = google.maps.Map;
type GMarker = google.maps.Marker;
type GInfoWindow = google.maps.InfoWindow;
type GCircle = google.maps.Circle;

// ─── Constantes ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',       label: 'Todos'     },
  { id: 'tipica',    label: 'Típica'    },
  { id: 'rapida',    label: 'Rápida'    },
  { id: 'saludable', label: 'Saludable' },
  { id: 'cafeteria', label: 'Cafetería' },
  { id: 'gourmet',   label: 'Gourmet'   },
  { id: 'ofertas',   label: 'Ofertas'   },
];

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1eb' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffecd2' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8f5' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8f4ef' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c62828' }, { weight: 1 }] },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MapPage() {
  const navigate = useNavigate();
  const { isLoaded, hasApiKey, error } = useGoogleMaps();
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapRestaurant | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GMap | null>(null);
  const markersRef = useRef<GMarker[]>([]);
  const circlesRef = useRef<GCircle[]>([]);
  const infoWindowRef = useRef<GInfoWindow | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const userMarkerRef = useRef<GMarker | null>(null);

  const visibleRestaurants = filterCategory === 'all'
    ? MAP_RESTAURANTS
    : MAP_RESTAURANTS.filter(r => r.category === filterCategory);

  // ── Inicializar mapa ────────────────────────────────────────────────────────
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: IBAGUE_CENTER,
      zoom: 13,
      styles: MAP_STYLES,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Directions renderer
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#c62828',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });
    directionsRendererRef.current.setMap(map);
  }, []);

  // ── Dibujar zonas ───────────────────────────────────────────────────────────
  const drawZones = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    if (!showZones) return;

    MAP_ZONES.forEach(zone => {
      const circle = new window.google.maps.Circle({
        map: mapInstanceRef.current!,
        center: zone.center,
        radius: zone.radius,
        fillColor: zone.color,
        fillOpacity: 0.12,
        strokeColor: zone.color,
        strokeWeight: 1.5,
        strokeOpacity: 0.6,
        clickable: false,
      });
      circlesRef.current.push(circle);
    });
  }, [showZones]);

  // ── Dibujar marcadores ──────────────────────────────────────────────────────
  const drawMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    visibleRestaurants.forEach(restaurant => {
      const color = CATEGORY_MAP_COLORS[restaurant.category] ?? '#c62828';
      const emoji = CATEGORY_EMOJIS[restaurant.category] ?? '🍽️';

      // SVG pin personalizado
      const svgPin = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
          <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28S40 35 40 20C40 9 31 0 20 0z"
            fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="20" cy="20" r="12" fill="white" opacity="0.95"/>
          <text x="20" y="25" text-anchor="middle" font-size="14">${emoji}</text>
        </svg>`;

      const marker = new window.google.maps.Marker({
        position: restaurant.position,
        map: mapInstanceRef.current!,
        title: restaurant.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgPin)}`,
          scaledSize: new window.google.maps.Size(40, 48),
          anchor: new window.google.maps.Point(20, 48),
        },
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        setSelectedRestaurant(restaurant);

        const content = `
          <div style="font-family:system-ui,sans-serif;padding:4px;max-width:220px">
            <div style="font-weight:700;font-size:14px;color:#1a1a1a;margin-bottom:4px">
              ${restaurant.name}
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span style="background:${color};color:white;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600">
                ${restaurant.categoryLabel}
              </span>
              <span style="color:#f59e0b;font-size:12px;font-weight:700">★ ${restaurant.rating}</span>
            </div>
            <div style="font-size:11px;color:#666;margin-bottom:4px">📍 ${restaurant.address}</div>
            <div style="font-size:11px;color:#666">⏱️ ${restaurant.deliveryMin} min · ${restaurant.zone}</div>
          </div>`;

        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(mapInstanceRef.current!, marker);
      });

      markersRef.current.push(marker);
    });
  }, [visibleRestaurants]);

  // ── Ruta de entrega ─────────────────────────────────────────────────────────
  const calculateRoute = useCallback((restaurant: MapRestaurant) => {
    if (!window.google?.maps || !mapInstanceRef.current) return;

    const origin = userLocation ?? IBAGUE_CENTER;
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination: restaurant.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setRouteInfo({
              distance: leg.distance?.text ?? '',
              duration: leg.duration?.text ?? '',
            });
            setShowRoute(true);
          }
        }
      }
    );
  }, [userLocation]);

  const clearRoute = useCallback(() => {
    directionsRendererRef.current?.setDirections({ routes: [] } as unknown as google.maps.DirectionsResult);
    setShowRoute(false);
    setRouteInfo(null);
  }, []);

  // ── Geolocalización ─────────────────────────────────────────────────────────
  const locateUser = useCallback(() => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);

        userMarkerRef.current?.setMap(null);
        userMarkerRef.current = new window.google.maps.Marker({
          position: loc,
          map: mapInstanceRef.current!,
          title: 'Tu ubicación',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3,
          },
          zIndex: 999,
        });

        mapInstanceRef.current!.panTo(loc);
        mapInstanceRef.current!.setZoom(14);
      },
      () => {
        // Geolocalización denegada — centrar en Ibagué
        mapInstanceRef.current?.panTo(IBAGUE_CENTER);
      }
    );
  }, []);

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      drawZones();
    }
  }, [isLoaded, showZones, drawZones]);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      drawMarkers();
    }
  }, [isLoaded, filterCategory, drawMarkers]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Mapa de Ibagué</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {visibleRestaurants.length} restaurantes · 11 zonas de cobertura · Ibagué, Tolima
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowZones(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showZones ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground border-border'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Zonas
            </button>
            {hasApiKey && (
              <button
                onClick={locateUser}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-white text-muted-foreground hover:border-primary/30 transition-all"
              >
                <Locate className="w-3.5 h-3.5" />
                Mi ubicación
              </button>
            )}
            {showRoute && (
              <button
                onClick={clearRoute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-destructive/30 bg-white text-destructive hover:bg-destructive/5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar ruta
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilterCategory(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                filterCategory === id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              {id !== 'all' && CATEGORY_EMOJIS[id]} {label}
            </button>
          ))}
        </div>

        {/* Ruta activa */}
        {showRoute && routeInfo && (
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-2xl">
            <Truck className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Ruta a {selectedRestaurant?.shortName}
              </p>
              <p className="text-xs text-muted-foreground">
                {routeInfo.distance} · {routeInfo.duration} en moto
              </p>
            </div>
            <button onClick={clearRoute} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mapa + Panel */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">

          {/* Contenedor del mapa */}
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 520 }}>
            {/* Div donde se monta Google Maps */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Estado de carga */}
            {!isLoaded && hasApiKey && !error && (
              <div className="absolute inset-0 bg-[#f8f4ef] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Cargando mapa de Ibagué...</p>
              </div>
            )}

            {/* Error o sin API key → fallback SVG */}
            {(!hasApiKey || error) && (
              <FallbackMap
                visibleRestaurants={visibleRestaurants}
                showZones={showZones}
                selectedId={selectedRestaurant?.id ?? null}
                onSelect={setSelectedRestaurant}
              />
            )}

            {/* Badge de ciudad */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-border flex items-center gap-1.5">
              <span className="text-base">🏙️</span>
              <span className="text-xs font-bold text-foreground">Ibagué, Tolima</span>
            </div>

            {/* Aviso sin API key */}
            {!hasApiKey && (
              <div className="absolute bottom-3 left-3 right-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Mapa de vista previa.</strong> Para activar Google Maps interactivo,
                  agrega <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> en tu <code className="bg-amber-100 px-1 rounded">.env.local</code>.
                </p>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-3">
            {/* Info restaurante seleccionado */}
            {selectedRestaurant ? (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: CATEGORY_MAP_COLORS[selectedRestaurant.category] }} />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-tight">
                        {selectedRestaurant.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedRestaurant.zone} · Ibagué</p>
                    </div>
                    <button onClick={() => setSelectedRestaurant(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="text-[10px] px-2 py-0 h-5 text-white border-0"
                      style={{ backgroundColor: CATEGORY_MAP_COLORS[selectedRestaurant.category] }}>
                      {CATEGORY_EMOJIS[selectedRestaurant.category]} {selectedRestaurant.categoryLabel}
                    </Badge>
                    <span className="text-xs font-bold text-amber-500">★ {selectedRestaurant.rating}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                      <span>{selectedRestaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span>~{selectedRestaurant.deliveryMin} min de entrega</span>
                    </div>
                    {selectedRestaurant.phone && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📞</span>
                        <span>{selectedRestaurant.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    {hasApiKey && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => calculateRoute(selectedRestaurant)}
                        className="flex-1 rounded-xl text-xs gap-1.5 h-8"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Ver ruta
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                      className="flex-1 rounded-xl text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 text-white"
                    >
                      Ver menú
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Cómo usar el mapa</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Haz clic en un marcador para ver el restaurante.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Usa los filtros para ver por categoría.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Activa "Zonas" para ver la cobertura de entrega.
                    </li>
                    {hasApiKey && (
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Usa "Mi ubicación" y luego "Ver ruta" para calcular la distancia.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Lista de restaurantes */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-3">
                <p className="text-xs font-bold text-foreground mb-2 px-1">
                  Restaurantes ({visibleRestaurants.length})
                </p>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {visibleRestaurants.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRestaurant(r);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.panTo(r.position);
                          mapInstanceRef.current.setZoom(15);
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all hover:bg-muted/50 ${
                        selectedRestaurant?.id === r.id ? 'bg-muted' : ''
                      }`}
                    >
                      <span className="text-base shrink-0">{CATEGORY_EMOJIS[r.category]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{r.shortName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{r.zone}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-amber-500">★ {r.rating}</p>
                        <p className="text-[10px] text-muted-foreground">{r.deliveryMin}m</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leyenda de zonas */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-3">
                <p className="text-xs font-bold text-foreground mb-2 px-1">Zonas de Ibagué</p>
                <div className="grid grid-cols-2 gap-1">
                  {MAP_ZONES.slice(0, 8).map(z => (
                    <div key={z.id} className="flex items-center gap-1.5 p-1">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                      <span className="text-[10px] text-muted-foreground truncate">{z.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nota */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Cobertura exclusiva en Ibagué.</strong>{' '}
            Sabor Tolima opera únicamente dentro de la ciudad de Ibagué como plataforma piloto para MIPYMES gastronómicas locales.
            Coordenadas: 4.4447°N, 75.2424°O.
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── FallbackMap — Mapa SVG cuando no hay API key ─────────────────────────────
function FallbackMap({
  visibleRestaurants,
  showZones,
  selectedId,
  onSelect,
}: {
  visibleRestaurants: MapRestaurant[];
  showZones: boolean;
  selectedId: string | null;
  onSelect: (r: MapRestaurant) => void;
}) {
  // Proyección simple: lat/lng → coordenadas SVG
  // Ibagué: lat 4.41–4.47, lng -75.26 a -75.19
  const LAT_MIN = 4.410, LAT_MAX = 4.475;
  const LNG_MIN = -75.265, LNG_MAX = -75.185;
  const W = 760, H = 500;

  const project = (lat: number, lng: number): [number, number] => {
    const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
    const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
    return [Math.round(x), Math.round(y)];
  };

  return (
    <div className="absolute inset-0 bg-[#f8f4ef] overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <pattern id="fbgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e8e0d8" strokeWidth="0.5"/>
          </pattern>
          <filter id="fshadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* Fondo */}
        <rect width={W} height={H} fill="url(#fbgrid)"/>

        {/* Río Combeima (simulado) */}
        <path d={`M${project(4.415,-75.255).join(',')} Q${project(4.430,-75.240).join(',')} ${project(4.445,-75.220).join(',')} T${project(4.460,-75.200).join(',')}`}
          fill="none" stroke="#c9e8f5" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>

        {/* Zonas */}
        {showZones && MAP_ZONES.map(zone => {
          const [cx, cy] = project(zone.center.lat, zone.center.lng);
          const rx = (zone.radius / 111000) / (LNG_MAX - LNG_MIN) * W;
          const ry = (zone.radius / 111000) / (LAT_MAX - LAT_MIN) * H;
          return (
            <g key={zone.id}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                fill={zone.color} fillOpacity={0.12}
                stroke={zone.color} strokeWidth={1.5} strokeOpacity={0.5}/>
              <text x={cx} y={cy + 3} textAnchor="middle" fontSize="9" fontWeight="700"
                fill={zone.color} opacity={0.8}>{zone.name}</text>
            </g>
          );
        })}

        {/* Marcadores de restaurantes */}
        {visibleRestaurants.map(r => {
          const [x, y] = project(r.position.lat, r.position.lng);
          const color = CATEGORY_MAP_COLORS[r.category] ?? '#c62828';
          const emoji = CATEGORY_EMOJIS[r.category] ?? '🍽️';
          const isSelected = selectedId === r.id;

          return (
            <g key={r.id} onClick={() => onSelect(r)} className="cursor-pointer">
              {isSelected && (
                <circle cx={x} cy={y} r="18" fill={color} opacity="0.2"/>
              )}
              {/* Pin */}
              <path
                d={`M${x},${y-20} C${x-10},${y-20} ${x-10},${y-8} ${x},${y} C${x+10},${y-8} ${x+10},${y-20} ${x},${y-20}Z`}
                fill={color} stroke="white" strokeWidth={isSelected ? 2 : 1.5}
                filter={isSelected ? 'url(#fshadow)' : undefined}
              />
              <circle cx={x} cy={y-14} r="7" fill="white" opacity="0.95"/>
              <text x={x} y={y-10} textAnchor="middle" fontSize="9">{emoji}</text>
              {/* Número */}
              <text x={x+10} y={y-22} textAnchor="middle" fontSize="7" fontWeight="800"
                fill={color} stroke="white" strokeWidth="2" paintOrder="stroke">
                {r.id}
              </text>
            </g>
          );
        })}

        {/* Título */}
        <text x={W/2} y="22" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="#7a3a1a" opacity="0.6">Ibagué, Tolima — Vista previa</text>

        {/* Brújula */}
        <g transform={`translate(${W-30},30)`}>
          <circle cx="0" cy="0" r="14" fill="white" opacity="0.9" stroke="#e0d8d0" strokeWidth="1"/>
          <text x="0" y="-4" textAnchor="middle" fontSize="8" fontWeight="800" fill="#c62828">N</text>
          <path d="M0,-10 L2.5,0 L0,3 L-2.5,0 Z" fill="#c62828"/>
          <path d="M0,10 L2.5,0 L0,-3 L-2.5,0 Z" fill="#9e9e9e"/>
        </g>

        {/* Escala */}
        <g transform={`translate(16,${H-20})`}>
          <line x1="0" y1="0" x2="60" y2="0" stroke="#7a3a1a" strokeWidth="1.5"/>
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#7a3a1a" strokeWidth="1.5"/>
          <line x1="60" y1="-3" x2="60" y2="3" stroke="#7a3a1a" strokeWidth="1.5"/>
          <text x="30" y="-5" textAnchor="middle" fontSize="8" fill="#7a3a1a">≈ 3 km</text>
        </g>
      </svg>
    </div>
  );
}
