/**
 * GoogleLoginButton — Botón profesional de inicio de sesión con Google
 *
 * ─── DÓNDE MODIFICAR ────────────────────────────────────────────────────────
 * • Logo Google: el SVG inline está en este mismo archivo (busca "GoogleLogo")
 * • Texto del botón: prop `label` (default: "Continuar con Google")
 * • Estilos: clases Tailwind en el <button> de abajo
 * • Lógica: useAuthStore → loginWithGoogle()
 * ────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

// ─── Logo oficial de Google (SVG inline, sin dependencias externas) ───────────
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface GoogleLoginButtonProps {
  label?: string;
  onSuccess?: (isNewUser: boolean) => void;
  onError?: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GoogleLoginButton({
  label = 'Continuar con Google',
  onSuccess,
  onError,
  className = '',
  size = 'md',
}: GoogleLoginButtonProps) {
  const { loginWithGoogle, isLoading } = useAuthStore();
  const [localLoading, setLocalLoading] = useState(false);

  const loading = isLoading || localLoading;

  const sizeClasses = {
    sm: 'h-9 text-xs px-4 gap-2',
    md: 'h-11 text-sm px-5 gap-3',
    lg: 'h-13 text-base px-6 gap-3',
  };

  const handleClick = async () => {
    if (loading) return;
    setLocalLoading(true);
    try {
      const result = await loginWithGoogle();
      onSuccess?.(result.isNewUser);
    } catch (err: unknown) {
      const msg = translateGoogleError(
        err instanceof Error ? err.message : 'Error desconocido'
      );
      toast.error(msg);
      onError?.(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`
        relative w-full flex items-center justify-center
        bg-white border border-[#dadce0] rounded-xl
        font-medium text-[#3c4043] select-none
        transition-all duration-200
        hover:bg-[#f8f9fa] hover:border-[#c6c6c6] hover:shadow-md
        active:bg-[#f1f3f4] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]/40
        shadow-sm
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label="Iniciar sesión con Google"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-[#4285F4] shrink-0" />
          <span>Conectando...</span>
        </>
      ) : (
        <>
          <GoogleLogo size={size === 'sm' ? 16 : size === 'lg' ? 22 : 20} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

// ─── Traducción de errores de Google/Firebase ─────────────────────────────────
function translateGoogleError(msg: string): string {
  if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request'))
    return 'Ventana de Google cerrada. Intenta de nuevo.';
  if (msg.includes('popup-blocked'))
    return 'El navegador bloqueó la ventana. Permite popups para este sitio.';
  if (msg.includes('account-exists-with-different-credential'))
    return 'Ya existe una cuenta con este correo. Usa email y contraseña.';
  if (msg.includes('network-request-failed'))
    return 'Sin conexión a internet. Verifica tu red.';
  if (msg.includes('too-many-requests'))
    return 'Demasiados intentos. Espera unos minutos.';
  if (msg.includes('user-disabled'))
    return 'Esta cuenta ha sido deshabilitada.';
  if (msg.includes('internal-error'))
    return 'Error interno. Verifica la configuración de Firebase.';
  return 'Error al iniciar sesión con Google. Intenta de nuevo.';
}
