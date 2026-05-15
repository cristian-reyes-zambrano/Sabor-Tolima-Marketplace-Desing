import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Star, Clock, MapPin, BadgeCheck, Heart, Share2,
  ShoppingCart, Award, CreditCard, Phone, Bike, Plus, Minus,
  Flame, Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ReviewSection } from '../components/reviews/ReviewSection';
import { RestaurantMiniMap } from '../components/RestaurantMiniMap';
import { getRestaurantById } from '../data/restaurants';
import { getMenuByRestaurant } from '../data/menu';
import { useCartStore } from '../store/useCartStore';
import { SafeImage } from '../components/SafeImage';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/auth/AuthModal';
import { toast } from 'sonner';
import type { MenuItem, MenuCategory } from '../types';

const MENU_CATEGORIES: { id: MenuCategory; label: string; emoji: string }[] = [  { id: 'recomendados', label: 'Recomendados', emoji: '⭐' },
  { id: 'combos', label: 'Combos', emoji: '🎁' },
  { id: 'principales', label: 'Platos Fuertes', emoji: '🍽️' },
  { id: 'entradas', label: 'Entradas', emoji: '🥗' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { id: 'postres', label: 'Postres', emoji: '🍰' },
];




function MenuItemCard({
  item,
  restaurantId,
  restaurantName,
}: {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}) {
  const { addItem, getItemQuantity, items, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const quantity = getItemQuantity(item.id);

  const finalPrice = item.discount
    ? Math.round(item.price * (1 - item.discount / 100))
    : item.price;

  const handleAdd = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addItem(item, restaurantId, restaurantName);
    toast.success(`${item.name} agregado al carrito`, { duration: 1500 });
  };

  const handleDecrease = () => {
    const cartItem = items.find((i) => i.menuItemId === item.id);
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeItem(cartItem.id);
      } else {
        useCartStore.getState().updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    }
  };

  return (
    <>
      <Card className="border border-border/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex gap-0">
            {/* Info */}
            <div className="flex-1 p-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {item.isPopular && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    <Flame className="w-2.5 h-2.5" /> Popular
                  </span>
                )}
                {item.isNew && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> Nuevo
                  </span>
                )}
                {item.discount && (
                  <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    -{item.discount}%
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {item.description}
              </p>

              {/* Price + Add */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-primary">
                    ${finalPrice.toLocaleString()}
                  </span>
                  {item.discount && (
                    <span className="text-xs text-muted-foreground line-through ml-1.5">
                      ${item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {quantity === 0 ? (
                  <Button
                    size="sm"
                    onClick={handleAdd}
                    className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 bg-muted rounded-full px-1 py-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDecrease}
                      className="h-7 w-7 p-0 rounded-full hover:bg-primary/10"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-bold text-foreground w-4 text-center">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAdd}
                      className="h-7 w-7 p-0 rounded-full hover:bg-primary/10"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 relative">
              <SafeImage
                src={item.image}
                alt={item.name}
                type="product"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {item.rating && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-white/95 px-1.5 py-0.5 rounded-full shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-bold text-foreground">{item.rating}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        redirectMessage="Inicia sesión para agregar al carrito"
      />
    </>
  );
}

export default function RestaurantProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState('menu');
  const [showAuth, setShowAuth] = useState(false);

  const restaurant = useMemo(() => getRestaurantById(id ?? ''), [id]);
  const menuItems = useMemo(() => getMenuByRestaurant(id ?? ''), [id]);

  const { isRestaurantFavorite, toggleRestaurant } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const isFav = isRestaurantFavorite(id ?? '');

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Restaurante no encontrado</h2>
          <Button onClick={() => navigate('/')} className="rounded-xl">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    toggleRestaurant(restaurant.id);
    toast(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos', {
      icon: isFav ? '💔' : '❤️',
      duration: 1500,
    });
  };

  const handleGoToCart = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    navigate('/cart');
  };

  // Group menu by category
  const menuByCategory = useMemo(() => {
    const grouped: Partial<Record<MenuCategory, MenuItem[]>> = {};
    menuItems.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category]!.push(item);
    });
    return grouped;
  }, [menuItems]);

  const availableCategories = MENU_CATEGORIES.filter(
    (c) => (menuByCategory[c.id]?.length ?? 0) > 0
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <SafeImage
          src={restaurant.bannerImage}
          fallbackSrc={restaurant.imageFallback}
          alt={restaurant.name}
          type="restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white shadow-lg rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`shadow-lg rounded-xl ${
              isFav
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-white/90 text-black hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 text-black hover:bg-white shadow-lg rounded-xl"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {restaurant.verified && (
              <Badge className="bg-white text-foreground text-xs gap-1">
                <BadgeCheck className="w-3 h-3 text-primary" />
                Verificado
              </Badge>
            )}
            {restaurant.discount && (
              <Badge className="bg-primary text-white text-xs">
                {restaurant.discount}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {restaurant.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <strong>{restaurant.rating}</strong>
              <span className="text-white/70">({restaurant.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {restaurant.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {restaurant.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              ${restaurant.deliveryFee.toLocaleString()} envío
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Info card */}
        <Card className="mt-4 mb-6 border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {restaurant.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificación</p>
                  <p className="text-sm font-semibold text-foreground">Manipulación de alimentos</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Métodos de pago</p>
                  <p className="text-sm font-semibold text-foreground">
                    {restaurant.paymentMethods.slice(0, 2).join(', ')}
                    {restaurant.paymentMethods.length > 2 && ` +${restaurant.paymentMethods.length - 2}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horario</p>
                  <p className="text-sm font-semibold text-foreground">{restaurant.schedule}</p>
                </div>
              </div>

              {restaurant.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-semibold text-foreground">{restaurant.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mini mapa de ubicación */}
            <RestaurantMiniMap
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              address={restaurant.address}
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full h-12 bg-white border border-border rounded-2xl mb-6">
            <TabsTrigger value="menu" className="flex-1 rounded-xl text-sm font-medium">
              Menú
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 rounded-xl text-sm font-medium">
              Reseñas
            </TabsTrigger>
          </TabsList>

          {/* MENU TAB */}
          <TabsContent value="menu" className="space-y-8">
            {availableCategories.map(({ id: catId, label, emoji }) => {
              const items = menuByCategory[catId] ?? [];
              if (items.length === 0) return null;

              return (
                <div key={catId}>
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>{emoji}</span>
                    {label}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      ({items.length})
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews" className="space-y-4">
            <ReviewSection
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <Button
              size="lg"
              className="w-full gap-3 h-13 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg"
              onClick={handleGoToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Ver carrito · {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Button>
          </div>
        </div>
      )}

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        redirectMessage="Inicia sesión para ver tu carrito"
      />
    </div>
  );
}
