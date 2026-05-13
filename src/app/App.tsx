import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { useAuthStore } from './store/useAuthStore';
import { isFirebaseConfigured } from '../firebase/config';

export default function App() {
  const { initAuthListener, setInitialized } = useAuthStore();

  useEffect(() => {
    if (isFirebaseConfigured()) {
      // Firebase real: escuchar cambios de auth
      const unsubscribe = initAuthListener();
      return unsubscribe;
    } else {
      // Modo demo: marcar como inicializado inmediatamente
      setInitialized(true);
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
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
