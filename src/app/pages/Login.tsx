import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChefHat } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // If already authenticated, redirect home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg mb-4">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Sabor Tolima</h1>
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>

      <AuthModal
        open={!isAuthenticated}
        onClose={() => navigate('/')}
        defaultMode="login"
      />
    </div>
  );
}
