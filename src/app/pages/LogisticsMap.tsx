/**
 * LogisticsMap — Mapa logístico de Ibagué
 * Visualiza zonas, restaurantes, rutas y tiempos de entrega dentro de la ciudad.
 */
import { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, Zap, TrendingUp, Navigation, Info } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  ZONES, RESTAURANT_POINTS, LOGISTIC_ROUTES, LOGISTIC_STATS,
  CATEGORY_COLORS, DEMAND_COLORS,
  type Zone, type RestaurantPoint,
} from '../data/logistics';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function polygonPoints(poly: [number, number][]): string {
  return poly.map(([x, y]) => `${x},${y}`).join(' ');
}

function pathD(pts: [number, number][]): string {
  if (pts.length === 0) return '';
  const [first, ...rest] = pts;
  return `M${first[0]},${first[1]} ` + rest.map(([x, y]) => `L${x},${y}`).join(' ');
}

const CATEGORY_LABELS: Record<string, string> = {
  tipica: 'Típica', rapida: 'Rápida', saludable: 'Saludable',
  cafeteria: 'Cafetería', gourmet: 'Gourmet', ofertas: 'Ofertas',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Zone Info Panel ──────────────────────────────────────────────────────────
function ZonePanel({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const restaurants = RESTAURANT_POINTS.filter(r => zone.restaurantIds.includes(r.id));
  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in slide-in-from-right-4 duration-200">
      <div className="h-2" style={{ backgroundColor: zone.color }} />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">{zone.name}</h3>
            <p className="text-xs text-muted-foreground">Ibagué, Tolima</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">{zone.avgDeliveryMin} min</p>
            <p className="text-[11px] text-muted-foreground">Entrega promedio</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">{zone.distanceKm} km</p>
            <p className="text-[11px] text-muted-foreground">Desde el centro</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Demanda:</span>
          <Badge
            className="text-[10px] px-2 py-0 h-5 text-white"
            style={{ backgroundColor: DEMAND_COLORS[zone.demand] }}
          >
            {zone.demand.charAt(0).toUpperCase() + zone.demand.slice(1)}
          </Badge>
        </div>

        {restaurants.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-foreground mb-1.5">
              Restaurantes en esta zona ({restaurants.length})
            </p>
            <div className="space-y-1">
              {restaurants.map(r => (
                <div key={r.id} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[r.category] }} />
                  <span className="text-foreground truncate">{r.name}</span>
                  <span className="text-muted-foreground ml-auto shrink-0">{CATEGORY_LABELS[r.category]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Restaurant Tooltip ───────────────────────────────────────────────────────
function RestaurantTooltip({ point }: { point: RestaurantPoint }) {
  const zone = ZONES.find(z => z.id === point.zoneId);
  return (
    <div className="absolute z-20 bg-white border border-border rounded-xl shadow-xl p-3 w-52 pointer-events-none"
      style={{ left: point.x + 12, top: point.y - 20 }}>
      <p className="text-xs font-bold text-foreground">{point.name}</p>
      <p className="text-[11px] text-muted-foreground">{zone?.name ?? ''} · Ibagué</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[point.category] }} />
        <span className="text-[11px] text-muted-foreground">{CATEGORY_LABELS[point.category]}</span>
        {zone && (
          <span className="ml-auto text-[11px] font-semibold text-foreground">{zone.avgDeliveryMin} min</span>
        )}
      </div>
    </div>
  );
}

// ─── SVG Map ──────────────────────────────────────────────────────────────────
function IbaguéMap({
  selectedZone, hoveredRestaurant, showRoutes, filterCategory,
  onZoneClick, onRestaurantHover,
}: {
  selectedZone: string | null;
  hoveredRestaurant: string | null;
  showRoutes: boolean;
  filterCategory: string;
  onZoneClick: (id: string) => void;
  onRestaurantHover: (id: string | null) => void;
}) {
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimOffset(p => (p + 1) % 20), 80);
    return () => clearInterval(id);
  }, []);

  const visibleRestaurants = filterCategory === 'all'
    ? RESTAURANT_POINTS
    : RESTAURANT_POINTS.filter(r => r.category === filterCategory);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 800 600"
        className="w-full rounded-2xl border border-border bg-[#f8f4ef]"
        style={{ maxHeight: 520 }}
      >
        {/* Grid de fondo */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e8e0d8" strokeWidth="0.5"/>
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#c62828" opacity="0.7"/>
          </marker>
        </defs>
        <rect width="800" height="600" fill="url(#grid)"/>

        {/* Título del mapa */}
        <text x="400" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7a3a1a" opacity="0.6">
          Ibagué, Tolima — Mapa Logístico
        </text>

        {/* Zonas */}
        {ZONES.map(zone => {
          const isSelected = selectedZone === zone.id;
          const opacity = selectedZone && !isSelected ? 0.25 : 0.55;
          return (
            <g key={zone.id} onClick={() => onZoneClick(zone.id)} className="cursor-pointer">
              <polygon
                points={polygonPoints(zone.polygon)}
                fill={zone.color}
                fillOpacity={opacity}
                stroke={zone.color}
                strokeWidth={isSelected ? 2.5 : 1}
                strokeOpacity={0.8}
                filter={isSelected ? 'url(#shadow)' : undefined}
              />
              {/* Etiqueta de zona */}
              {(() => {
                const cx = zone.polygon.reduce((s,[x])=>s+x,0)/zone.polygon.length;
                const cy = zone.polygon.reduce((s,[,y])=>s+y,0)/zone.polygon.length;
                return (
                  <g>
                    <text x={cx} y={cy-4} textAnchor="middle" fontSize="9" fontWeight="700"
                      fill="white" stroke={zone.color} strokeWidth="3" paintOrder="stroke">
                      {zone.name}
                    </text>
                    <text x={cx} y={cy+8} textAnchor="middle" fontSize="8" fill="white" opacity="0.9">
                      {zone.avgDeliveryMin} min
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* Rutas logísticas */}
        {showRoutes && LOGISTIC_ROUTES.map(route => (
          <g key={route.id}>
            <path
              d={pathD(route.path)}
              fill="none"
              stroke={route.active ? '#c62828' : '#9e9e9e'}
              strokeWidth={route.active ? 2 : 1.5}
              strokeDasharray={route.active ? '8,4' : '4,4'}
              strokeDashoffset={route.active ? -animOffset : 0}
              opacity={route.active ? 0.8 : 0.4}
              markerEnd={route.active ? 'url(#arrow)' : undefined}
            />
            {/* Etiqueta de distancia en el punto medio */}
            {(() => {
              const mid = Math.floor(route.path.length / 2);
              const [mx, my] = route.path[mid];
              return route.active ? (
                <g>
                  <rect x={mx-14} y={my-9} width="28" height="14" rx="4" fill="white" opacity="0.9"/>
                  <text x={mx} y={my+1} textAnchor="middle" fontSize="8" fontWeight="700" fill="#c62828">
                    {route.distanceKm}km
                  </text>
                </g>
              ) : null;
            })()}
          </g>
        ))}

        {/* Puntos de restaurantes */}
        {visibleRestaurants.map(point => {
          const isHovered = hoveredRestaurant === point.id;
          const color = CATEGORY_COLORS[point.category];
          return (
            <g
              key={point.id}
              onMouseEnter={() => onRestaurantHover(point.id)}
              onMouseLeave={() => onRestaurantHover(null)}
              className="cursor-pointer"
            >
              {/* Halo de selección */}
              {isHovered && (
                <circle cx={point.x} cy={point.y} r="14" fill={color} opacity="0.2"/>
              )}
              {/* Pin */}
              <circle cx={point.x} cy={point.y} r={isHovered ? 8 : 6}
                fill={color} stroke="white" strokeWidth="2"
                filter={isHovered ? 'url(#shadow)' : undefined}
              />
              {/* Número */}
              <text x={point.x} y={point.y+3.5} textAnchor="middle"
                fontSize="7" fontWeight="800" fill="white">
                {point.id}
              </text>
              {/* Etiqueta */}
              {isHovered && (
                <text x={point.x} y={point.y-14} textAnchor="middle"
                  fontSize="9" fontWeight="700" fill={color}
                  stroke="white" strokeWidth="2.5" paintOrder="stroke">
                  {point.shortName}
                </text>
              )}
            </g>
          );
        })}

        {/* Leyenda */}
        <g transform="translate(16, 520)">
          <rect x="0" y="0" width="200" height="68" rx="8" fill="white" opacity="0.92"/>
          <text x="8" y="14" fontSize="9" fontWeight="700" fill="#7a3a1a">Categorías</text>
          {Object.entries(CATEGORY_COLORS).map(([cat, color], i) => (
            <g key={cat} transform={`translate(${(i % 3) * 66 + 8}, ${Math.floor(i / 3) * 18 + 20})`}>
              <circle cx="5" cy="5" r="4" fill={color}/>
              <text x="12" y="9" fontSize="8" fill="#555">{CATEGORY_LABELS[cat]}</text>
            </g>
          ))}
        </g>

        {/* Escala */}
        <g transform="translate(660, 560)">
          <line x1="0" y1="0" x2="80" y2="0" stroke="#7a3a1a" strokeWidth="1.5"/>
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#7a3a1a" strokeWidth="1.5"/>
          <line x1="80" y1="-4" x2="80" y2="4" stroke="#7a3a1a" strokeWidth="1.5"/>
          <text x="40" y="-6" textAnchor="middle" fontSize="8" fill="#7a3a1a">≈ 5 km</text>
        </g>

        {/* Brújula */}
        <g transform="translate(750, 50)">
          <circle cx="0" cy="0" r="16" fill="white" opacity="0.9" stroke="#e0d8d0" strokeWidth="1"/>
          <text x="0" y="-6" textAnchor="middle" fontSize="9" fontWeight="800" fill="#c62828">N</text>
          <path d="M0,-12 L3,0 L0,4 L-3,0 Z" fill="#c62828"/>
          <path d="M0,12 L3,0 L0,-4 L-3,0 Z" fill="#9e9e9e"/>
        </g>
      </svg>

      {/* Tooltip flotante */}
      {hoveredRestaurant && (() => {
        const pt = RESTAURANT_POINTS.find(r => r.id === hoveredRestaurant);
        return pt ? <RestaurantTooltip point={pt} /> : null;
      })()}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LogisticsMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleZoneClick = (id: string) => {
    setSelectedZone(prev => prev === id ? null : id);
  };

  const selectedZoneData = selectedZone ? ZONES.find(z => z.id === selectedZone) ?? null : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Mapa Logístico — Ibagué</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Cobertura de entregas dentro de la ciudad. 11 zonas · 22 restaurantes activos.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowRoutes(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showRoutes
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              {showRoutes ? 'Rutas activas' : 'Mostrar rutas'}
            </button>
            <button
              onClick={() => { setSelectedZone(null); setFilterCategory('all'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-white text-muted-foreground hover:border-primary/30 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={MapPin}     label="Restaurantes"    value={LOGISTIC_STATS.totalRestaurants} sub="en Ibagué"         color="#c62828" />
          <StatCard icon={Navigation} label="Zonas activas"   value={LOGISTIC_STATS.zonesActive}      sub="dentro de la ciudad" color="#e65100" />
          <StatCard icon={Clock}      label="Entrega promedio" value={`${LOGISTIC_STATS.avgDeliveryMin} min`} sub="en toda la ciudad" color="#f57f17" />
          <StatCard icon={Truck}      label="Cobertura máx."  value={`${LOGISTIC_STATS.maxCoverageKm} km`}   sub="radio desde el centro" color="#2e7d32" />
          <StatCard icon={TrendingUp} label="Pedidos hoy"     value={LOGISTIC_STATS.ordersToday}      sub="estimados"         color="#4a148c" />
          <StatCard icon={Zap}        label="Rutas activas"   value={LOGISTIC_STATS.activeRoutes}     sub="en este momento"   color="#006064" />
        </div>

        {/* Filtro por categoría */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground">Filtrar:</span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'tipica',    label: 'Típica'    },
            { id: 'rapida',    label: 'Rápida'    },
            { id: 'saludable', label: 'Saludable' },
            { id: 'cafeteria', label: 'Cafetería' },
            { id: 'gourmet',   label: 'Gourmet'   },
            { id: 'ofertas',   label: 'Ofertas'   },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilterCategory(id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filterCategory === id
                  ? 'text-white border-transparent'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/30'
              }`}
              style={filterCategory === id ? {
                backgroundColor: id === 'all' ? '#c62828' : CATEGORY_COLORS[id],
                borderColor: id === 'all' ? '#c62828' : CATEGORY_COLORS[id],
              } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mapa + Panel lateral */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
          <IbaguéMap
            selectedZone={selectedZone}
            hoveredRestaurant={hoveredRestaurant}
            showRoutes={showRoutes}
            filterCategory={filterCategory}
            onZoneClick={handleZoneClick}
            onRestaurantHover={setHoveredRestaurant}
          />

          {/* Panel lateral */}
          <div className="space-y-4">
            {selectedZoneData ? (
              <ZonePanel zone={selectedZoneData} onClose={() => setSelectedZone(null)} />
            ) : (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Cómo usar el mapa</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/>
                      Haz clic en una zona para ver sus detalles y restaurantes.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/>
                      Pasa el cursor sobre un punto numerado para ver el restaurante.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/>
                      Las líneas punteadas rojas son rutas de entrega activas.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/>
                      Usa los filtros para ver restaurantes por categoría.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tabla de zonas */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <p className="text-sm font-bold text-foreground mb-3">Tiempos por zona</p>
                <div className="space-y-2">
                  {ZONES.sort((a,b) => a.avgDeliveryMin - b.avgDeliveryMin).map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneClick(zone.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left transition-all hover:bg-muted/50 ${
                        selectedZone === zone.id ? 'bg-muted' : ''
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: zone.color }}/>
                      <span className="text-xs font-medium text-foreground flex-1 truncate">{zone.name}</span>
                      <span className="text-xs font-bold text-foreground shrink-0">{zone.avgDeliveryMin} min</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{zone.distanceKm} km</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demanda */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <p className="text-sm font-bold text-foreground mb-3">Demanda por zona</p>
                <div className="space-y-1.5">
                  {(['alta','media','baja'] as const).map(level => {
                    const count = ZONES.filter(z => z.demand === level).length;
                    const pct = Math.round((count / ZONES.length) * 100);
                    return (
                      <div key={level} className="flex items-center gap-2">
                        <span className="text-xs capitalize text-muted-foreground w-10">{level}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: DEMAND_COLORS[level] }}/>
                        </div>
                        <span className="text-xs font-bold text-foreground w-4 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Cobertura exclusiva en Ibagué.</strong>{' '}
            Sabor Tolima opera únicamente dentro de la ciudad de Ibagué como plataforma piloto.
            Las zonas, tiempos y rutas mostrados corresponden a la logística real de la ciudad.
            Los tiempos de entrega son estimados y pueden variar según tráfico y demanda.
          </p>
        </div>

      </main>
    </div>
  );
}
