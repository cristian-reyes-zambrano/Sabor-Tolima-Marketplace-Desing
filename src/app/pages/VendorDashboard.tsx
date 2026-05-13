import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Plus,
  PackageCheck,
  TrendingUp,
  DollarSign,
  Upload,
  BadgeCheck,
  FileText,
  Settings,
  Home,
  ShoppingBag,
  Store,
  ImagePlus,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function VendorDashboard() {
  const navigate = useNavigate();

  const [showAddProduct, setShowAddProduct] = useState(false);

  // Nombre del restaurante
  const [restaurant] = useState({
    name: 'Sabor Tolimense Premium',
    category: 'Comida típica',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-yellow-50">
      {/* HEADER */}
      <header className="bg-card/90 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  Panel de Vendedor
                </h1>

                <p className="text-sm text-muted-foreground truncate">
                  {restaurant.name}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2 shrink-0 rounded-xl"
            >
              <Home className="w-5 h-5" />

              <span className="hidden sm:inline">
                Ver marketplace
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* MÉTRICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ventas */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>

                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>

              <p className="text-sm text-muted-foreground">
                Ventas hoy
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-1">
                $450K
              </h2>

              <p className="text-xs text-green-600 mt-2">
                +12% respecto ayer
              </p>
            </CardContent>
          </Card>

          {/* Pedidos */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>

              <p className="text-sm text-muted-foreground">
                Pedidos activos
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-1">
                12
              </h2>

              <p className="text-xs text-muted-foreground mt-2">
                4 en preparación
              </p>
            </CardContent>
          </Card>

          {/* Productos */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <PackageCheck className="w-6 h-6 text-blue-600" />
              </div>

              <p className="text-sm text-muted-foreground">
                Productos
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-1">
                24
              </h2>

              <p className="text-xs text-muted-foreground mt-2">
                Activos en menú
              </p>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <BadgeCheck className="w-6 h-6 text-green-600" />
              </div>

              <p className="text-sm text-muted-foreground">
                Estado
              </p>

              <Badge className="mt-2 bg-green-600 text-white">
                Verificado
              </Badge>

              <p className="text-xs text-muted-foreground mt-2">
                Documentos al día
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CONTENIDO */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
            {/* PRODUCTOS */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Mis Productos
                  </CardTitle>

                  <p className="text-sm text-muted-foreground mt-1">
                    Administra el menú de {restaurant.name}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    setShowAddProduct(!showAddProduct)
                  }
                  className="gap-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </Button>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* FORMULARIO */}
                {showAddProduct && (
                  <Card className="bg-orange-50 border-orange-200 rounded-3xl">
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          Nuevo Producto
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          Este producto aparecerá en{' '}
                          {restaurant.name}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Nombre del restaurante
                        </Label>

                        <Input
                          value={restaurant.name}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Nombre del producto
                        </Label>

                        <Input placeholder="Ej: Tamal Tolimense" />
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>

                        <Input placeholder="Describe tu producto" />
                      </div>

                      <div className="space-y-2">
                        <Label>Precio</Label>

                        <Input
                          type="number"
                          placeholder="25000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Imagen del producto
                        </Label>

                        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-background">
                          <ImagePlus className="w-10 h-10 text-primary mx-auto mb-3" />

                          <p className="font-medium text-foreground">
                            Subir imagen
                          </p>

                          <p className="text-sm text-muted-foreground mt-1">
                            JPG, PNG o WEBP
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 rounded-xl">
                          Guardar producto
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            setShowAddProduct(false)
                          }
                          className="rounded-xl"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* PRODUCTOS */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className="rounded-3xl border-0 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shrink-0">
                            🍲
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                  {restaurant.name}
                                </p>

                                <h3 className="font-bold text-lg text-foreground truncate">
                                  Bandeja Paisa
                                </h3>

                                <p className="text-sm text-muted-foreground truncate">
                                  Tradicional bandeja completa
                                </p>
                              </div>

                              <Badge>
                                Activo
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xl font-bold text-primary">
                                $25.000
                              </p>

                              <div className="hidden sm:flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl"
                                >
                                  Editar
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-xl"
                                >
                                  Pausar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PEDIDOS */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Pedidos recientes
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {[
                  {
                    id: '#1234',
                    customer: 'María González',
                    total: 45000,
                    status: 'Preparando',
                  },
                  {
                    id: '#1233',
                    customer: 'Carlos Pérez',
                    total: 32000,
                    status: 'Listo',
                  },
                  {
                    id: '#1232',
                    customer: 'Ana Martínez',
                    total: 28000,
                    status: 'Entregado',
                  },
                ].map((order) => (
                  <Card
                    key={order.id}
                    className="rounded-2xl border shadow-sm hover:shadow-lg transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-foreground">
                            {order.id}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {order.customer}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            $
                            {order.total.toLocaleString()}
                          </p>

                          <Badge className="mt-1">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* DERECHA */}
          <div className="space-y-6">
            {/* VERIFICACIÓN */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-green-600" />
                  </div>

                  <div>
                    <CardTitle>
                      Verificación
                    </CardTitle>

                    <Badge className="mt-1 bg-green-600 text-white">
                      Verificado
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {[
                  'Manipulación de alimentos',
                  'Registro sanitario',
                  'Identidad verificada',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />

                      <span className="text-sm text-green-900">
                        {item}
                      </span>
                    </div>

                    <BadgeCheck className="w-4 h-4 text-green-600" />
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full rounded-xl gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Actualizar documentos
                </Button>
              </CardContent>
            </Card>

            {/* CONFIG */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>

                  <CardTitle>
                    Configuración
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {[
                  'Horarios de atención',
                  'Información del restaurante',
                  'Métodos de pago',
                  'Zonas de entrega',
                ].map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start rounded-xl"
                  >
                    {item}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}