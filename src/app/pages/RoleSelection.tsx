import { useNavigate } from 'react-router';
import {
  ShoppingBag,
  Store,
  ChefHat,
  ArrowRight,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    localStorage.setItem('userRole', role);

    if (role === 'buyer') {
      navigate('/');
    } else {
      navigate('/vendor-dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-6xl">

          {/* HEADER */}
          <div className="text-center mb-14">

            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-2xl mb-6">
              <ChefHat className="w-12 h-12 text-white" />
            </div>

            <Badge className="mb-5 px-4 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
              Marketplace gastronómico del Tolima
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-5">
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sabor Tolima
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Descubre restaurantes auténticos, comida rápida, cafeterías,
              platos típicos y negocios locales en una experiencia moderna,
              cálida y fácil de usar.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Restaurantes locales
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-foreground">
                  Negocios verificados
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Experiencia premium
                </span>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* COMPRADOR */}
            <Card
              onClick={() => handleRoleSelect('buyer')}
              className="
                group
                cursor-pointer
                overflow-hidden
                border-0
                bg-white/80
                backdrop-blur-xl
                shadow-xl
                hover:shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-2
                rounded-3xl
              "
            >
              <CardContent className="relative p-8 sm:p-10 h-full">

                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

                <div className="relative z-10">

                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 group-hover:bg-primary transition-all duration-500 mb-8 shadow-lg">
                    <ShoppingBag className="w-12 h-12 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>

                  <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
                    Cliente
                  </Badge>

                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Quiero comprar comida
                  </h2>

                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-8">
                    Explora restaurantes, descubre promociones, pide comida
                    rápida, platos típicos, cafeterías y mucho más desde un
                    solo lugar.
                  </p>

                  {/* Beneficios */}
                  <div className="space-y-3 mb-10">

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-sm sm:text-base text-foreground">
                        Encuentra restaurantes cercanos
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-sm sm:text-base text-foreground">
                        Promociones y descuentos diarios
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-sm sm:text-base text-foreground">
                        Pedidos rápidos y seguros
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">

                    <span className="text-primary font-semibold text-lg">
                      Comenzar ahora
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VENDEDOR */}
            <Card
              onClick={() => handleRoleSelect('seller')}
              className="
                group
                cursor-pointer
                overflow-hidden
                border-0
                bg-white/80
                backdrop-blur-xl
                shadow-xl
                hover:shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-2
                rounded-3xl
              "
            >
              <CardContent className="relative p-8 sm:p-10 h-full">

                {/* Glow */}
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500" />

                <div className="relative z-10">

                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-accent/10 group-hover:bg-accent transition-all duration-500 mb-8 shadow-lg">
                    <Store className="w-12 h-12 text-accent group-hover:text-white transition-colors duration-500" />
                  </div>

                  <Badge className="mb-4 bg-accent/10 text-accent border border-accent/20">
                    Restaurante
                  </Badge>

                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Quiero vender productos
                  </h2>

                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-8">
                    Crea tu restaurante, sube tus productos, administra tu menú
                    y aumenta tus ventas llegando a más clientes en tu ciudad.
                  </p>

                  {/* Beneficios */}
                  <div className="space-y-3 mb-10">

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="text-sm sm:text-base text-foreground">
                        Publica tu menú fácilmente
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="text-sm sm:text-base text-foreground">
                        Gestiona pedidos y ventas
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="text-sm sm:text-base text-foreground">
                        Haz crecer tu restaurante
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">

                    <span className="text-accent font-semibold text-lg">
                      Crear mi negocio
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* FOOTER */}
          <div className="mt-12 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Puedes cambiar tu rol más adelante desde tu perfil o configuración.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}