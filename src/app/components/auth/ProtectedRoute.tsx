import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

/**
 * Protege rutas que requieren autenticación o un rol específico.
 * Redirige al login si no está autenticado.
 * Redirige al home si no tiene el rol requerido.
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirigir según el rol actual
      if (user?.role === 'seller') {
        navigate('/seller-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, isInitialized, requiredRole, navigate, redirectTo]);

  // Mostrar loading mientras se inicializa Firebase Auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍲</span>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
