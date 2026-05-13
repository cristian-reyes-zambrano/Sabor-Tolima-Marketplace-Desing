import { Star, Clock, MapPin, BadgeCheck, Heart, Flame, Bike } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { toast } from 'sonner';
import type { Restaurant } from '../types';

type RestaurantCardProps = Pick<
  Restaurant,
  | 'id'
  | 'name'
  | 'image'
  | 'rating'
  | 'reviewCount'
  | 'distance'
  | 'estimatedTime'
  | 'tags'
  | 'verified'
  | 'discount'
  | 'deliveryFee'
  | 'description'
>;

export function RestaurantCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  distance,
  estimatedTime,
  tags,
  verified,
  discount,
  deliveryFee,
  description,
}: RestaurantCardProps) {
  const navigate = useNavigate();
  const { isRestaurantFavorite, toggleRestaurant } = useFavoritesStore();
  const isFav = isRestaurantFavorite(id);

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
      className="group cursor-pointer bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200 shadow-md ${
            isFav
              ? 'bg-primary border-primary text-white'
              : 'bg-white/90 border-white/50 text-muted-foreground hover:text-primary hover:border-primary/30'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {verified && (
            <div className="flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full shadow-sm">
              <BadgeCheck className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-foreground">Verificado</span>
            </div>
          )}
          {discount && (
            <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded-full shadow-sm">
              <Flame className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white">{discount}</span>
            </div>
          )}
        </div>

        {/* Rating bottom-left */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-foreground">{rating}</span>
            <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base text-foreground line-clamp-1 mb-1">
          {name}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            {distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            {estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Bike className="w-3 h-3 text-primary" />
            {deliveryFee === 0 ? 'Gratis' : `$${deliveryFee.toLocaleString()}`}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 rounded-full"
            >
              +{tags.length - 2}
            </Badge>
          )}
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="w-full mt-auto bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/restaurant/${id}`);
          }}
        >
          Ver menú
        </Button>
      </div>
    </article>
  );
}
