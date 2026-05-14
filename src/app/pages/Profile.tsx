import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ChevronRight,
  Package,
  Heart,
  Settings,
  Shield,
  Bell,
  Edit2,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { AuthModal } from '../components/auth/AuthModal';
import { AvatarImage } from '../components/SafeImage';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { restaurantIds } = useFavoritesStore();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Inicia sesión para ver tu perfil
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Accede a tu historial de pedidos, favoritos y configuración
          </p>
          <Button
            onClick={() => setShowAuth(true)}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white"
          >
            Iniciar Sesión
          </Button>
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      label: 'Mis Pedidos',
      sub: 'Historial de pedidos',
      onClick: () => navigate('/orders'),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Heart,
      label: 'Mis Favoritos',
      sub: `${restaurantIds.length} restaurantes guardados`,
      onClick: () => navigate('/favorites'),
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: MapPin,
      label: 'Mis Direcciones',
      sub: 'Gestiona tus direcciones',
      onClick: () => {},
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      sub: 'Configura alertas',
      onClick: () => {},
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Shield,
      label: 'Seguridad',
      sub: 'Contraseña y privacidad',
      onClick: () => {},
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Settings,
      label: 'Configuración',
      sub: 'Preferencias de la app',
      onClick: () => {},
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Profile card */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary to-accent" />
          <CardContent className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  size={80}
                  initial={user.name}
                  initialClassName="text-3xl"
                  className="rounded-2xl"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 text-xs"
              >
                <Edit2 className="w-3 h-3" />
                Editar
              </Button>
            </div>

            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="text-xs rounded-full bg-primary/10 text-primary"
              >
                {user.role === 'buyer' ? 'Cliente' : 'Vendedor'}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Menu items */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-2">
            {menuItems.map(({ icon: Icon, label, sub, onClick, color, bg }, i) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted/50 transition-colors text-left ${
                  i < menuItems.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Sabor Tolima v1.0.0 · Ibagué, Colombia
        </p>
      </main>
    </div>
  );
}
