/**
 * GoogleRoleModal — Selección de rol para usuarios nuevos de Google
 *
 * Se muestra la primera vez que alguien inicia sesión con Google.
 * El perfil YA está guardado en Firestore con rol 'customer'.
 * Este modal solo actualiza el rol si el usuario elige 'seller'.
 * Si cierra el modal sin elegir, queda como 'customer' (sin problema).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingBag, Store, ChefHat, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import type { UserRole } from '../../types';

interface GoogleRoleModalProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

export function GoogleRoleModal({ open, onClose, userName }: GoogleRoleModalProps) {
  const navigate = useNavigate();
  const { completeGoogleSignup, isLoading } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleConfirm = async () => {
    try {
      const user = await completeGoogleSignup(selectedRole);
      toast.success(`¡Bienvenido a Sabor Tolima, ${user.name.split(' ')[0]}! 🎉`);
      onClose();
      if (selectedRole === 'seller') {
        navigate('/seller-onboarding');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar tu perfil';
      toast.error(msg);
    }
  };

  // Si cierra sin elegir, queda como customer — el perfil ya está guardado
  const handleClose = () => {
    toast('Perfil guardado como cliente', { icon: '✅', duration: 2000 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        {/* Accesibilidad */}
        <DialogTitle className="sr-only">Seleccionar rol en Sabor Tolima</DialogTitle>
        <DialogDescription className="sr-only">
          Elige si quieres comprar comida o vender en la plataforma
        </DialogDescription>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#c62828] to-[#e65100] px-6 pt-6 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-3">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            ¡Hola{userName ? `, ${userName.split(' ')[0]}` : ''}!
          </h2>
          <p className="text-white/75 text-xs mt-1">
            ¿Cómo quieres usar Sabor Tolima?
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Role cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all text-center ${
                selectedRole === 'customer'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:border-border/80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                selectedRole === 'customer' ? 'bg-primary' : 'bg-primary/10'
              }`}>
                <ShoppingBag className={`w-6 h-6 ${
                  selectedRole === 'customer' ? 'text-white' : 'text-primary'
                }`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${
                  selectedRole === 'customer' ? 'text-primary' : 'text-foreground'
                }`}>
                  Quiero comprar
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Pide comida de tus restaurantes favoritos
                </p>
              </div>
              {selectedRole === 'customer' && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all text-center ${
                selectedRole === 'seller'
                  ? 'border-accent bg-accent/5'
                  : 'border-border bg-white hover:border-border/80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                selectedRole === 'seller' ? 'bg-accent' : 'bg-accent/10'
              }`}>
                <Store className={`w-6 h-6 ${
                  selectedRole === 'seller' ? 'text-white' : 'text-accent'
                }`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${
                  selectedRole === 'seller' ? 'text-accent' : 'text-foreground'
                }`}>
                  Quiero vender
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  Publica tu restaurante y gestiona pedidos
                </p>
              </div>
              {selectedRole === 'seller' && (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              )}
            </button>
          </div>

          {selectedRole === 'seller' && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-800">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
              <span>
                Completarás el perfil de tu restaurante y subirás los documentos
                requeridos en el siguiente paso.
              </span>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-11"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</>
            ) : (
              `Continuar como ${selectedRole === 'seller' ? 'vendedor' : 'cliente'}`
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Puedes cambiar tu rol más adelante desde tu perfil
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
