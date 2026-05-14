import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  ChevronDown,
  Package,
  Store,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { AuthModal } from './auth/AuthModal';
import { toast } from 'sonner';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const totalFavorites = useFavoritesStore((s) => s.restaurantIds.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md group-hover:shadow-lg transition-shadow">
                🍲
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                  Sabor Tolima
                </h1>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Marketplace Gastronómico
                </p>
              </div>
            </button>

            {/* Search — Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Busca tamales, hamburguesas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-10 bg-muted/50 border-transparent focus-visible:border-primary/30 focus-visible:bg-white rounded-xl text-sm"
                />
              </div>
            </form>

            {/* Actions — Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {/* Favorites */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('/favorites')}
                className="relative gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">Favoritos</span>
                {totalFavorites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalFavorites > 9 ? '9+' : totalFavorites}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('/cart')}
                className="relative gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Button>

              {/* User */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground pl-1 focus-visible:ring-0"
                    >
                      {/* Avatar: foto de Google o inicial */}
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          width={28}
                          height={28}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
                          }}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                        />
                      ) : null}
                      {/* Fallback inicial — siempre en DOM, oculto si hay avatar */}
                      <div
                        style={{ display: user.avatar ? 'none' : 'flex' }}
                        className="w-7 h-7 rounded-full bg-primary/10 items-center justify-center shrink-0"
                      >
                        <span className="text-xs font-bold text-primary leading-none">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden lg:inline text-sm max-w-[80px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 z-[60]">
                    {/* User info header */}
                    <div className="px-2 py-2 mb-1">
                      <div className="flex items-center gap-2.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            width={36}
                            height={36}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-border mx-1 mb-1" />
                    <DropdownMenuItem
                      onClick={() => handleNavigate('/profile')}
                      className="gap-2 rounded-xl cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigate('/orders')}
                      className="gap-2 rounded-xl cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      Mis Pedidos
                    </DropdownMenuItem>
                    {user.role === 'seller' && (
                      <DropdownMenuItem
                        onClick={() => handleNavigate('/seller-dashboard')}
                        className="gap-2 rounded-xl cursor-pointer"
                      >
                        <Store className="w-4 h-4" />
                        Panel Vendedor
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm ml-1"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>

            {/* Mobile: cart badge + menu toggle */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate('/cart')}
                className="relative rounded-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white animate-slide-in-down pb-4">
              <div className="pt-4 space-y-3">
                {/* Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar restaurantes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-muted/50 border-transparent rounded-xl"
                    />
                  </div>
                </form>

                {/* Nav links */}
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl"
                    onClick={() => handleNavigate('/favorites')}
                  >
                    <Heart className="w-4 h-4" />
                    Mis Favoritos
                    {totalFavorites > 0 && (
                      <Badge className="ml-auto bg-primary/10 text-primary text-xs">
                        {totalFavorites}
                      </Badge>
                    )}
                  </Button>

                  {isAuthenticated && user ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-xl"
                        onClick={() => handleNavigate('/profile')}
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-xl"
                        onClick={() => handleNavigate('/orders')}
                      >
                        <Package className="w-4 h-4" />
                        Mis Pedidos
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowAuthModal(true);
                      }}
                    >
                      <User className="w-4 h-4" />
                      Iniciar Sesión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
