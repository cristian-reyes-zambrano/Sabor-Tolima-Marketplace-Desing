/**
 * ReviewSection — Sistema completo de reseñas
 * Incluye: stats, filtros, lista, formulario y skeleton loaders
 */
import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, Camera, BadgeCheck, ShoppingBag, Filter, X, Loader2, ImagePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';
import {
  getReviewsByRestaurant,
  getReviewStats,
  createReview,
  hasUserReviewedRestaurant,
} from '../../../firebase/firestore.service';
import { uploadFile, validateImageFile } from '../../../firebase/storage.service';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import type { Review, ReviewStats, ReviewFilter } from '../../types';

interface ReviewSectionProps {
  restaurantId: string;
  restaurantName: string;
}

// ─── Star Rating Input ────────────────────────────────────────────────────────
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-9 h-9 transition-colors duration-150 ${
                star <= (hovered || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="text-sm font-semibold text-foreground animate-fade-in">
          {labels[hovered || value]}
        </p>
      )}
    </div>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-3 text-right">{star}</span>
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const initials = review.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `${days} días atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  };

  return (
    <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-foreground">{review.userName}</h4>
                  {review.verifiedPurchase && (
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] gap-0.5 px-1.5 py-0">
                      <BadgeCheck className="w-2.5 h-2.5" />
                      Compra verificada
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {timeAgo(review.createdAt)}
                </p>
              </div>
              {/* Stars */}
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {review.comment}
            </p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Foto ${i + 1}`}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-border"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Helpful */}
            {(review.helpful ?? 0) > 0 && (
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{review.helpful} personas encontraron esto útil</span>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Write Review Modal ───────────────────────────────────────────────────────
function WriteReviewModal({
  open,
  onClose,
  restaurantId,
  restaurantName,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
  onSuccess: () => void;
}) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageAdd = (files: FileList | null) => {
    if (!files) return;
    const valid: File[] = [];
    const previews: string[] = [];
    Array.from(files).slice(0, 3 - images.length).forEach((file) => {
      const err = validateImageFile(file);
      if (err) { toast.error(err); return; }
      valid.push(file);
      previews.push(URL.createObjectURL(file));
    });
    setImages((prev) => [...prev, ...valid]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (rating === 0) { toast.error('Selecciona una calificación'); return; }
    if (comment.trim().length < 10) { toast.error('El comentario debe tener al menos 10 caracteres'); return; }

    setIsSubmitting(true);
    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadFile(img, 'products', user.id);
        imageUrls.push(url);
      }

      await createReview({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        restaurantId,
        rating,
        comment: comment.trim(),
        images: imageUrls,
        verifiedPurchase: true,
        helpful: 0,
      });

      toast.success('¡Reseña publicada! Gracias por tu opinión 🙏');
      onSuccess();
      onClose();
    } catch {
      toast.error('Error al publicar la reseña. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setImages([]);
    setImagePreviews([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent px-6 pt-6 pb-8 text-center">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="text-3xl mb-2">⭐</div>
          <DialogTitle className="text-white text-lg font-bold">
            ¿Cómo estuvo tu experiencia?
          </DialogTitle>
          <DialogDescription className="text-white/75 text-xs mt-1">
            {restaurantName}
          </DialogDescription>
        </div>

        <div className="p-5 space-y-5">
          {/* Stars */}
          <StarRatingInput value={rating} onChange={setRating} />

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tu opinión *
              <span className="text-muted-foreground font-normal ml-1">
                ({comment.length}/300)
              </span>
            </label>
            <Textarea
              placeholder="Cuéntanos sobre la comida, el servicio, el tiempo de entrega..."
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              className="rounded-xl resize-none text-sm"
              rows={4}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Fotos (opcional · máx 3)
            </label>
            <div className="flex gap-2 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-border" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 3 && (
                <label className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Agregar</span>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => handleImageAdd(e.target.files)} />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Publicando...</>
              ) : (
                'Publicar reseña'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ReviewSection ───────────────────────────────────────────────────────
export function ReviewSection({ restaurantId, restaurantName }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ReviewFilter>('recent');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [canReview, setCanReview] = useState(true); // simplified: allow all authenticated users

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reviewData, statsData] = await Promise.all([
        getReviewsByRestaurant(restaurantId),
        getReviewStats(restaurantId),
      ]);
      setReviews(reviewData);
      setStats(statsData);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (user) {
      hasUserReviewedRestaurant(user.id, restaurantId).then((has) => setCanReview(!has));
    }
  }, [user, restaurantId]);

  // Apply filter
  const filteredReviews = [...reviews].sort((a, b) => {
    if (filter === 'best') return b.rating - a.rating;
    if (filter === 'photos') return (b.images?.length ?? 0) - (a.images?.length ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).filter((r) => filter !== 'photos' || (r.images?.length ?? 0) > 0);

  const avgRating = stats?.average ?? 0;
  const totalReviews = stats?.total ?? 0;
  const dist = stats?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="space-y-5">
      {/* Stats card */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-6">
            {/* Big number */}
            <div className="text-center shrink-0">
              <p className="text-5xl font-bold text-foreground leading-none">{avgRating || '—'}</p>
              <div className="flex items-center gap-0.5 justify-center mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((star) => (
                <RatingBar key={star} star={star} count={dist[star]} total={totalReviews} />
              ))}
            </div>
          </div>

          {/* Write review CTA */}
          <div className="mt-4 pt-4 border-t border-border">
            {!isAuthenticated ? (
              <p className="text-xs text-center text-muted-foreground">
                Inicia sesión para dejar una reseña
              </p>
            ) : canReview ? (
              <Button
                onClick={() => setShowWriteModal(true)}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white gap-2"
                size="sm"
              >
                <Star className="w-4 h-4" />
                Escribir una reseña
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl p-2.5">
                <BadgeCheck className="w-4 h-4" />
                Ya dejaste una reseña para este restaurante
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {totalReviews > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {([
            { id: 'recent' as ReviewFilter, label: 'Recientes' },
            { id: 'best' as ReviewFilter, label: 'Mejor calificadas' },
            { id: 'photos' as ReviewFilter, label: 'Con fotos' },
          ]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <ReviewSkeleton key={i} />)}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">
            {filter === 'photos' ? '📷' : '⭐'}
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {filter === 'photos' ? 'Sin reseñas con fotos' : 'Sin reseñas aún'}
          </p>
          <p className="text-xs text-muted-foreground">
            {filter === 'photos'
              ? 'Sé el primero en subir fotos de tu pedido'
              : '¡Sé el primero en opinar sobre este restaurante!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Write review modal */}
      <WriteReviewModal
        open={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        onSuccess={loadData}
      />
    </div>
  );
}
