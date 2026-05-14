import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  TrendingUp, DollarSign, Star, Clock, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, Loader2, AlertCircle, CheckCircle2,
  XCircle, ChevronDown, Menu, X, Upload, ImagePlus, Flame,
  Eye, EyeOff, BarChart2, Tag, RefreshCw, Bell,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { SafeImage } from '../components/SafeImage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { useAuthStore } from '../store/useAuthStore';
import { useSellerStore } from '../store/useSellerStore';
import { uploadFile, validateImageFile } from '../../firebase/storage.service';
import {
  getOrdersByRestaurant,
  updateOrderStatus,
} from '../../firebase/firestore.service';
import { toast } from 'sonner';
import type { SellerProduct, MenuCategory, SellerStatus, AppOrder } from '../types';

type DashTab = 'overview' | 'products' | 'orders' | 'stats' | 'promos' | 'settings';

const MENU_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'principales', label: 'Platos Fuertes' },
  { id: 'entradas', label: 'Entradas' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'postres', label: 'Postres' },
  { id: 'combos', label: 'Combos' },
  { id: 'recomendados', label: 'Recomendados' },
];

const STATUS_CONFIG: Record<SellerStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'En revisión', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  approved: { label: 'Aprobado', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2 },
  rejected: { label: 'Rechazado', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
  suspended: { label: 'Suspendido', color: 'text-gray-700', bg: 'bg-gray-50', icon: AlertCircle },
};

