/**
 * LeafletMap — Mapa interactivo de Ibagué con Leaflet + OpenStreetMap
 * 100% gratuito, sin API keys, sin billing.
 * Compatible con Vercel (CSR puro, sin SSR).
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin, Clock, Navigation, Filter, Truck,
  ChevronRight, X, Locate, Info, RefreshCw,
} from 'lucide-react';
import {
  MapContainer, TileLayer, CircleMarker, Circle,
  Popup, Polyline, useMap, Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
// Importación directa del CSS — necesaria para Vercel/producción
import 'leaflet/dist/leaflet.css';
import { Navbar } from '../components/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  MAP_ZONES, MAP_RESTAURANTS, CATEGORY_MAP_COLORS, CATEGORY_EMOJIS,
  IBAGUE_CENTER, type MapRestaurant,
} from '../data/mapData';

// ─── Fix icono por defecto de Leaflet (problema conocido con Vite) ────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Rutas simuladas de entrega ───────────────────────────────────────────────
const DELIVERY_ROUTES: Array<{
  id: string;
  from: [number, number];
  to: [number, number];
  waypoints?: [number, number][];
  distanceKm: number;
  estimatedMin: number;
  active: boolean;
}> = [
  {
    id: 'r1', from: [4.4392, -75.2318], to: [4.4355, -75.2385],
    waypoints: [[4.4375, -75.2350]],
    distanceKm: 0.9, estimatedMin: 12, active: true,
  },
  {
    id: 'r2', from: [4.4425, -75.2415], to: [4.4389, -75.2322],
    waypoints: [[4.4410, -75.2370]],
    distanceKm: 1.8, estimatedMin: 18, active: true,
  },
  {
    id: 'r3', from: [4.4392, -75.2318], to: [4.4498, -75.2205],
    waypoints: [[4.4440, -75.2260]],
    distanceKm: 2.5, estimatedMin: 22, active: true,
  },
  {
    id: 'r4', from: [4.4415, -75.2405], to: [4.4285, -75.2345],
    waypoints: [[4.4350, -75.2375]],
    distanceKm: 2.1, estimatedMin: 20, active: false,
  },
  {
    id: 'r5', from: [4.4505, -75.2195], to: [4.4558, -75.2108],
    waypoints: [[4.4530, -75.2150]],
    distanceKm: 1.6, estimatedMin: 15, active: false,
  },
];

// ─── Categorías ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',       label: 'Todos'     },
  { id: 'tipica',    label: 'Típica'    },
  { id: 'rapida',    label: 'Rápida'    },
  { id: 'saludable', label: 'Saludable' },
  { id: 'cafeteria', label: 'Cafetería' },
  { id: 'gourmet',   label: 'Gourmet'   },
  { id: 'ofertas',   label: 'Ofertas'   },
];

// ─── Componente para centrar el mapa en un punto ──────────────────────────────
function FlyTo({ position, zoom = 15 }: { position: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, zoom, { duration: 1.2 });
  }, [position, zoom, map]);
  return null;
}

// ─── Componente para ubicación del usuario ────────────────────────────────────
function UserLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;
  return (
    <CircleMarker
      center={position}
      radius={10}
      pathOptions={{ color: '#4285F4', fillColor: '#4285F4', fillOpacity: 1, weight: 3 }}
    >
      <Tooltip permanent direction="top" offset={[0, -12]}>
        <span className="text-xs font-semibold">📍 Tu ubicación</span>
      </Tooltip>
    </CircleMarker>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function LeafletMap() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<MapRestaurant | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const visibleRestaurants = filterCategory === 'all'
    ? MAP_RESTAURANTS
    : MAP_RESTAURANTS.filter(r => r.category === filterCategory);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setFlyTarget(loc);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { timeout: 8000 }
    );
  };

  const handleSelectRestaurant = (r: MapRestaurant) => {
    setSelectedRestaurant(r);
    setFlyTarget([r.position.lat, r.position.lng]);
  };

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
              <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] px-2">
                OpenStreetMap · Gratuito
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {visibleRestaurants.length} restaurantes · 11 zonas · Ibagué, Tolima
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
            <button
              onClick={() => setShowRoutes(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showRoutes ? 'bg-accent text-white border-accent' : 'bg-white text-muted-foreground border-border'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Rutas
            </button>
            <button
              onClick={handleLocate}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-white text-muted-foreground hover:border-primary/30 transition-all disabled:opacity-50"
            >
              {isLocating
                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                : <Locate className="w-3.5 h-3.5" />}
              Mi ubicación
            </button>
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

        {/* Mapa + Panel */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">

          {/* Mapa Leaflet */}
          <div
            className="rounded-2xl overflow-hidden border border-border shadow-sm"
            style={{ height: '520px', minHeight: '520px' }}
          >
            <MapContainer
              center={[IBAGUE_CENTER.lat, IBAGUE_CENTER.lng]}
              zoom={13}
              style={{ height: '520px', width: '100%' }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              {/* Tiles OpenStreetMap */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              {/* Fly to target */}
              {flyTarget && <FlyTo position={flyTarget} zoom={15} />}

              {/* Zonas de cobertura */}
              {showZones && MAP_ZONES.map(zone => (
                <Circle
                  key={zone.id}
                  center={[zone.center.lat, zone.center.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.12,
                    weight: 1.5,
                    opacity: 0.6,
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs font-semibold">{zone.name}</div>
                    <div className="text-xs text-gray-500">~{zone.avgDeliveryMin} min · {zone.distanceKm} km</div>
                  </Tooltip>
                </Circle>
              ))}

              {/* Rutas de entrega */}
              {showRoutes && DELIVERY_ROUTES.map(route => {
                const points: [number, number][] = [
                  route.from,
                  ...(route.waypoints ?? []),
                  route.to,
                ];
                return (
                  <Polyline
                    key={route.id}
                    positions={points}
                    pathOptions={{
                      color: route.active ? '#c62828' : '#9e9e9e',
                      weight: route.active ? 3 : 2,
                      opacity: route.active ? 0.8 : 0.4,
                      dashArray: route.active ? undefined : '6,6',
                    }}
                  >
                    <Tooltip sticky>
                      <div className="text-xs font-semibold">
                        {route.active ? '🚴 Ruta activa' : 'Ruta disponible'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route.distanceKm} km · ~{route.estimatedMin} min
                      </div>
                    </Tooltip>
                  </Polyline>
                );
              })}

              {/* Marcadores de restaurantes */}
              {visibleRestaurants.map(restaurant => {
                const color = CATEGORY_MAP_COLORS[restaurant.category] ?? '#c62828';
                const emoji = CATEGORY_EMOJIS[restaurant.category] ?? '🍽️';
                const isSelected = selectedRestaurant?.id === restaurant.id;

                return (
                  <CircleMarker
                    key={restaurant.id}
                    center={[restaurant.position.lat, restaurant.position.lng]}
                    radius={isSelected ? 14 : 10}
                    pathOptions={{
                      color: 'white',
                      fillColor: color,
                      fillOpacity: 1,
                      weight: isSelected ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => handleSelectRestaurant(restaurant),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -12]} permanent={isSelected}>
                      <span className="text-xs font-semibold">
                        {emoji} {restaurant.shortName}
                      </span>
                    </Tooltip>
                    <Popup>
                      <div style={{ minWidth: 200, fontFamily: 'system-ui, sans-serif' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#1a1a1a' }}>
                          {restaurant.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <span style={{
                            background: color, color: 'white',
                            padding: '2px 8px', borderRadius: 20,
                            fontSize: 11, fontWeight: 600,
                          }}>
                            {emoji} {restaurant.categoryLabel}
                          </span>
                          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12 }}>
                            ★ {restaurant.rating}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>
                          📍 {restaurant.address}
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>
                          ⏱️ ~{restaurant.deliveryMin} min · {restaurant.zone}
                        </div>
                        <button
                          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                          style={{
                            width: '100%', padding: '6px 0',
                            background: color, color: 'white',
                            border: 'none', borderRadius: 8,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          Ver menú →
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Marcador de usuario */}
              <UserLocationMarker position={userLocation} />
            </MapContainer>
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedRestaurant.zone} · Ibagué
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className="text-[10px] px-2 py-0 h-5 text-white border-0"
                      style={{ backgroundColor: CATEGORY_MAP_COLORS[selectedRestaurant.category] }}
                    >
                      {CATEGORY_EMOJIS[selectedRestaurant.category]} {selectedRestaurant.categoryLabel}
                    </Badge>
                    <span className="text-xs font-bold text-amber-500">
                      ★ {selectedRestaurant.rating}
                    </span>
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
                        <span>📞</span>
                        <span>{selectedRestaurant.phone}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                    className="w-full rounded-xl text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 text-white"
                  >
                    Ver menú completo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
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
                      Haz clic en un marcador de color para ver el restaurante.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Usa los filtros para ver por categoría gastronómica.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Activa "Zonas" para ver la cobertura de entrega por barrio.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Activa "Rutas" para ver las rutas de entrega activas.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      Usa "Mi ubicación" para centrar el mapa en tu posición.
                    </li>
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
                <div className="space-y-0.5 max-h-64 overflow-y-auto">
                  {visibleRestaurants.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRestaurant(r)}
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
                <p className="text-xs font-bold text-foreground mb-2 px-1">
                  Zonas de cobertura
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {MAP_ZONES.map(z => (
                    <div key={z.id} className="flex items-center gap-1.5 p-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: z.color }}
                      />
                      <span className="text-[10px] text-muted-foreground truncate">{z.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-3">
                <p className="text-xs font-bold text-foreground mb-2 px-1">Logística Ibagué</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Restaurantes', value: '22', icon: '🏪' },
                    { label: 'Zonas',        value: '11', icon: '📍' },
                    { label: 'Entrega prom.', value: '27m', icon: '⏱️' },
                    { label: 'Cobertura',    value: '5km', icon: '🗺️' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-muted/50 rounded-xl p-2 text-center">
                      <p className="text-base">{icon}</p>
                      <p className="text-sm font-bold text-foreground">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
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
            <strong className="text-foreground">Mapa OpenStreetMap · Cobertura exclusiva en Ibagué.</strong>{' '}
            Datos cartográficos © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenStreetMap contributors</a>.
            Sabor Tolima opera únicamente dentro de Ibagué, Tolima, Colombia (4.4447°N, 75.2424°O).
          </p>
        </div>
      </main>
    </div>
  );
}
