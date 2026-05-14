/**
 * ReviewSection — Sistema de opiniones con calificaciones por categorías
 *
 * Categorías: Sabor · Atención · Rapidez · Precio
 * Promedio general = media de las 4 categorías
 * Solo usuarios autenticados pueden opinar
 * Badge "Compra verificada" si el usuario tiene un pedido en ese restaurante
 */
import { useState, useEffect, useCallback } from 'react';
import {
  BadgeCheck, ShoppingBag, Filter, X, Loader2,
  MessageSquarePlus, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';
import {
  getReviewsByRestaurant,
  getReviewStats,
  createReview,
  hasUserReviewedRestaurant,
} from '../../../firebase/firestore.service';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import type { Review, ReviewStats, ReviewFilter, ReviewRatings } from '../../types';

// ─── Constantes ───────────────────────────────────────────────────────────────
const CATEGORIES: { key: keyof ReviewRatings; label: string; emoji: string }[] = [
  { key: 'sabor',    label: 'Sabor',    emoji: '🍽️' },
  { key: 'atencion', label: 'Atención', emoji: '🤝' },
  { key: 'rapidez',  label: 'Rapidez',  emoji: '⚡' },
  { key: 'precio',   label: 'Precio',   emoji: '💰' },
];

const SCORE_LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
const SCORE_COLORS = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-600'];
const SCORE_BG    = ['', 'bg-red-50',   'bg-orange-50',   'bg-yellow-50',   'bg-lime-50',   'bg-green-50'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7)  return `${days} días atrás`;
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`;
  return `${Math.floor(days / 30)} meses atrás`;
}

function calcAvg(r: ReviewRatings): number {
  return Math.round(((r.sabor + r.atencion + r.rapidez + r.precio) / 4) * 10) / 10;
}

// ─── ScoreDot — indicador visual de puntuación ────────────────────────────────
function ScoreDot({ value }: { value: number }) {
  const color = value >= 4.5 ? 'bg-green-500' : value >= 3.5 ? 'bg-lime-500' : value >= 2.5 ? 'bg-yellow-500' : 'bg-red-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${color} shrink-0`} />;
}

// ─── CategoryRatingInput ──────────────────────────────────────────────────────
function CategoryRatingInput({
  label, emoji, value, onChange,
}: {
  label: string; emoji: string; value: number; onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 w-24 shrink-0">
        <span className="text-base">{emoji}</span>
        <span className="text-xs font-semibold text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
              n <= active
                ? `${SCORE_BG[active]} ${SCORE_COLORS[active]} border-current`
                : 'bg-muted text-muted-foreground border-transparent hover:border-border'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <span className={`text-[11px] font-semibold w-16 text-right shrink-0 ${active ? SCORE_COLORS[active] : 'text-muted-foreground'}`}>
        {active ? SCORE_LABELS[active] : '—'}
      </span>
    </div>
  );
}

