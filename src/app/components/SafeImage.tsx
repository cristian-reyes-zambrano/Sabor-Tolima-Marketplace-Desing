/**
 * SafeImage — Imagen con cadena de fallback de 3 niveles:
 *   1. src (foto local /images/restaurants/rest-N.jpg)
 *   2. fallbackSrc (URL de Unsplash de referencia)
 *   3. placeholder SVG local
 *
 * Uso básico:
 *   <SafeImage src="/images/restaurants/rest-1.jpg" alt="..." type="restaurant" />
 *
 * Con fallback de Unsplash:
 *   <SafeImage
 *     src={getRestaurantImage(id)}
 *     fallbackSrc={getRestaurantFallback(id)}
 *     alt="..." type="restaurant"
 *   />
 */
import { useState, useCallback } from 'react';

export const PLACEHOLDERS = {
  restaurant: '/images/restaurants/restaurant-placeholder.svg',
  product:    '/images/products/product-placeholder.svg',
  user:       '/images/users/user-placeholder.svg',
} as const;

export type PlaceholderType = keyof typeof PLACEHOLDERS;

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  type?: PlaceholderType;
  /** URL de segundo fallback (ej: Unsplash) antes del placeholder SVG */
  fallbackSrc?: string;
  wrapperClassName?: string;
}

export function SafeImage({
  src,
  alt,
  type = 'restaurant',
  fallbackSrc,
  className,
  wrapperClassName,
  ...rest
}: SafeImageProps) {
  const placeholder = PLACEHOLDERS[type];

  const initial = src && src.trim() !== '' ? src : (fallbackSrc ?? placeholder);
  const [imgSrc, setImgSrc] = useState<string>(initial);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = useCallback(() => {
    setErrorCount(prev => {
      const next = prev + 1;
      if (next === 1 && fallbackSrc && imgSrc !== fallbackSrc) {
        // Primer error: intentar Unsplash
        setImgSrc(fallbackSrc);
      } else if (next >= 2 || !fallbackSrc) {
        // Segundo error o sin fallback: usar placeholder SVG
        setImgSrc(placeholder);
      }
      return next;
    });
  }, [fallbackSrc, placeholder, imgSrc]);

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

// ─── AvatarImage ──────────────────────────────────────────────────────────────
interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  initial?: string;
  initialClassName?: string;
}

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
