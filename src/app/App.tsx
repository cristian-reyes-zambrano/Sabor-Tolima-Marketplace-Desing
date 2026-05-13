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
 * Secuencia de inicializacion al montar:
 *   1. configurePersistence()        → sesion persiste en localStorage
 *   2. handleGoogleRedirectResult()  → captura resultado si viene de Google
 *   3. initAuthListener()            → escucha cambios de sesion en tiempo real
 *
 * El GoogleRoleModal vive aqui (nivel raiz) para que aparezca correctamente
 * despues del redirect de Google, cuando el AuthModal ya no esta abierto.
 */
export default function App() {
  const {
    initAuthListener,
    setInitialized,
    handleGoogleRedirectResult,
    pendingGoogleUser,
  } = useAuthStore();

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Modo demo: no hay Firebase, marcar como inicializado de inmediato
      setInitialized(true);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      // 1. Persistencia local — la sesion sobrevive al refrescar la pagina
      await configurePersistence();

      // 2. Capturar resultado del redirect de Google (si la pagina viene de uno)
      try {
        const redirectResult = await handleGoogleRedirectResult();

        if (redirectResult?.isNewUser) {
          // Primera vez con Google → pedir que elija rol
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

      {/* Modal de seleccion de rol para usuarios nuevos de Google (post-redirect) */}
      {showRoleModal && (
        <GoogleRoleModal
          open={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          userName={pendingGoogleUser?.displayName ?? undefined}
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
