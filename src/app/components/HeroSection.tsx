import { Search, Clock, Star, Truck } from 'lucide-react';
import { Input } from './ui/input';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function HeroSection({ onSearch, searchQuery }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a00] via-[#3d1200] to-[#1a0a00] text-white">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 lg:py-20 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-white/90">
            Más de 1,500 comidas servidas hoy
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
          El sabor del Tolima,{' '}
          <span className="text-accent">en tu puerta</span>
        </h1>

        <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
          Descubre restaurantes auténticos, comida rápida y gastronomía gourmet.
          Todo en un solo lugar.
        </p>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Busca tamales, hamburguesas, sushi..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-12 pr-4 h-14 bg-white text-foreground border-0 rounded-2xl text-base shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/70"
          />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-8">
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">50+ restaurantes</p>
              <p className="text-xs text-white/60">verificados</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">20 min</p>
              <p className="text-xs text-white/60">entrega promedio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Envío gratis</p>
              <p className="text-xs text-white/60">en tu primer pedido</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