// ─── CategoryBar — barra de promedio por categoría ────────────────────────────
function CategoryBar({ label, emoji, value }: { label: string; emoji: string; value: number }) {
  const pct = (value / 5) * 100;
  const color = value >= 4 ? 'bg-green-500' : value >= 3 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{emoji}</span>
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-foreground w-6 text-right shrink-0">{value || '—'}</span>
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const initials = review.userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const avg = review.ratings ? calcAvg(review.ratings) : review.rating;
  const longComment = review.comment.length > 160;

  return (
    <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-border"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-foreground">{review.userName}</h4>
                  {review.verifiedPurchase ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] gap-0.5 px-1.5 py-0 h-4">
                      <BadgeCheck className="w-2.5 h-2.5" />
                      Verificado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                      Registrado
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{timeAgo(review.createdAt)}</p>
              </div>

              {/* Promedio general */}
              <div className="flex items-center gap-1 shrink-0 bg-muted rounded-xl px-2 py-1">
                <ScoreDot value={avg} />
                <span className="text-sm font-bold text-foreground">{avg.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">/5</span>
              </div>
            </div>

            {/* Calificaciones por categoría */}
            {review.ratings && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 p-2.5 bg-muted/40 rounded-xl">
                {CATEGORIES.map(({ key, label, emoji }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="text-xs">{emoji}</span>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <span className={`text-[11px] font-bold ml-auto ${SCORE_COLORS[review.ratings[key]] || 'text-foreground'}`}>
                      {review.ratings[key]}/5
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Comentario */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {longComment && !expanded
                ? `${review.comment.slice(0, 160)}…`
                : review.comment}
            </p>
            {longComment && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary mt-1 hover:text-primary/80 transition-colors"
              >
                {expanded ? <><ChevronUp className="w-3 h-3" /> Ver menos</> : <><ChevronDown className="w-3 h-3" /> Ver más</>}
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
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── WriteReviewModal ─────────────────────────────────────────────────────────
function WriteReviewModal({
  open, onClose, restaurantId, restaurantName, onSuccess,
}: {
  open: boolean; onClose: () => void;
  restaurantId: string; restaurantName: string;
  onSuccess: () => void;
}) {
  const { user } = useAuthStore();
  const [ratings, setRatings] = useState<ReviewRatings>({ sabor: 0, atencion: 0, rapidez: 0, precio: 0 });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avg = ratings.sabor && ratings.atencion && ratings.rapidez && ratings.precio
    ? calcAvg(ratings)
    : null;

  const allRated = Object.values(ratings).every((v) => v > 0);

  const handleSubmit = async () => {
    if (!user) return;
    if (!allRated) { toast.error('Califica todas las categorías'); return; }
    if (comment.trim().length < 10) { toast.error('El comentario debe tener al menos 10 caracteres'); return; }

    setIsSubmitting(true);
    try {
      await createReview({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        restaurantId,
        ratings,
        comment: comment.trim(),
        verifiedPurchase: false, // se actualiza desde el backend si tiene pedido
        helpful: 0,
      });
      toast.success('¡Opinión publicada! Gracias por tu reseña 🙏');
      onSuccess();
      handleClose();
    } catch {
      toast.error('Error al publicar la opinión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRatings({ sabor: 0, atencion: 0, rapidez: 0, precio: 0 });
    setComment('');
    onClose();
  };

  const setCategory = (key: keyof ReviewRatings, value: number) =>
    setRatings((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent px-6 pt-6 pb-7 text-center relative">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="text-3xl mb-2">⭐</div>
          <DialogTitle className="text-white text-lg font-bold">
            ¿Cómo estuvo tu experiencia?
          </DialogTitle>
          <DialogDescription className="text-white/75 text-xs mt-1">
            {restaurantName}
          </DialogDescription>
          {avg !== null && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <span className="text-white text-sm font-bold">{avg.toFixed(1)}</span>
              <span className="text-white/70 text-xs">promedio</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Calificaciones por categoría */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">
              Califica cada aspecto
            </p>
            {CATEGORIES.map(({ key, label, emoji }) => (
              <CategoryRatingInput
                key={key}
                label={label}
                emoji={emoji}
                value={ratings[key]}
                onChange={(v) => setCategory(key, v)}
              />
            ))}
          </div>

          {/* Comentario */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Tu opinión *</span>
              <span className="text-muted-foreground font-normal">{comment.length}/400</span>
            </label>
            <Textarea
              placeholder="Cuéntanos sobre la comida, el servicio, el tiempo de entrega..."
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 400))}
              className="rounded-xl resize-none text-sm"
              rows={4}
            />
          </div>

          {/* Info usuario */}
          {user && (
            <div className="flex items-center gap-2.5 p-3 bg-muted/50 rounded-xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{user.name.charAt(0)}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !allRated || comment.trim().length < 10}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Publicando...</>
                : 'Publicar opinión'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ReviewSection ───────────────────────────────────────────────────────
interface ReviewSectionProps {
  restaurantId: string;
  restaurantName: string;
}

export function ReviewSection({ restaurantId, restaurantName }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [stats, setStats]         = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter]       = useState<ReviewFilter>('recent');
  const [showModal, setShowModal] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

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
      hasUserReviewedRestaurant(user.id, restaurantId).then(setAlreadyReviewed);
    }
  }, [user, restaurantId]);

  const filteredReviews = [...reviews].sort((a, b) => {
    if (filter === 'best')     return b.rating - a.rating;
    if (filter === 'verified') return (b.verifiedPurchase ? 1 : 0) - (a.verifiedPurchase ? 1 : 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const avg   = stats?.average ?? 0;
  const total = stats?.total ?? 0;
  const dist  = stats?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const cats  = stats?.categoryAverages ?? { sabor: 0, atencion: 0, rapidez: 0, precio: 0 };

  return (
    <div className="space-y-5">
      {/* Stats card */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          {/* Promedio general + distribución */}
          <div className="flex items-start gap-5 mb-4">
            <div className="text-center shrink-0">
              <p className="text-5xl font-bold text-foreground leading-none tabular-nums">
                {avg ? avg.toFixed(1) : '—'}
              </p>
              <div className="flex items-center gap-0.5 justify-center mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-sm transition-colors ${
                      s <= Math.round(avg) ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {total} {total === 1 ? 'opinión' : 'opiniones'}
              </p>
            </div>

            {/* Barras de distribución */}
            <div className="flex-1 space-y-1">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const pct = total > 0 ? Math.round((dist[star] / total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3 text-right">{star}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-5 text-right">{dist[star]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promedios por categoría */}
          {total > 0 && (
            <div className="space-y-2 pt-3 border-t border-border">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                Promedio por categoría
              </p>
              {CATEGORIES.map(({ key, label, emoji }) => (
                <CategoryBar key={key} label={label} emoji={emoji} value={cats[key]} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-border">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                Inicia sesión con Google para dejar tu opinión
              </div>
            ) : alreadyReviewed ? (
              <div className="flex items-center justify-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl p-2.5">
                <BadgeCheck className="w-4 h-4" />
                Ya dejaste una opinión para este restaurante
              </div>
            ) : (
              <Button
                onClick={() => setShowModal(true)}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white gap-2"
                size="sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Escribir una opinión
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      {total > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {([
            { id: 'recent'   as ReviewFilter, label: 'Recientes' },
            { id: 'best'     as ReviewFilter, label: 'Mejor calificadas' },
            { id: 'verified' as ReviewFilter, label: 'Verificadas' },
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

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <ReviewSkeleton key={i} />)}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⭐</div>
          <p className="text-sm font-semibold text-foreground mb-1">Sin opiniones aún</p>
          <p className="text-xs text-muted-foreground">
            ¡Sé el primero en opinar sobre este restaurante!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <WriteReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        onSuccess={loadData}
      />
    </div>
  );
}
