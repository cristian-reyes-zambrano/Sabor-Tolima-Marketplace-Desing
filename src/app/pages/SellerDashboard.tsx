import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  DollarSign, Star, Clock, Plus, Edit2, Trash2,
  Loader2, AlertCircle, CheckCircle2,
  XCircle, Menu, X, Upload, ImagePlus, Flame,
  Eye, EyeOff, BarChart2, Tag, RefreshCw, Camera,
  TrendingUp,
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

type DashTab = 'overview' | 'products' | 'orders' | 'stats' | 'promos' | 'photos' | 'settings';

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
    { id: 'photos',    label: 'Fotos',          icon: Camera },
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
          {activeTab === 'photos'   && <PhotosTab restaurantId={user.id} profile={profile} />}
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
function OverviewTab({ products, orders }: { products: SellerProduct[]; orders: AppOrder[] }) {
  const activeProducts = products.filter((p) => p.available).length;
  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayRevenue = todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const activeOrdersCount = orders.filter(o => ['pending','confirmed','preparing','ready'].includes(o.status)).length;

  const stats = [
    { label: 'Ventas hoy', value: todayRevenue > 0 ? `$${todayRevenue.toLocaleString()}` : '$195.750', sub: `${todayOrders.length} pedidos`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pedidos activos', value: String(activeOrdersCount || 4), sub: 'En proceso ahora', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Productos activos', value: String(activeProducts || 7), sub: 'En el menú', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Calificación', value: '4.8', sub: '18 reseñas este mes', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
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

      {/* Pedidos recientes */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Pedidos recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.slice(0, 4).map((order) => {
            const cfg = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
            const itemNames = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
            const timeStr = new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={order.id} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{order.id}</span>
                    <span className="text-xs text-muted-foreground">· {timeStr}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{itemNames}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">${order.total.toLocaleString()}</p>
                  <Badge className={`${cfg.bg} ${cfg.color} border-0 text-[10px] mt-1`}>{cfg.label}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Satisfacción */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Satisfacción del cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Satisfacción', value: '96%', icon: '😊', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Reseñas mes', value: '18', icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Más popular', value: 'Lechona', icon: '🏆', color: 'text-primary', bg: 'bg-primary/10' },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <p className="text-2xl mb-1">{icon}</p>
                <p className={`text-sm font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {([5, 4, 3] as const).map((star) => {
              const pcts: Record<number, number> = { 5: 72, 4: 20, 3: 8 };
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">{star}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
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

  const displayProducts: SellerProduct[] = products.length > 0 ? products : [
    { id: 'd1', restaurantId: 'demo', name: 'Lechona Tolimense Completa', description: 'Lechona entera horneada 12 horas con receta familiar', price: 28000, image: '/images/products/product-placeholder.svg', category: 'principales', available: true, isPopular: true },
    { id: 'd2', restaurantId: 'demo', name: 'Tamal Tolimense Clásico',    description: 'Tamal con pollo, cerdo y arroz en hoja de plátano',   price: 12000, image: '/images/products/product-placeholder.svg', category: 'entradas',   available: true,  isPopular: true },
    { id: 'd3', restaurantId: 'demo', name: 'Avena Tolimense Caliente',   description: 'Avena al fuego de leña con canela y panela',           price: 5000,  image: '/images/products/product-placeholder.svg', category: 'bebidas',    available: false, isPopular: false },
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
function OrdersTab({
  orders,
  isLoading,
  onRefresh,
  onStatusChange,
}: {
  orders: AppOrder[];
  isLoading: boolean;
  onRefresh: () => void;
  onStatusChange: (id: string, status: AppOrder['status']) => Promise<void>;
}) {
  const [filter, setFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const handleStatus = async (orderId: string, status: AppOrder['status']) => {
    setUpdatingId(orderId);
    try { await onStatusChange(orderId, status); }
    finally { setUpdatingId(null); }
  };

  const NEXT_STATUS: Partial<Record<AppOrder['status'], { status: AppOrder['status']; label: string; color: string }>> = {
    pending:   { status: 'preparing', label: 'Aceptar pedido',  color: 'bg-primary hover:bg-primary/90 text-white' },
    preparing: { status: 'ready',     label: 'Marcar listo',    color: 'bg-green-600 hover:bg-green-700 text-white' },
    ready:     { status: 'delivered', label: 'Marcar entregado', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((s) => {
            const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filter === s
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {s === 'all' ? 'Todos' : ORDER_STATUS[s]?.label ?? s}
                {count > 0 && (
                  <span className={`text-[10px] rounded-full px-1.5 py-0 ${filter === s ? 'bg-white/20' : 'bg-muted'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-sm font-semibold text-foreground">Sin pedidos</p>
          <p className="text-xs text-muted-foreground mt-1">No hay pedidos en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
            const next = NEXT_STATUS[order.status];
            const itemNames = order.items.map(i => `${i.name} ×${i.quantity}`).join(' · ');
            const timeStr = new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
            const isUpdating = updatingId === order.id;

            return (
              <Card key={order.id} className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">{order.id}</span>
                        <Badge className={`${cfg.bg} ${cfg.color} border-0 text-[10px]`}>{cfg.label}</Badge>
                        <span className="text-xs text-muted-foreground">{timeStr}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{order.address}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-foreground">${order.total.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">{order.paymentMethod === 'cash' ? 'Efectivo' : order.paymentMethod === 'card' ? 'Tarjeta' : 'PSE/Nequi'}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{itemNames}</p>

                  {/* Instrucciones especiales */}
                  {order.specialInstructions && (
                    <div className={`flex items-start gap-2 p-2.5 rounded-xl mb-3 text-xs ${
                      order.specialInstructions.toLowerCase().includes('alérg')
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                    }`}>
                      <span className="text-base shrink-0">
                        {order.specialInstructions.toLowerCase().includes('alérg') ? '⚠️' : '📝'}
                      </span>
                      <div>
                        <p className="font-bold mb-0.5">
                          {order.specialInstructions.toLowerCase().includes('alérg')
                            ? 'ALERGIA — Leer con atención'
                            : 'Instrucciones del cliente'}
                        </p>
                        <p>{order.specialInstructions}</p>
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex gap-2 flex-wrap">
                      {next && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatus(order.id, next.status)}
                          className={`rounded-xl text-xs h-7 ${next.color}`}
                        >
                          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : next.label}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatus(order.id, 'cancelled')}
                        className="rounded-xl text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/5"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────
function SettingsTab({
  profile,
  onSave,
}: {
  profile: ReturnType<typeof useSellerStore.getState>['profile'];
  onSave: (data: Partial<import('../types').SellerProfile>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    restaurantName: profile?.restaurantName ?? '',
    description:    profile?.description    ?? '',
    phone:          profile?.phone          ?? '',
    schedule:       profile?.schedule       ?? '',
    address:        profile?.address        ?? '',
    estimatedTime:  profile?.estimatedTime  ?? '',
    deliveryFee:    profile?.deliveryFee    ?? 4000,
    minOrder:       profile?.minOrder       ?? 15000,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.restaurantName.trim()) { toast.error('El nombre es requerido'); return; }
    setIsSaving(true);
    try {
      await onSave(form);
      toast.success('Cambios guardados correctamente');
    } catch {
      toast.error('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 max-w-lg">
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-bold text-sm text-foreground">Información del restaurante</h3>
          <F label="Nombre del restaurante *">
            <Input value={form.restaurantName}
              onChange={e => setForm(f => ({ ...f, restaurantName: e.target.value }))}
              className="rounded-xl" />
          </F>
          <F label="Descripción">
            <Textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="rounded-xl resize-none" rows={3} />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Teléfono">
              <Input value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="rounded-xl" placeholder="300 123 4567" />
            </F>
            <F label="Horario">
              <Input value={form.schedule}
                onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                className="rounded-xl" placeholder="Lun-Dom 8am-8pm" />
            </F>
            <F label="Dirección">
              <Input value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="rounded-xl" placeholder="Calle 10 # 5-23, Ibagué" />
            </F>
            <F label="Tiempo estimado">
              <Input value={form.estimatedTime}
                onChange={e => setForm(f => ({ ...f, estimatedTime: e.target.value }))}
                className="rounded-xl" placeholder="25-35 min" />
            </F>
            <F label="Costo de envío ($)">
              <Input type="number" value={form.deliveryFee}
                onChange={e => setForm(f => ({ ...f, deliveryFee: Number(e.target.value) }))}
                className="rounded-xl" />
            </F>
            <F label="Pedido mínimo ($)">
              <Input type="number" value={form.minOrder}
                onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))}
                className="rounded-xl" />
            </F>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white"
          >
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</> : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      {/* Info de ciudad */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Ciudad de operación</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ibagué, Tolima — Colombia<br />
              Sabor Tolima opera exclusivamente dentro de Ibagué como ciudad piloto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Stats ───────────────────────────────────────────────────────────────
function StatsTab({ products, orders }: { products: SellerProduct[]; orders: AppOrder[] }) {
  const delivered = orders.filter(o => o.status === 'delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const avgTicket = delivered.length > 0 ? Math.round(totalRevenue / delivered.length) : 0;

  // Productos más vendidos (conteo por nombre en items de pedidos entregados)
  const productCount: Record<string, { name: string; count: number; revenue: number }> = {};
  delivered.forEach(order => {
    order.items.forEach(item => {
      if (!productCount[item.name]) productCount[item.name] = { name: item.name, count: 0, revenue: 0 };
      productCount[item.name].count += item.quantity;
      productCount[item.name].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productCount).sort((a, b) => b.count - a.count).slice(0, 5);

  // Pedidos por estado
  const byStatus = Object.entries(ORDER_STATUS).map(([key, cfg]) => ({
    key, label: cfg.label, count: orders.filter(o => o.status === key).length,
    color: cfg.color, bg: cfg.bg,
  })).filter(s => s.count > 0);

  // Ventas por día (últimos 7 días demo)
  const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const demoSales = [45000, 78000, 62000, 95000, 110000, 145000, 88000];
  const maxSale = Math.max(...demoSales);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ingresos totales', value: `$${totalRevenue > 0 ? totalRevenue.toLocaleString() : '623.000'}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pedidos entregados', value: String(delivered.length || 12), icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ticket promedio', value: `$${avgTicket > 0 ? avgTicket.toLocaleString() : '51.900'}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Productos en menú', value: String(products.length || 7), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ventas últimos 7 días */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            Ventas últimos 7 días (Ibagué)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {demoSales.map((val, i) => {
              const h = Math.round((val / maxSale) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground">${(val/1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all" style={{ height: '100%' }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{DAYS[i]}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Productos más vendidos */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            Productos más vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(topProducts.length > 0 ? topProducts : [
            { name: 'Lechona Tolimense Completa', count: 34, revenue: 952000 },
            { name: 'Combo Lechona Familiar',     count: 18, revenue: 1350000 },
            { name: 'Tamal Tolimense',            count: 27, revenue: 324000 },
            { name: 'Sancocho de Gallina Criolla',count: 15, revenue: 330000 },
            { name: 'Avena Tolimense Caliente',   count: 42, revenue: 210000 },
          ]).map((p, i) => {
            const maxCount = topProducts.length > 0 ? topProducts[0].count : 42;
            const pct = Math.round((p.count / maxCount) * 100);
            return (
              <div key={p.name} className="flex items-center gap-3 mb-3 last:mb-0">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{p.count} uds</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600 shrink-0 w-20 text-right">
                  ${p.revenue.toLocaleString()}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Pedidos por estado */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Distribución de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(byStatus.length > 0 ? byStatus : [
              { key: 'delivered', label: 'Entregados', count: 12, color: 'text-gray-600', bg: 'bg-gray-50' },
              { key: 'preparing', label: 'Preparando', count: 2,  color: 'text-blue-700', bg: 'bg-blue-50' },
              { key: 'pending',   label: 'Pendientes', count: 1,  color: 'text-amber-700', bg: 'bg-amber-50' },
            ]).map(s => (
              <div key={s.key} className={`${s.bg} rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Promos ──────────────────────────────────────────────────────────────
function PromosTab({ products }: { products: SellerProduct[] }) {
  const { editProduct } = useSellerStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountPct, setDiscountPct] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  const displayProducts: SellerProduct[] = products.length > 0 ? products : [
    { id: 'd1', restaurantId: 'demo', name: 'Lechona Tolimense Completa', description: '', price: 28000, image: '', category: 'principales', available: true, isPopular: true, discount: 15 },
    { id: 'd2', restaurantId: 'demo', name: 'Combo Lechona Familiar',     description: '', price: 75000, image: '', category: 'combos',     available: true, isPopular: true, discount: undefined },
    { id: 'd3', restaurantId: 'demo', name: 'Tamal Tolimense',            description: '', price: 12000, image: '', category: 'entradas',   available: true, isPopular: false, discount: 20 },
    { id: 'd4', restaurantId: 'demo', name: 'Sancocho de Gallina Criolla',description: '', price: 22000, image: '', category: 'principales', available: true, isPopular: false, discount: undefined },
  ];

  const withDiscount = displayProducts.filter(p => p.discount && p.discount > 0);
  const withoutDiscount = displayProducts.filter(p => !p.discount || p.discount === 0);

  const handleApply = async () => {
    if (!selectedProductId) { toast.error('Selecciona un producto'); return; }
    if (discountPct < 1 || discountPct > 80) { toast.error('El descuento debe estar entre 1% y 80%'); return; }
    setIsSaving(true);
    try {
      await editProduct(selectedProductId, { discount: discountPct });
      toast.success(`Descuento del ${discountPct}% aplicado`);
      setShowForm(false);
      setSelectedProductId('');
      setDiscountPct(10);
    } catch {
      toast.error('Error al aplicar el descuento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await editProduct(id, { discount: undefined });
      toast.success('Descuento eliminado');
    } catch {
      toast.error('Error al eliminar el descuento');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Promociones activas</h2>
          <p className="text-xs text-muted-foreground">{withDiscount.length} productos con descuento</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(p => !p)}
          className="rounded-xl gap-1.5 bg-primary hover:bg-primary/90 text-white"
        >
          <Tag className="w-4 h-4" />
          {showForm ? 'Cancelar' : 'Nueva promo'}
        </Button>
      </div>

      {/* Formulario nueva promo */}
      {showForm && (
        <Card className="border-0 shadow-sm rounded-2xl border-l-4 border-l-primary">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-bold text-foreground">Aplicar descuento</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Producto</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecciona un producto..." />
                </SelectTrigger>
                <SelectContent>
                  {withoutDiscount.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — ${p.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Descuento (%)</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={discountPct}
                  onChange={e => setDiscountPct(Number(e.target.value))}
                  min={1} max={80}
                  className="rounded-xl w-24"
                />
                <div className="flex gap-2">
                  {[10, 15, 20, 25, 30].map(n => (
                    <button
                      key={n}
                      onClick={() => setDiscountPct(n)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        discountPct === n
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {n}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {selectedProductId && (
              <div className="p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground">
                {(() => {
                  const p = displayProducts.find(x => x.id === selectedProductId);
                  if (!p) return null;
                  const discounted = Math.round(p.price * (1 - discountPct / 100));
                  return (
                    <span>
                      Precio original: <strong>${p.price.toLocaleString()}</strong>
                      {' → '}
                      Precio con descuento: <strong className="text-primary">${discounted.toLocaleString()}</strong>
                    </span>
                  );
                })()}
              </div>
            )}
            <Button
              onClick={handleApply}
              disabled={isSaving || !selectedProductId}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Tag className="w-4 h-4 mr-2" />}
              Aplicar descuento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Productos con descuento */}
      {withDiscount.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Con descuento activo</p>
          {withDiscount.map(p => {
            const discounted = Math.round(p.price * (1 - (p.discount ?? 0) / 100));
            return (
              <Card key={p.id} className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <SafeImage src={p.image} alt={p.name} type="product"
                    className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs line-through text-muted-foreground">${p.price.toLocaleString()}</span>
                      <span className="text-xs font-bold text-primary">${discounted.toLocaleString()}</span>
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">
                        -{p.discount}%
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(p.id)}
                    className="h-7 px-2 rounded-lg text-xs text-destructive hover:text-destructive shrink-0"
                  >
                    <X className="w-3 h-3 mr-1" /> Quitar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">🏷️</p>
          <p className="text-sm font-semibold text-foreground">Sin promociones activas</p>
          <p className="text-xs text-muted-foreground mt-1">Crea tu primera promoción para atraer más clientes</p>
        </div>
      )}

      {/* Productos sin descuento */}
      {withoutDiscount.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sin descuento</p>
          {withoutDiscount.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border/60">
              <SafeImage src={p.image} alt={p.name} type="product"
                className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">${p.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => { setSelectedProductId(p.id); setShowForm(true); }}
                className="text-xs text-primary hover:text-primary/80 font-semibold shrink-0"
              >
                + Promo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Photos ──────────────────────────────────────────────────────────────
function PhotosTab({
  restaurantId,
  profile,
}: {
  restaurantId: string;
  profile: ReturnType<typeof useSellerStore.getState>['profile'];
}) {
  const { updateProfile } = useSellerStore();
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{
    logo?: string;
    banner?: string;
    gallery: string[];
  }>({
    logo:    profile?.logo    ?? '',
    banner:  profile?.banner  ?? '',
    gallery: profile?.images  ?? [],
  });

  const handleUpload = async (
    file: File,
    type: 'logo' | 'banner' | 'gallery'
  ) => {
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    if (!user) return;

    setUploading(type);
    try {
      const url = await uploadFile(file, type === 'gallery' ? 'gallery' : type, user.id);

      if (type === 'logo') {
        await updateProfile({ logo: url });
        setPreviews(p => ({ ...p, logo: url }));
        toast.success('Logo actualizado');
      } else if (type === 'banner') {
        await updateProfile({ banner: url });
        setPreviews(p => ({ ...p, banner: url }));
        toast.success('Banner actualizado');
      } else {
        const newGallery = [...(previews.gallery ?? []), url];
        await updateProfile({ images: newGallery });
        setPreviews(p => ({ ...p, gallery: newGallery }));
        toast.success('Foto agregada a la galería');
      }
    } catch {
      toast.error('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveGallery = async (url: string) => {
    const newGallery = previews.gallery.filter(u => u !== url);
    await updateProfile({ images: newGallery });
    setPreviews(p => ({ ...p, gallery: newGallery }));
    toast.success('Foto eliminada');
  };

  const UploadZone = ({
    label, hint, current, type, aspect,
  }: {
    label: string; hint: string;
    current?: string; type: 'logo' | 'banner' | 'gallery';
    aspect: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoading = uploading === type;

    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {current ? (
          <div className={`relative rounded-2xl overflow-hidden border border-border ${aspect}`}>
            <img src={current} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="bg-white text-foreground text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Cambiar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className={`w-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 ${aspect}`}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Subir {label}</span>
                <span className="text-[10px] text-muted-foreground">{hint}</span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f, type);
            e.target.value = '';
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3">
        <Camera className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Fotos de tu restaurante</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sube el logo, banner y galería de fotos. Se muestran automáticamente
            en tu perfil público del marketplace.
          </p>
        </div>
      </div>

      {/* Logo */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Logo del restaurante</h3>
          <div className="flex items-start gap-6">
            <UploadZone
              label="Logo"
              hint="JPG, PNG · Cuadrado · Máx 5MB"
              current={previews.logo}
              type="logo"
              aspect="h-32 w-32"
            />
            <div className="flex-1 text-xs text-muted-foreground space-y-1.5 pt-2">
              <p>• Tamaño recomendado: <strong>400×400px</strong></p>
              <p>• Formato cuadrado</p>
              <p>• Se muestra en la tarjeta del restaurante</p>
              <p>• Máximo 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Banner del restaurante</h3>
          <UploadZone
            label="Banner"
            hint="JPG, PNG · 1200×400px recomendado · Máx 5MB"
            current={previews.banner}
            type="banner"
            aspect="h-40"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Se muestra en la parte superior del perfil de tu restaurante.
          </p>
        </CardContent>
      </Card>

      {/* Galería */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">
              Galería de fotos ({previews.gallery.length}/8)
            </h3>
            {previews.gallery.length < 8 && (
              <label className="flex items-center gap-1.5 text-xs font-semibold text-primary cursor-pointer hover:text-primary/80 transition-colors">
                <Plus className="w-4 h-4" />
                Agregar foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'gallery');
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>

          {previews.gallery.length === 0 ? (
            <label className="w-full h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              {uploading === 'gallery' ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Sube fotos de tus platos, local o ambiente
                  </span>
                  <span className="text-[10px] text-muted-foreground">JPG, PNG · Máx 5MB por foto</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f, 'gallery');
                  e.target.value = '';
                }}
              />
            </label>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.gallery.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveGallery(url)}
                      className="w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {previews.gallery.length < 8 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  {uploading === 'gallery' ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Agregar</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f, 'gallery');
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
          )}
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
        image: imageUrl || '/images/products/product-placeholder.svg',
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
