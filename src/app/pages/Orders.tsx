import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, ChevronRight, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/auth/AuthModal';
import { WriteReviewPrompt } from '../components/reviews/WriteReviewPrompt';

type OrderStatus = 'preparing' | 'delivering' | 'delivered' | 'cancelled';

interface MockOrder {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: OrderStatus;
  date: string;
  estimatedTime?: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: '#IB-2024-001',
    restaurantName: 'Lechonería La Tradición Ibagueña',
    items: ['Lechona Tolimense Completa', 'Avena Tolimense Caliente'],
    total: 33000,
    status: 'delivered',
    date: 'Hoy, 12:30 PM',
  },
  {
    id: '#IB-2024-002',
    restaurantName: 'Asados El Tolimense – La Pola',
    items: ['Costillas BBQ Tolimenses', 'Chorizo Tolimense a la Parrilla', 'Limonada de Panela'],
    total: 56000,
    status: 'preparing',
    date: 'Hoy, 1:15 PM',
    estimatedTime: '25-35 min',
  },
  {
    id: '#IB-2024-003',
    restaurantName: 'Ensaladas Frescas Ambalá',
    items: ['Bowl Proteico Tolimense', 'Jugo Verde Detox Ambalá'],
    total: 42000,
    status: 'delivering',
    date: 'Ayer, 7:45 PM',
    estimatedTime: '10-15 min',
  },
  {
    id: '#IB-2024-004',
    restaurantName: 'Café Musical de Ibagué',
    items: ['Café Tolimense Espresso', 'Almojábana con Queso', 'Torta de Novia Tolimense'],
    total: 21000,
    status: 'delivered',
    date: 'Ayer, 9:00 AM',
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Package }> = {
  preparing: { label: 'Preparando', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
  delivering: { label: 'En camino', color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
  delivered: { label: 'Entregado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-destructive', bg: 'bg-destructive/10', icon: XCircle },
};

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [dismissedReviews, setDismissedReviews] = useState<string[]>([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Inicia sesión para ver tus pedidos
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Accede a tu historial completo de pedidos
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

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mis Pedidos</h1>
            <p className="text-sm text-muted-foreground">{MOCK_ORDERS.length} pedidos en Ibagué</p>
          </div>
        </div>

        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aún no tienes pedidos
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Haz tu primer pedido y aparecerá aquí
            </p>
            <Button
              onClick={() => navigate('/')}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white"
            >
              Explorar restaurantes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const StatusIcon = config.icon;
              const showReviewPrompt =
                order.status === 'delivered' &&
                !dismissedReviews.includes(order.id);
              // Mapear restaurantName a id para el WriteReviewPrompt
              const restaurantIdMap: Record<string, string> = {
                'Lechonería La Tradición Ibagueña': '1',
                'Asados El Tolimense – La Pola': '5',
                'Ensaladas Frescas Ambalá': '9',
                'Café Musical de Ibagué': '13',
              };
              const restaurantId = restaurantIdMap[order.restaurantName] ?? '1';

              return (
                <div key={order.id} className="space-y-2">
                  <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-muted-foreground">{order.id}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{order.date}</span>
                          </div>
                          <h3 className="font-bold text-sm text-foreground truncate">{order.restaurantName}</h3>
                        </div>
                        <Badge className={`${config.bg} ${config.color} border-0 text-xs gap-1 shrink-0`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                        {order.items.join(' · ')}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-foreground">
                          ${order.total.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {order.estimatedTime && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {order.estimatedTime}
                            </span>
                          )}
                          {order.status === 'delivered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs rounded-xl h-7 px-3"
                              onClick={() => navigate(`/restaurant/${restaurantId}`)}
                            >
                              Repetir
                            </Button>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prompt de reseña para pedidos entregados */}
                  {showReviewPrompt && (
                    <WriteReviewPrompt
                      restaurantId={restaurantId}
                      restaurantName={order.restaurantName}
                      orderId={order.id}
                      onDismiss={() => setDismissedReviews(prev => [...prev, order.id])}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
