/**
 * SafeImage — Imagen con fallback automático a placeholder local
 *
 * Detecta errores de carga (imagen rota, URL externa caída, CORS)
 * y reemplaza automáticamente por un placeholder local en public/images/.
 *
 * Uso:
 *   <SafeImage src={url} alt="nombre" type="restaurant" className="..." />
 *
 * Tipos de placeholder:
 *   "restaurant" → /images/restaurants/restaurant-placeholder.svg
 *   "product"    → /images/products/product-placeholder.svg
 *   "user"       → /images/users/user-placeholder.svg
 */
import { useState, useCallback } from 'react';

// ─── Placeholders locales (servidos desde public/) ───────────────────────────
export const PLACEHOLDERS = {
  restaurant: '/images/restaurants/restaurant-placeholder.svg',
  product:    '/images/products/product-placeholder.svg',
  user:       '/images/users/user-placeholder.svg',
} as const;

export type PlaceholderType = keyof typeof PLACEHOLDERS;

// ─── Props ────────────────────────────────────────────────────────────────────
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  /** Qué placeholder usar si la imagen falla. Default: "restaurant" */
  type?: PlaceholderType;
  /** Clases CSS para el contenedor wrapper (solo si wrapperClassName está definido) */
  wrapperClassName?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function SafeImage({
  src,
  alt,
  type = 'restaurant',
  className,
  wrapperClassName,
  ...rest
}: SafeImageProps) {
  const placeholder = PLACEHOLDERS[type];
  const [imgSrc, setImgSrc] = useState<string>(
    src && src.trim() !== '' ? src : placeholder
  );
  const [didError, setDidError] = useState(false);

  const handleError = useCallback(() => {
    if (!didError) {
      setDidError(true);
      setImgSrc(placeholder);
    }
  }, [didError, placeholder]);

  const img = (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...rest}
    />
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{img}</div>;
  }

  return img;
}

// ─── Variante circular para avatares ─────────────────────────────────────────
interface AvatarImageProps {
  src?: string | null;
  alt: string;
  /** Tamaño en px. Default: 36 */
  size?: number;
  className?: string;
  /** Inicial de fallback cuando no hay imagen (se muestra antes del error) */
  initial?: string;
  initialClassName?: string;
}

/**
 * AvatarImage — Avatar circular con fallback a inicial o placeholder.
 * Si hay `src` → intenta cargar la imagen.
 * Si falla o no hay `src` y hay `initial` → muestra la inicial.
 * Si no hay nada → muestra el placeholder de usuario.
 */
export function AvatarImage({
  src,
  alt,
  size = 36,
  className = '',
  initial,
  initialClassName = '',
}: AvatarImageProps) {
  const [imgError, setImgError] = useState(false);

  const sizeStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  // Sin src o con error → mostrar inicial o placeholder
  if (!src || imgError) {
    if (initial) {
      return (
        <div
          style={sizeStyle}
          className={`rounded-full bg-primary/10 flex items-center justify-center shrink-0 ${className}`}
        >
          <span className={`font-bold text-primary ${initialClassName}`}>
            {initial.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <img
        src={PLACEHOLDERS.user}
        alt={alt}
        style={sizeStyle}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={sizeStyle}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
}
