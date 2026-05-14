import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Compass } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { RestaurantCard } from '../components/RestaurantCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { restaurants } from '../data/restaurants';
import { getMenuByRestaurant } from '../data/menu';
import { SafeImage } from '../components/SafeImage';

export default function Favorites() {
  const navigate = useNavigate();
  const { restaurantIds, menuItemIds, toggleRestaurant, toggleMenuItem } = useFavoritesStore();

  const favoriteRestaurants = useMemo(
    () => restaurants.filter((r) => restaurantIds.includes(r.id)),
    [restaurantIds]
  );

  const favoriteMenuItems = useMemo(() => {
    const allItems = restaurants.flatMap((r) => getMenuByRestaurant(r.id));
    return allItems.filter((item) => menuItemIds.includes(item.id));
  }, [menuItemIds]);

  const totalFavorites = restaurantIds.length + menuItemIds.length;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mis Favoritos</h1>
            <p className="text-sm text-muted-foreground">
              {totalFavorites === 0
                ? 'Aún no tienes favoritos'
                : `${totalFavorites} guardados`}
            </p>
          </div>
        </div>

        {totalFavorites === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Aún no tienes favoritos
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
              Guarda tus restaurantes y platos favoritos para encontrarlos fácilmente
            </p>
            <Button
              onClick={() => navigate('/')}
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white"
            >
              <Compass className="w-4 h-4" />
              Explorar restaurantes
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="restaurants">
            <TabsList className="w-full h-11 bg-white border border-border rounded-2xl mb-6">
              <TabsTrigger value="restaurants" className="flex-1 rounded-xl text-sm">
                Restaurantes
                {restaurantIds.length > 0 && (
                  <span className="ml-1.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {restaurantIds.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="dishes" className="flex-1 rounded-xl text-sm">
                Platos
                {menuItemIds.length > 0 && (
                  <span className="ml-1.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {menuItemIds.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Restaurants tab */}
            <TabsContent value="restaurants">
              {favoriteRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🏪</div>
                  <p className="text-muted-foreground text-sm">
                    No tienes restaurantes favoritos aún
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="mt-4 rounded-xl"
                  >
                    Explorar restaurantes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favoriteRestaurants.map((r) => (
                    <RestaurantCard key={r.id} {...r} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Dishes tab */}
            <TabsContent value="dishes">
              {favoriteMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🍽️</div>
                  <p className="text-muted-foreground text-sm">
                    No tienes platos favoritos aún
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Guarda platos desde el menú de cada restaurante
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteMenuItems.map((item) => {
                    const restaurant = restaurants.find((r) => r.id === item.restaurantId);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden flex hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          type="product"
                          className="w-24 h-24 object-cover shrink-0"
                        />
                        <div className="flex-1 p-3 min-w-0">
                          <p className="text-xs text-primary font-semibold mb-0.5 truncate">
                            {restaurant?.name}
                          </p>
                          <h3 className="text-sm font-bold text-foreground line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-primary">
                              ${item.price.toLocaleString()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenuItem(item.id);
                              }}
                              className="p-1.5 rounded-full hover:bg-muted transition-colors"
                            >
                              <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
