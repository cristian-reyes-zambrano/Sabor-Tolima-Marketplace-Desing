import { useState } from 'react';
import { Star, Clock, MapPin, BadgeCheck, Heart, Flame, Bike, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Badge } from './ui/badge';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { SafeImage } from './SafeImage';
import { toast } from 'sonner';
import type { Restaurant } from '../types';

type RestaurantCardProps = Pick<
  Restaurant,
  | 'id' | 'name' | 'image' | 'imageFallback'
  | 'rating' | 'reviewCount' | 'distance' | 'estimatedTime'
  | 'tags' | 'verified' | 'discount' | 'deliveryFee' | 'description'
>;

export function RestaurantCard({
  id, name, image, imageFallback, rating,
  reviewCount, distance, estimatedTime,
  tags, verified, discount, deliveryFee, description,
}: RestaurantCardProps) {
  const navigate = useNavigate();
  const { isRestaurantFavorite, toggleRestaurant } = useFavoritesStore();
  const isFav = isRestaurantFavorite(id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRestaurant(id);
    toast(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos', {
      icon: isFav ? '💔' : '❤️',
      duration: 1500,
    });
  };

  return (
    <article
      onClick={() => navigate(`/restaurant/${id}`)}
      className="group cursor-pointer bg-white rounded-3xl border border-border/40 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* ── Imagen ── */}
      <div className="relative h-52 overflow-hidden bg-muted/60">

        {/* Skeleton mientras carga */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/60 animate-pulse" />
        )}

        <SafeImage
          src={image}
          fallbackSrc={imageFallback}
          alt={name}
          type="restaurant"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradiente multicapa para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Botón favorito */}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all duration-200 shadow-lg ${
            isFav
              ? 'bg-primary border-primary text-white scale-110'
              : 'bg-white/80 border-white/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Badges arriba izquierda */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {verified && (
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
              <BadgeCheck className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-foreground">Verificado</span>
            </div>
          )}
          {discount && (
            <div className="flex items-center gap-1 bg-primary px-2.5 py-1 rounded-full shadow-md">
              <Flame className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white">{discount}</span>
            </div>
          )}
        </div>

        {/* Rating + nombre sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white drop-shadow-md line-clamp-1 mb-1">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-md shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-foreground">{rating}</span>
              <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-0 mb-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1">
            <div className="w-6 h-6 bg-primary/8 rounded-lg flex items-center justify-center">
              <Clock className="w-3 h-3 text-primary" />
            </div>
            <span>{estimatedTime}</span>
          </div>
          <div className="w-px h-4 bg-border mx-2" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1">
            <div className="w-6 h-6 bg-primary/8 rounded-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-primary" />
            </div>
            <span>{distance}</span>
          </div>
          <div className="w-px h-4 bg-border mx-2" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1">
            <div className="w-6 h-6 bg-primary/8 rounded-lg flex items-center justify-center">
              <Bike className="w-3 h-3 text-primary" />
            </div>
            <span>{deliveryFee === 0 ? 'Gratis' : `$${deliveryFee.toLocaleString()}`}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${id}`); }}
          className="w-full mt-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white rounded-2xl py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Ver menú
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