const MOCK_ORDERS: AppOrder[] = [
  {
    id: '#IB-001', userId: 'u1', restaurantId: 'demo', restaurantName: 'Demo',
    items: [{ id: 'i1', menuItemId: 'm1', restaurantId: 'demo', restaurantName: 'Demo', name: 'Lechona Tolimense Completa', price: 28000, image: '', quantity: 2, notes: '' }],
    subtotal: 56000, deliveryFee: 4000, discount: 0, total: 60000,
    status: 'preparing', address: 'Calle 10 # 5-23, Centro, Ibagué',
    paymentMethod: 'cash', estimatedTime: '25-35 min',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    specialInstructions: 'Sin cebolla, poco picante',
  },
  {
    id: '#IB-002', userId: 'u2', restaurantId: 'demo', restaurantName: 'Demo',
    items: [{ id: 'i2', menuItemId: 'm2', restaurantId: 'demo', restaurantName: 'Demo', name: 'Tamal Tolimense + Avena', price: 17000, image: '', quantity: 1, notes: '' }],
    subtotal: 17000, deliveryFee: 3500, discount: 0, total: 20500,
    status: 'pending', address: 'Carrera 5 # 12-45, La Pola, Ibagué',
    paymentMethod: 'nequi' as 'cash', estimatedTime: '20-30 min',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    specialInstructions: 'Alérgico al maní — IMPORTANTE',
  },
  {
    id: '#IB-003', userId: 'u3', restaurantId: 'demo', restaurantName: 'Demo',
    items: [{ id: 'i3', menuItemId: 'm3', restaurantId: 'demo', restaurantName: 'Demo', name: 'Combo Lechona Familiar', price: 75000, image: '', quantity: 1, notes: '' }],
    subtotal: 75000, deliveryFee: 4000, discount: 11250, total: 67750,
    status: 'delivered', address: 'Calle 38 # 2-15, El Salado, Ibagué',
    paymentMethod: 'card', estimatedTime: '30-40 min',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '#IB-004', userId: 'u4', restaurantId: 'demo', restaurantName: 'Demo',
    items: [{ id: 'i4', menuItemId: 'm4', restaurantId: 'demo', restaurantName: 'Demo', name: 'Sancocho de Gallina Criolla', price: 22000, image: '', quantity: 2, notes: '' }],
    subtotal: 44000, deliveryFee: 4000, discount: 0, total: 48000,
    status: 'ready', address: 'Carrera 8 # 45-67, La Pola, Ibagué',
    paymentMethod: 'pse', estimatedTime: '25-35 min',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

const ORDER_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-50' },
  preparing: { label: 'Preparando', color: 'text-blue-700', bg: 'bg-blue-50' },
  ready: { label: 'Listo', color: 'text-green-700', bg: 'bg-green-50' },
  delivered: { label: 'Entregado', color: 'text-gray-600', bg: 'bg-gray-50' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-50' },
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { profile, products, loadProfile, loadProducts, isLoadingProducts, updateProfile } = useSellerStore();
  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [orders, setOrders] = useState<AppOrder[]>(MOCK_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setIsLoadingOrders(true);
    try {
      const real = await getOrdersByRestaurant(user.id);
      setOrders(real.length > 0 ? real : MOCK_ORDERS);
    } catch {
      setOrders(MOCK_ORDERS);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadProducts(user.id);
      loadOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const sellerStatus = profile?.status ?? 'pending';
  const statusCfg = STATUS_CONFIG[sellerStatus];
  const StatusIcon = statusCfg.icon;

  const navItems: { id: DashTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',  label: 'Resumen',       icon: LayoutDashboard },
    { id: 'products',  label: 'Productos',      icon: Package },
    { id: 'orders',    label: 'Pedidos',        icon: ShoppingBag },
    { id: 'stats',     label: 'Estadísticas',   icon: BarChart2 },
    { id: 'promos',    label: 'Promociones',    icon: Tag },
    { id: 'settings',  label: 'Configuración',  icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold">
              🍲
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Sabor Tolima</p>
              <p className="text-[10px] text-muted-foreground">Panel Vendedor</p>
            </div>
          </div>
        </div>

        {/* Restaurant info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {profile?.logo ? (
              <img src={profile.logo} alt="logo" className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-lg">🏪</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {profile?.restaurantName ?? user.name}
              </p>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                <StatusIcon className="w-2.5 h-2.5" />
                {statusCfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Eye className="w-4 h-4" />
            Ver marketplace
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sellerStatus === 'pending' && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs hidden sm:flex gap-1">
                <Clock className="w-3 h-3" /> En revisión
              </Badge>
            )}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Pending notice */}
          {sellerStatus === 'pending' && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Restaurante en revisión</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Tu solicitud está siendo revisada. Recibirás una notificación en 24-48 horas hábiles.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'overview' && <OverviewTab products={products} orders={orders} />}
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              isLoading={isLoadingProducts}
              onAdd={() => { setEditingProduct(null); setShowProductModal(true); }}
              onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              isLoading={isLoadingOrders}
              onRefresh={loadOrders}
              onStatusChange={async (orderId, status) => {
                await updateOrderStatus(orderId, status);
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
                toast.success('Estado actualizado');
              }}
            />
          )}
          {activeTab === 'stats'    && <StatsTab products={products} orders={orders} />}
          {activeTab === 'promos'   && <PromosTab products={products} />}
          {activeTab === 'settings' && <SettingsTab profile={profile} onSave={updateProfile} />}
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={editingProduct}
        restaurantId={user.id}
      />
    </div>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────
function OverviewTab({ products }: { products: SellerProduct[] }) {
  const activeProducts = products.filter((p) => p.available).length;

  const stats = [
    { label: 'Ventas hoy', value: '$450.000', sub: '+12% vs ayer', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pedidos activos', value: '12', sub: '4 en preparación', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Productos activos', value: String(activeProducts || 24), sub: 'En el menú', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Calificación', value: '4.8', sub: '250+ reseñas', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Demo review analytics
  const reviewAnalytics = [
    { label: 'Satisfacción', value: '96%', icon: '😊', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Reseñas este mes', value: '18', icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Plato más popular', value: 'Lechona', icon: '🏆', color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review analytics */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Analytics de reseñas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {reviewAnalytics.map(({ label, value, icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <p className="text-2xl mb-1">{icon}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          {/* Mini star distribution */}
          <div className="space-y-1.5">
            {([5, 4, 3] as const).map((star) => {
              const pcts: Record<number, number> = { 5: 72, 4: 20, 3: 8 };
              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 w-16 shrink-0">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[star]}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{pcts[star]}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Pedidos recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_ORDERS.slice(0, 4).map((order) => {
            const cfg = ORDER_STATUS[order.status];
            return (
              <div key={order.id} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{order.id}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{order.customer}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.items}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">${order.total.toLocaleString()}</p>
                  <Badge className={`${cfg.bg} ${cfg.color} border-0 text-[10px] mt-1`}>
                    {cfg.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Products ────────────────────────────────────────────────────────────
function ProductsTab({
  products,
  isLoading,
  onAdd,
  onEdit,
}: {
  products: SellerProduct[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (p: SellerProduct) => void;
}) {
  const { removeProduct, toggleProductAvailability } = useSellerStore();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await removeProduct(id);
    toast.success('Producto eliminado');
  };

  const handleToggle = async (id: string) => {
    await toggleProductAvailability(id);
    toast.success('Disponibilidad actualizada');
  };

  // Demo products if none loaded
  const displayProducts: SellerProduct[] = products.length > 0 ? products : [
    { id: 'd1', restaurantId: 'demo', name: 'Bandeja Paisa', description: 'Tradicional bandeja completa', price: 25000, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=150&fit=crop', category: 'principales', available: true, isPopular: true },
    { id: 'd2', restaurantId: 'demo', name: 'Lechona Tolimense', description: 'Auténtica lechona del Tolima', price: 28000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=200&h=150&fit=crop', category: 'principales', available: true },
    { id: 'd3', restaurantId: 'demo', name: 'Tamal Tolimense', description: 'Tamal tradicional en hoja de plátano', price: 12000, image: 'https://images.unsplash.com/photo-1585238341710-4913098dbc83?w=200&h=150&fit=crop', category: 'entradas', available: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Mis Productos</h2>
          <p className="text-xs text-muted-foreground">{displayProducts.length} productos en el menú</p>
        </div>
        <Button onClick={onAdd} size="sm" className="rounded-xl gap-1.5 bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4" /> Agregar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {displayProducts.map((product) => (
            <Card key={product.id} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    type="product"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-sm font-bold text-foreground truncate">{product.name}</h3>
                          {product.isPopular && (
                            <Flame className="w-3 h-3 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                        <p className="text-sm font-bold text-primary mt-1">${product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant="outline" className={`text-[10px] ${product.available ? 'text-green-600 border-green-200' : 'text-muted-foreground'}`}>
                          {product.available ? 'Activo' : 'Pausado'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-7 px-2 rounded-lg text-xs gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(product.id)} className="h-7 px-2 rounded-lg text-xs gap-1">
                        {product.available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {product.available ? 'Pausar' : 'Activar'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="h-7 px-2 rounded-lg text-xs gap-1 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Orders ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'pending', 'preparing', 'ready', 'delivered'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === s
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {s === 'all' ? 'Todos' : ORDER_STATUS[s]?.label ?? s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const cfg = ORDER_STATUS[order.status];
          // Demo special instructions
          const demoInstructions = order.id === '#001' ? 'Sin cebolla, poco picante' : order.id === '#002' ? 'Alérgico al maní - IMPORTANTE' : '';
          return (
            <Card key={order.id} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{order.id}</span>
                      <Badge className={`${cfg.bg} ${cfg.color} border-0 text-[10px]`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.customer} · {order.time}</p>
                  </div>
                  <p className="text-base font-bold text-foreground">${order.total.toLocaleString()}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{order.items}</p>

                {/* Special instructions highlight */}
                {demoInstructions && (
                  <div className={`flex items-start gap-2 p-2.5 rounded-xl mb-3 text-xs ${
                    demoInstructions.toLowerCase().includes('alérg')
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-amber-50 border border-amber-200 text-amber-800'
                  }`}>
                    <span className="text-base shrink-0">
                      {demoInstructions.toLowerCase().includes('alérg') ? '⚠️' : '📝'}
                    </span>
                    <div>
                      <p className="font-bold mb-0.5">
                        {demoInstructions.toLowerCase().includes('alérg') ? 'ALERGIA — Leer con atención' : 'Instrucciones del cliente'}
                      </p>
                      <p>{demoInstructions}</p>
                    </div>
                  </div>
                )}

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button size="sm" className="rounded-xl text-xs h-7 bg-primary hover:bg-primary/90 text-white">
                        Aceptar pedido
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" className="rounded-xl text-xs h-7 bg-green-600 hover:bg-green-700 text-white">
                        Marcar listo
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button size="sm" className="rounded-xl text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white">
                        Entregado
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="rounded-xl text-xs h-7 text-destructive border-destructive/30">
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────
function SettingsTab({ profile }: { profile: ReturnType<typeof useSellerStore.getState>['profile'] }) {
  return (
    <div className="space-y-4 max-w-lg">
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-bold text-sm text-foreground">Información del restaurante</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nombre</Label>
              <Input defaultValue={profile?.restaurantName ?? ''} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descripción</Label>
              <Textarea defaultValue={profile?.description ?? ''} className="rounded-xl resize-none" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Teléfono</Label>
              <Input defaultValue={profile?.phone ?? ''} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Horario</Label>
              <Input defaultValue={profile?.schedule ?? ''} className="rounded-xl" />
            </div>
          </div>
          <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white">
            Guardar cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({
  open,
  onClose,
  product,
  restaurantId,
}: {
  open: boolean;
  onClose: () => void;
  product: SellerProduct | null;
  restaurantId: string;
}) {
  const { addProduct, editProduct } = useSellerStore();
  const { user } = useAuthStore();
  const imageRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    category: product?.category ?? 'principales' as MenuCategory,
    ingredients: product?.ingredients?.join(', ') ?? '',
    discount: product?.discount ?? 0,
    isPopular: product?.isPopular ?? false,
    available: product?.available ?? true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, description: product.description,
        price: product.price, category: product.category,
        ingredients: product.ingredients?.join(', ') ?? '',
        discount: product.discount ?? 0,
        isPopular: product.isPopular ?? false,
        available: product.available,
      });
      setImagePreview(product.image);
    } else {
      setForm({ name: '', description: '', price: 0, category: 'principales', ingredients: '', discount: 0, isPopular: false, available: true });
      setImagePreview('');
    }
    setImageFile(null);
  }, [product, open]);

  const handleImageSelect = (file: File) => {
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    if (form.price <= 0) { toast.error('El precio debe ser mayor a 0'); return; }

    setIsLoading(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile && user) {
        imageUrl = await uploadFile(imageFile, 'products', user.id);
      }

      const productData = {
        restaurantId,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
        available: form.available,
        ingredients: form.ingredients ? form.ingredients.split(',').map((s) => s.trim()) : [],
        discount: Number(form.discount) || undefined,
        isPopular: form.isPopular,
      };

      if (product) {
        await editProduct(product.id, productData);
        toast.success('Producto actualizado');
      } else {
        await addProduct(productData);
        toast.success('Producto agregado al menú');
      }
      onClose();
    } catch {
      toast.error('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {product
              ? 'Modifica los datos del producto en tu menú'
              : 'Agrega un nuevo producto a tu menú'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image */}
          <div>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setImageFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Subir imagen del plato</span>
              </button>
            )}
            <input ref={imageRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">Nombre del plato *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ej: Bandeja Paisa" className="rounded-xl" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe el plato..." className="rounded-xl resize-none" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Precio (COP) *</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} placeholder="25000" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descuento (%)</Label>
              <Input type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))} placeholder="0" min="0" max="80" className="rounded-xl" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as MenuCategory }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">Ingredientes (separados por coma)</Label>
              <Input value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} placeholder="Arroz, frijoles, chicharrón..." className="rounded-xl" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))} className="rounded" />
              <span className="text-xs font-medium text-foreground">Marcar como popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} className="rounded" />
              <span className="text-xs font-medium text-foreground">Disponible</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : product ? 'Guardar cambios' : 'Agregar producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
