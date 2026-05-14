import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Heart, Flame, ChevronRight, Map } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { RestaurantCard } from '../components/RestaurantCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { HeroSection } from '../components/HeroSection';
import { Button } from '../components/ui/button';
import {
  getRestaurantsByCategory,
  searchRestaurants,
  getTopRestaurants,
  getRestaurantsWithDiscounts,
  restaurants,
} from '../data/restaurants';
import { useFavoritesStore } from '../store/useFavoritesStore';
import type { Category } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const { restaurantIds: favoriteIds } = useFavoritesStore();

  // Sync URL with search
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Filtered results
  const filteredRestaurants = useMemo(() => {
    let results = selectedCategory
      ? getRestaurantsByCategory(selectedCategory)
      : restaurants;

    if (searchQuery.trim()) {
      const searched = searchRestaurants(searchQuery);
      results = selectedCategory
        ? searched.filter((r) => r.categories.includes(selectedCategory))
        : searched;
    }

    return results;
  }, [selectedCategory, searchQuery]);

  const isFiltering = Boolean(selectedCategory || searchQuery.trim());

  // Home sections data
  const topRestaurants = useMemo(() => getTopRestaurants(6), []);
  const discountRestaurants = useMemo(() => getRestaurantsWithDiscounts().slice(0, 3), []);
  const favoriteRestaurants = useMemo(
    () => restaurants.filter((r) => favoriteIds.includes(r.id)).slice(0, 3),
    [favoriteIds]
  );

  const categoryLabel: Record<Category, string> = {
    tipica: '🍲 Gastronomía Típica',
    rapida: '🍔 Comida Rápida',
    saludable: '🥗 Comida Saludable',
    cafeteria: '☕ Cafeterías',
    gourmet: '✨ Gourmet',
    ofertas: '🔥 Ofertas',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Hero */}
        <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />

        {/* Banner mapa de Ibagué */}
        <button
          onClick={() => navigate('/map')}
          className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#1a0a00] to-[#3d1200] rounded-2xl text-left hover:opacity-95 transition-opacity group"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Mapa de restaurantes en Ibagué</p>
            <p className="text-xs text-white/60 mt-0.5">
              22 restaurantes · 11 zonas · Rutas de entrega en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-1 text-white/70 shrink-0">
            <span className="text-xs font-semibold hidden sm:block">Ver mapa</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Categories */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* ── Filtered / Search Results ── */}
        {isFiltering && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {selectedCategory ? categoryLabel[selectedCategory] : `Resultados para "${searchQuery}"`}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {filteredRestaurants.length} resultados
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="text-primary hover:text-primary/80 text-sm rounded-xl"
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map((r) => (
                  <RestaurantCard key={r.id} {...r} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Sin resultados
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Intenta con otra búsqueda o explora las categorías
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="rounded-xl"
                >
                  Ver todos los restaurantes
                </Button>
              </div>
            )}
          </section>
        )}

        {/* ── Home Sections (no filter active) ── */}
        {!isFiltering && (
          <>
            {/* Ofertas destacadas */}
            {discountRestaurants.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Ofertas del día</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory('ofertas')}
                    className="text-primary text-sm gap-1 rounded-xl"
                  >
                    Ver todas <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {discountRestaurants.map((r) => (
                    <RestaurantCard key={r.id} {...r} />
                  ))}
                </div>
              </section>
            )}

            {/* Favoritos */}
            {favoriteRestaurants.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    <h2 className="text-lg font-bold text-foreground">Tus favoritos</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/favorites')}
                    className="text-primary text-sm gap-1 rounded-xl"
                  >
                    Ver todos <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favoriteRestaurants.map((r) => (
                    <RestaurantCard key={r.id} {...r} />
                  ))}
                </div>
              </section>
            )}

            {/* Top Restaurants */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Restaurantes destacados</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {restaurants.length} disponibles
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topRestaurants.map((r) => (
                  <RestaurantCard key={r.id} {...r} />
                ))}
              </div>

              {/* Load more */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/?all=true')}
                  className="rounded-xl px-8 border-border hover:border-primary hover:text-primary"
                >
                  Ver todos los restaurantes
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer simple */}
      <footer className="border-t border-border mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Sabor Tolima · Marketplace Gastronómico · Ibagué, Colombia
          </p>
        </div>
      </footer>
    </div>
  );
}
