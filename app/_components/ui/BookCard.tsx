'use client';

import { useState } from 'react';

interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  review: string;
  color: string;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Texto oscuro o claro, el que más contraste dé sobre el color del libro. */
function readableOn(hex: string): string {
  const bg = luminance(hex);
  const withDark = (bg + 0.05) / (luminance('#2a0a15') + 0.05);
  const withLight = 1.05 / (bg + 0.05);
  return withDark >= withLight ? '#2a0a15' : '#fff5f8';
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Portada que se gira para mostrar la reseña (clic, toque, Enter o Espacio; hover con mouse). */
export function BookCard({ title, author, cover, review, color }: BookCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ink = readableOn(color);

  return (
    <button
      type="button"
      className="book-card"
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="book-card-inner">
        {/* Portada: decorativa para lectores de pantalla, el contenido está en el reverso */}
        <span className="book-card-face" aria-hidden>
          {imgError ? (
            <span
              className="flex h-full w-full items-center justify-center text-4xl font-extrabold"
              style={{ backgroundColor: color, color: ink }}
            >
              {getInitials(title)}
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- portadas de Open Library, sin dominio configurado en next/image
            <img
              src={cover}
              alt=""
              className="block h-full w-full object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
          <span className="absolute inset-x-0 bottom-0 block bg-linear-to-t from-black/85 via-black/55 to-transparent px-3 pb-2.5 pt-8">
            <span className="line-clamp-2 block text-xs font-bold leading-tight text-white">{title}</span>
            <span className="mt-0.5 block truncate text-xs text-white/85">{author}</span>
          </span>
        </span>

        {/* Reverso: reseña */}
        <span
          className="book-card-face book-card-back flex flex-col gap-1.5 p-3"
          style={{ backgroundColor: color, color: ink }}
        >
          <span className="line-clamp-2 block text-[13px] font-extrabold leading-tight">{title}</span>
          <span className="block truncate text-xs font-semibold uppercase tracking-wide opacity-80">{author}</span>
          <span className="mt-1 line-clamp-8 block text-[12.5px] leading-snug">{review}</span>
        </span>
      </span>
    </button>
  );
}
