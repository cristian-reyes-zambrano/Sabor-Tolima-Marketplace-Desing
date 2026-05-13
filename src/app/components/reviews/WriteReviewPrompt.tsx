/**
 * WriteReviewPrompt — Notificación post-pedido para dejar reseña
 * Aparece en la página de pedidos cuando hay un pedido entregado sin reseña
 */
import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../ui/button';
import { WriteReviewModal } from './WriteReviewModal';

interface WriteReviewPromptProps {
  restaurantId: string;
  restaurantName: string;
  orderId: string;
  onDismiss: () => void;
}

export function WriteReviewPrompt({
  restaurantId,
  restaurantName,
  orderId,
  onDismiss,
}: WriteReviewPromptProps) {
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <>
      <div className="relative p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl animate-fade-in">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-amber-600" />
        </button>

        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">🍽️</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              ¿Cómo estuvo tu pedido?
            </p>
            <p className="text-xs text-amber-700 mt-0.5 mb-3">
              Cuéntanos tu experiencia en <strong>{restaurantName}</strong>
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white gap-1.5 h-8 text-xs"
              >
                <Star className="w-3.5 h-3.5" />
                Dejar reseña
              </Button>
              <button
                onClick={onDismiss}
                className="text-xs text-amber-600 hover:text-amber-800 transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      </div>

      <WriteReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        onSuccess={() => { setDone(true); onDismiss(); }}
      />
    </>
  );
}
