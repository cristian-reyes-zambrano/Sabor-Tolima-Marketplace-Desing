/**
 * AuthModal — Modal de autenticación con Email y Google
 *
 * ─── DÓNDE MODIFICAR ────────────────────────────────────────────────────────
 * • Botón Google: componente <GoogleLoginButton> en ./GoogleLoginButton.tsx
 * • Logo del header: icono <ChefHat> en el bloque "Header gradient"
 * • Colores del header: clases `from-[#c62828] to-[#e65100]`
 * • Textos: busca los strings directamente en este archivo
 * • Lógica de roles: función handleLogin / handleRegister
 * ────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Mail, Eye, EyeOff, ChefHat, X, Loader2,
  ShoppingBag, Store, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { GoogleLoginButton } from './GoogleLoginButton';
import { GoogleRoleModal } from './GoogleRoleModal';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import type { UserRole } from '../../types';

type AuthStep = 'role' | 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  redirectMessage?: string;
  forceRole?: UserRole;
}

export function AuthModal({
  open,
  onClose,
  defaultMode = 'login',
  redirectMessage,
  forceRole,
}: AuthModalProps) {
  const navigate = useNavigate();
  const { registerUser, loginUser, isLoading, user } = useAuthStore();

  const [step, setStep] = useState<AuthStep>(
    defaultMode === 'register' ? 'role' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(forceRole ?? 'customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (isRegister: boolean) => {
    const errs: Record<string, string> = {};
    if (isRegister && !form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Correo inválido';
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (isRegister && form.password !== form.confirm) errs.confirm = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(false)) return;
    try {
      const u = await loginUser(form.email, form.password);
      toast.success(`¡Bienvenido, ${u.name.split(' ')[0]}!`);
      onClose();
      if (u.role === 'seller') navigate('/seller-dashboard');
    } catch (err: unknown) {
      toast.error(translateFirebaseError(err instanceof Error ? err.message : ''));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(true)) return;
    try {
      const u = await registerUser(form.name, form.email, form.password, selectedRole);
      toast.success(`¡Cuenta creada! Bienvenido, ${u.name.split(' ')[0]}! 🎉`);
      onClose();
      if (selectedRole === 'seller') navigate('/seller-onboarding');
    } catch (err: unknown) {
      toast.error(translateFirebaseError(err instanceof Error ? err.message : ''));
    }
  };

  // ── Google login handler ──────────────────────────────────────────────────
  const handleGoogleSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      // Mostrar modal de selección de rol
      setShowRoleModal(true);
    } else {
      // Usuario existente → cerrar modal y redirigir si es seller
      toast.success(`¡Bienvenido de nuevo!`);
      onClose();
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'seller') navigate('/seller-dashboard');
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    setStep(defaultMode === 'register' ? 'role' : 'login');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          {/* Accesibilidad: título y descripción visualmente ocultos */}
          <DialogTitle className="sr-only">
            {step === 'login' ? 'Iniciar sesión' : step === 'role' ? 'Crear cuenta' : 'Registro'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {step === 'login'
              ? 'Inicia sesión con tu correo o con Google'
              : 'Crea tu cuenta en Sabor Tolima Marketplace'}
          </DialogDescription>

          {/* ── Header ── */}
          <div className="relative bg-gradient-to-br from-[#c62828] to-[#e65100] px-6 pt-6 pb-8 text-white text-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {step !== 'role' && (
              <button
                onClick={() => { resetForm(); setStep(step === 'register' ? 'role' : 'login'); }}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-3">
              <ChefHat className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white">
              {step === 'role' && 'Crear cuenta'}
              {step === 'login' && 'Bienvenido de nuevo'}
              {step === 'register' && (selectedRole === 'seller' ? 'Registro de vendedor' : 'Crear cuenta')}
            </h2>
            <p className="text-white/75 text-xs mt-1">
              {redirectMessage ?? (
                step === 'login' ? 'Inicia sesión para continuar'
                : step === 'role' ? '¿Cómo quieres usar Sabor Tolima?'
                : selectedRole === 'seller' ? 'Crea tu restaurante en minutos'
                : 'Únete a Sabor Tolima hoy'
              )}
            </p>
          </div>

          <div className="p-5">
            {/* ── STEP: Role selection ── */}
            {step === 'role' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard icon={ShoppingBag} title="Quiero comprar"
                    description="Pide comida de tus restaurantes favoritos"
                    selected={selectedRole === 'customer'} color="primary"
                    onClick={() => setSelectedRole('customer')} />
                  <RoleCard icon={Store} title="Quiero vender"
                    description="Publica tu restaurante y gestiona pedidos"
                    selected={selectedRole === 'seller'} color="accent"
                    onClick={() => setSelectedRole('seller')} />
                </div>

                <Button size="lg" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                  onClick={() => setStep('register')}>
                  Continuar como {selectedRole === 'seller' ? 'vendedor' : 'cliente'}
                </Button>

                {/* Google en registro */}
                <div className="space-y-3">
                  <DividerOr />
                  <GoogleLoginButton
                    label="Registrarse con Google"
                    onSuccess={handleGoogleSuccess}
                  />
                </div>

                <div className="text-center">
                  <button onClick={() => setStep('login')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ¿Ya tienes cuenta?{' '}
                    <span className="text-primary font-semibold">Inicia sesión</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: Login ── */}
            {step === 'login' && (
              <div className="space-y-4">
                {/* Google primero — mejor UX */}
                <GoogleLoginButton onSuccess={handleGoogleSuccess} />

                <DividerOr />

                <form onSubmit={handleLogin} className="space-y-3">
                  <FormField id="login-email" label="Correo electrónico" type="email"
                    placeholder="correo@ejemplo.com" value={form.email} error={errors.email}
                    onChange={(v) => handleChange('email', v)} />
                  <FormField id="login-password" label="Contraseña"
                    type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} error={errors.password}
                    onChange={(v) => handleChange('password', v)}
                    rightIcon={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    } />

                  <div className="text-right -mt-1">
                    <button type="button" className="text-xs text-primary hover:text-primary/80">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button type="submit" size="lg"
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                    disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Iniciar sesión
                  </Button>
                </form>

                <div className="text-center">
                  <button type="button" onClick={() => { resetForm(); setStep('role'); }}
                    className="text-sm text-muted-foreground hover:text-foreground">
                    ¿No tienes cuenta?{' '}
                    <span className="text-primary font-semibold">Regístrate</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: Register ── */}
            {step === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                  selectedRole === 'seller' ? 'bg-orange-50 text-orange-700' : 'bg-primary/5 text-primary'
                }`}>
                  {selectedRole === 'seller' ? <Store className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  Registrándote como {selectedRole === 'seller' ? 'vendedor' : 'cliente'}
                </div>

                <FormField id="reg-name" label="Nombre completo" type="text"
                  placeholder="Juan Pérez" value={form.name} error={errors.name}
                  onChange={(v) => handleChange('name', v)} />
                <FormField id="reg-email" label="Correo electrónico" type="email"
                  placeholder="correo@ejemplo.com" value={form.email} error={errors.email}
                  onChange={(v) => handleChange('email', v)} />
                <FormField id="reg-password" label="Contraseña"
                  type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                  value={form.password} error={errors.password}
                  onChange={(v) => handleChange('password', v)}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  } />
                <FormField id="reg-confirm" label="Confirmar contraseña"
                  type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña"
                  value={form.confirm} error={errors.confirm}
                  onChange={(v) => handleChange('confirm', v)}
                  rightIcon={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  } />

                {selectedRole === 'seller' && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
                    <span>Después del registro completarás el perfil de tu restaurante y subirás los documentos requeridos.</span>
                  </div>
                )}

                <Button type="submit" size="lg"
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                  disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Crear cuenta
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de selección de rol para usuarios nuevos de Google */}
      <GoogleRoleModal
        open={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          onClose();
        }}
        userName={useAuthStore.getState().pendingGoogleUser?.displayName ?? undefined}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DividerOr() {
  return (
    <div className="relative flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground font-medium px-1">o</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function RoleCard({
  icon: Icon, title, description, selected, color, onClick,
}: {
  icon: React.ElementType; title: string; description: string;
  selected: boolean; color: 'primary' | 'accent'; onClick: () => void;
}) {
  const c = {
    primary: {
      border: selected ? 'border-primary' : 'border-border',
      bg: selected ? 'bg-primary/5' : 'bg-white',
      iconBg: selected ? 'bg-primary' : 'bg-primary/10',
      iconColor: selected ? 'text-white' : 'text-primary',
      title: selected ? 'text-primary' : 'text-foreground',
    },
    accent: {
      border: selected ? 'border-accent' : 'border-border',
      bg: selected ? 'bg-accent/5' : 'bg-white',
      iconBg: selected ? 'bg-accent' : 'bg-accent/10',
      iconColor: selected ? 'text-white' : 'text-accent',
      title: selected ? 'text-accent' : 'text-foreground',
    },
  }[color];

  return (
    <button type="button" onClick={onClick}
      className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all text-center ${c.border} ${c.bg}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${c.iconBg}`}>
        <Icon className={`w-6 h-6 ${c.iconColor}`} />
      </div>
      <div>
        <p className={`text-sm font-bold ${c.title}`}>{title}</p>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{description}</p>
      </div>
      {selected && <CheckCircle2 className={`w-4 h-4 ${color === 'primary' ? 'text-primary' : 'text-accent'}`} />}
    </button>
  );
}

function FormField({
  id, label, type, placeholder, value, error, onChange, rightIcon,
}: {
  id: string; label: string; type: string; placeholder: string;
  value: string; error?: string; onChange: (v: string) => void;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">{label}</Label>
      <div className="relative">
        <Input id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-10 rounded-xl text-sm ${rightIcon ? 'pr-10' : ''} ${
            error ? 'border-destructive focus-visible:ring-destructive/20' : ''
          }`} />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function translateFirebaseError(msg: string): string {
  if (msg.includes('email-already-in-use')) return 'Este correo ya está registrado';
  if (msg.includes('wrong-password') || msg.includes('invalid-credential')) return 'Correo o contraseña incorrectos';
  if (msg.includes('user-not-found')) return 'No existe una cuenta con este correo';
  if (msg.includes('too-many-requests')) return 'Demasiados intentos. Intenta más tarde';
  if (msg.includes('network-request-failed')) return 'Sin conexión a internet';
  if (msg.includes('weak-password')) return 'La contraseña es muy débil';
  return msg || 'Error al autenticar. Intenta de nuevo.';
}
