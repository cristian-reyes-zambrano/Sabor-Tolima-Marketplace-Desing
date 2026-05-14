import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster, toast } from 'sonner';
import { router } from './routes';
import { useAuthStore } from './store/useAuthStore';
import { isFirebaseConfigured, configurePersistence } from '../firebase/config';
import { GoogleRoleModal } from './components/auth/GoogleRoleModal';

/**
 * App — Punto de entrada principal
 *
 * Secuencia de inicialización al montar:
 *   1. configurePersistence()       → sesión persiste en localStorage
 *   2. handleGoogleRedirectResult() → captura resultado si viene de redirect de Google
 *   3. initAuthListener()           → escucha onAuthStateChanged en tiempo real
 *
 * El flujo Google usa popup primero; si el popup es bloqueado (COOP/Vercel/Safari)
 * cae automáticamente a redirect. El resultado del redirect se captura aquí.
 *
 * GoogleRoleModal vive a nivel raíz para aparecer correctamente después del
 * redirect, cuando el AuthModal ya no está abierto.
 */
export default function App() {
  const {
    initAuthListener,
    setInitialized,
    handleGoogleRedirectResult,
    pendingGoogleUser,
    user,
  } = useAuthStore();

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setInitialized(true);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      // 1. Persistencia local — la sesión sobrevive al refrescar
      await configurePersistence();

      // 2. Capturar resultado del redirect de Google (si la página viene de uno)
      try {
        const redirectResult = await handleGoogleRedirectResult();

        if (redirectResult?.isNewUser) {
          setShowRoleModal(true);
        } else if (redirectResult && !redirectResult.isNewUser) {
          toast.success('¡Bienvenido de nuevo! 👋');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al autenticar con Google';
        console.error('[App] Error en redirect result:', msg);
        toast.error(msg);
      }

      // 3. Listener de onAuthStateChanged — mantiene el estado sincronizado
      unsubscribe = initAuthListener();
    };

    init();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />

      {/* Modal de selección de rol para usuarios nuevos de Google */}
      {showRoleModal && (
        <GoogleRoleModal
          open={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          userName={pendingGoogleUser?.displayName ?? user?.name ?? undefined}
        />
      )}

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}
