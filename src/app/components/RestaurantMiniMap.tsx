/**
 * RestaurantMiniMap — Mini mapa de ubicación del restaurante con Leaflet
 * 100% gratuito, OpenStreetMap, sin API keys.
 */
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ExternalLink } from 'lucide-react';
import { MAP_RESTAURANTS, CATEGORY_MAP_COLORS } from '../data/mapData';

interface RestaurantMiniMapProps {
  restaurantId: string;
  restaurantName: string;
  address: string;
}

export function RestaurantMiniMap({ restaurantId, restaurantName, address }: RestaurantMiniMapProps) {
  const navigate = useNavigate();

  const mapData = MAP_RESTAURANTS.find(r => r.id === restaurantId);
  const lat = mapData?.position.lat ?? 4.4447;
  const lng = mapData?.position.lng ?? -75.2424;
  const zone = mapData?.zone ?? 'Ibagué';
  const color = mapData ? (CATEGORY_MAP_COLORS[mapData.category] ?? '#c62828') : '#c62828';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ', Ibagué, Tolima')}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      {/* Mini mapa Leaflet */}
      <div className="relative" style={{ height: '144px' }}>
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: '144px', width: '100%' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <CircleMarker
            center={[lat, lng]}
            radius={12}
            pathOptions={{
              color: 'white',
              fillColor: color,
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -14]}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>
                {restaurantName.length > 20 ? restaurantName.slice(0, 20) + '…' : restaurantName}
              </span>
            </Tooltip>
          </CircleMarker>
        </MapContainer>

        {/* Botón ver mapa completo */}
        <button
          onClick={() => navigate('/map')}
          className="absolute top-2 right-2 z-[400] bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-semibold text-foreground flex items-center gap-1 shadow-sm hover:bg-white transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Ver mapa
        </button>
      </div>

      {/* Dirección */}
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
