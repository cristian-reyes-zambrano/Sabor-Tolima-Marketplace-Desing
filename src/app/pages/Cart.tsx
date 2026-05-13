import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Trash2, Plus, Minus, CreditCard, Wallet,
  CheckCircle2, ShoppingCart, MapPin, FileText, Loader2, Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Navbar } from '../components/Navbar';
import { AuthModal } from '../components/auth/AuthModal';
import { SpecialInstructions } from '../components/cart/SpecialInstructions';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import type { AppOrder } from '../types';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, discount, total, restaurantName, placeOrder } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<AppOrder['paymentMethod']>('card');
  const [address, setAddress] = useState(user?.address ?? '');
  const [notes, setNotes] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      setShowAuth(true);
      return;
    }
    if (!address.trim()) {
      toast.error('Por favor ingresa tu dirección de entrega');
      return;
    }
    setIsOrdering(true);
    try {
      const id = await placeOrder(user.id, address, paymentMethod, notes, specialInstructions);
      setOrderId(id);
      toast.success('¡Pedido confirmado! 🎉');
    } catch {
      toast.error('Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setIsOrdering(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (orderId) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Pedido confirmado!</h2>
          <p className="text-sm text-muted-foreground mb-1">
            Pedido <span className="font-mono font-bold text-foreground">#{orderId.slice(-6).toUpperCase()}</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Clock className="w-4 h-4" />
            Tiempo estimado: <strong className="text-foreground">25-35 min</strong>
          </div>
          <div className="space-y-3">
            <Button onClick={() => navigate('/orders')} className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white">
              Ver mis pedidos
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full rounded-xl">
              Seguir explorando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mi Carrito</h1>
            <p className="text-sm text-muted-foreground">
              {items.length === 0 ? 'Vacío' : `${items.reduce((s, i) => s + i.quantity, 0)} productos`}
            </p>
          </div>
        </div>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Agrega productos de tus restaurantes favoritos para comenzar
            </p>
            <Button onClick={() => navigate('/')} className="rounded-xl bg-primary hover:bg-primary/90 text-white">
              Explorar restaurantes
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-4">
              {/* Items */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">{restaurantName}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { clearCart(); toast('Carrito vaciado', { icon: '🗑️' }); }}
                      className="text-destructive hover:text-destructive text-xs rounded-xl">
                      Vaciar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
                        <p className="text-sm font-bold text-primary mt-0.5">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => { removeItem(item.id); toast('Eliminado', { icon: '🗑️', duration: 1200 }); }}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <div className="flex items-center gap-1.5 bg-muted rounded-xl px-1 py-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Dirección de entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Dirección *</Label>
                    <Input placeholder="Ej: Calle 10 # 20-30, Apto 101" value={address}
                      onChange={(e) => setAddress(e.target.value)} className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Notas adicionales
                    </Label>
                    <Textarea placeholder="Instrucciones especiales, timbre, piso..." value={notes}
                      onChange={(e) => setNotes(e.target.value)} className="rounded-xl resize-none text-sm" rows={2} />
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <SpecialInstructions
                value={specialInstructions}
                onChange={setSpecialInstructions}
                onSkip={() => setSpecialInstructions('')}
              />

              {/* Payment */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Método de pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {([
                    { id: 'card' as const, label: 'Tarjeta de crédito/débito', sub: 'Pago seguro en línea', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { id: 'cash' as const, label: 'Efectivo', sub: 'Paga al recibir', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
                    { id: 'pse' as const, label: 'PSE / Transferencia', sub: 'Débito bancario', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
                  ] as const).map(({ id, label, sub, icon: Icon, color, bg }) => (
                    <button key={id} onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${paymentMethod === id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}>
                      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      {paymentMethod === id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="border-0 shadow-sm rounded-2xl sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground font-medium">${subtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Domicilio</span>
                      <span className="text-foreground font-medium">${deliveryFee().toLocaleString()}</span>
                    </div>
                    {discount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento</span>
                        <span className="font-medium">-${discount().toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">${total().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                      <span>⚠️</span>
                      <span>Debes iniciar sesión para confirmar tu pedido</span>
                    </div>
                  )}

                  <Button size="lg" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                    onClick={handleCheckout} disabled={isOrdering}>
                    {isOrdering ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Procesando...</>
                    ) : !isAuthenticated ? (
                      'Iniciar sesión para pedir'
                    ) : (
                      'Confirmar pedido'
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    Al confirmar aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)}
        redirectMessage="Inicia sesión para confirmar tu pedido" />
    </div>
  );
}
