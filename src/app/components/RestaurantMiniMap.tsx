/**
 * RestaurantMiniMap — Mini mapa de ubicación del restaurante
 *
 * Muestra la ubicación del restaurante en Ibagué.
 * - Con API key: Google Maps estático embebido (iframe)
 * - Sin API key: SVG de ubicación con coordenadas reales
 *
 * Usa Google Maps Static API (no requiere JS, solo una URL de imagen)
 * que es más simple y estable que la Maps JS API para un mini-mapa.
 */
import { useNavigate } from 'react-router';
import { MapPin, ExternalLink } from 'lucide-react';
import { MAP_RESTAURANTS } from '../data/mapData';

interface RestaurantMiniMapProps {
  restaurantId: string;
  restaurantName: string;
  address: string;
}

export function RestaurantMiniMap({ restaurantId, restaurantName, address }: RestaurantMiniMapProps) {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const hasApiKey = Boolean(apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && apiKey.length > 10);

  // Buscar coordenadas reales del restaurante
  const mapData = MAP_RESTAURANTS.find(r => r.id === restaurantId);
  const lat = mapData?.position.lat ?? 4.4447;
  const lng = mapData?.position.lng ?? -75.2424;
  const zone = mapData?.zone ?? 'Ibagué';

  // URL de Google Maps Static API (imagen estática, sin JS)
  const staticMapUrl = hasApiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x200&scale=2&maptype=roadmap&markers=color:red%7C${lat},${lng}&style=feature:poi%7Cvisibility:off&key=${apiKey}`
    : null;

  // URL para abrir en Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ', Ibagué, Tolima')}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      {/* Mapa */}
      <div className="relative h-36 bg-[#f8f4ef]">
        {staticMapUrl ? (
          <img
            src={staticMapUrl}
            alt={`Ubicación de ${restaurantName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <FallbackMiniMap lat={lat} lng={lng} name={restaurantName} />
        )}

        {/* Pin overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!staticMapUrl && (
            <div className="w-8 h-8 bg-primary rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Botón ver en mapa completo */}
        <button
          onClick={() => navigate('/map')}
          className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-semibold text-foreground flex items-center gap-1 shadow-sm hover:bg-white transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Ver mapa
        </button>
      </div>

      {/* Info de dirección */}
      <div className="p-3 bg-white flex items-start gap-2">
        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{address}</p>
          <p className="text-[11px] text-muted-foreground">{zone} · Ibagué, Tolima</p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-primary font-semibold hover:text-primary/80 shrink-0"
        >
          Cómo llegar
        </a>
      </div>
    </div>
  );
}

// ─── Fallback SVG cuando no hay API key ───────────────────────────────────────
function FallbackMiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  // Proyección simple para el mini-mapa
  const LAT_MIN = 4.410, LAT_MAX = 4.475;
  const LNG_MIN = -75.265, LNG_MAX = -75.185;
  const W = 600, H = 200;

  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <pattern id="mmgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e0d8" strokeWidth="0.5"/>
        </pattern>
        <radialGradient id="mmglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c62828" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#c62828" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#mmgrid)"/>

      {/* Calles simuladas */}
      <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="#f5f1eb" strokeWidth="6"/>
      <line x1={W/2} y1="0" x2={W/2} y2={H} stroke="#f5f1eb" strokeWidth="4"/>
      <line x1="0" y1={H*0.3} x2={W} y2={H*0.3} stroke="#ffecd2" strokeWidth="3"/>
      <line x1="0" y1={H*0.7} x2={W} y2={H*0.7} stroke="#ffecd2" strokeWidth="3"/>
      <line x1={W*0.3} y1="0" x2={W*0.3} y2={H} stroke="#ffecd2" strokeWidth="3"/>
      <line x1={W*0.7} y1="0" x2={W*0.7} y2={H} stroke="#ffecd2" strokeWidth="3"/>

      {/* Halo */}
      <circle cx={x} cy={y} r="40" fill="url(#mmglow)"/>
      <circle cx={x} cy={y} r="20" fill="#c62828" opacity="0.1"/>

      {/* Pin */}
      <path
        d={`M${x},${y+2} C${x-8},${y+2} ${x-8},${y-10} ${x},${y-16} C${x+8},${y-10} ${x+8},${y+2} ${x},${y+2}Z`}
        fill="#c62828" stroke="white" strokeWidth="1.5"
      />
      <circle cx={x} cy={y-10} r="4" fill="white"/>

      {/* Etiqueta */}
      <rect x={x-50} y={y-38} width="100" height="18" rx="4" fill="white" opacity="0.95"/>
      <text x={x} y={y-26} textAnchor="middle" fontSize="9" fontWeight="700" fill="#c62828">
        {name.length > 18 ? name.slice(0, 18) + '…' : name}
      </text>

      {/* Coordenadas */}
      <text x={W-4} y={H-4} textAnchor="end" fontSize="7" fill="#9e9e9e">
        {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°O
      </text>
    </svg>
  );
}
