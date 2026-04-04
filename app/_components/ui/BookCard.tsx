'use client';

import { useState } from 'react';

// ── CSS injected once ─────────────────────────────────────────────────────────
export const bookCardStyles = `
.book-card-scene {
  perspective: 1000px;
  width: 140px;
  height: 200px;
  flex-shrink: 0;
}
.book-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  cursor: pointer;
}
.book-card-scene:hover .book-card-inner,
.book-card-scene.flipped .book-card-inner {
  transform: rotateY(180deg);
}
.book-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(109,11,49,0.3);
}
.book-card-back {
  transform: rotateY(180deg);
}
.book-card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.book-card-front-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0.6rem 0.55rem;
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 70%, transparent 100%);
}
`;

interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  review: string;
  color: string;
}

/** Derive a readable dark text color from the book's accent color */
function darken(hex: string): string {
  // simple: just return a very dark variant
  return '#2a0a15';
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function BookCard({ title, author, cover, review, color }: BookCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`book-card-scene${flipped ? ' flipped' : ''}`}
      // toggle on click for mobile; hover is handled via CSS
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${author}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
      }}
    >
      <div className="book-card-inner">
        {/* ── FRONT ────────────────────────────────────────────────────────── */}
        <div className="book-card-face" style={{ boxShadow: `0 4px 18px rgba(0,0,0,0.28)` }}>
          {imgError ? (
            /* Placeholder when cover fails to load */
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(145deg, ${color}, ${color}cc)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  textAlign: 'center',
                }}
              >
                {getInitials(title)}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {title}
              </span>
            </div>
          ) : (
            <img
              src={cover}
              alt={title}
              className="book-card-cover-img"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
          {/* Gradient overlay with title/author */}
          <div className="book-card-front-overlay">
            <p
              style={{
                margin: 0,
                fontSize: '10px',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.25,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {author}
            </p>
          </div>
        </div>

        {/* ── BACK ─────────────────────────────────────────────────────────── */}
        <div
          className="book-card-face book-card-back"
          style={{
            background: `linear-gradient(145deg, ${color}f0, ${color}cc)`,
            display: 'flex',
            flexDirection: 'column',
            padding: '0.7rem 0.65rem',
            gap: '0.35rem',
            boxShadow: `0 4px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          {/* Decorative quote mark */}
          <svg
            width="20"
            height="14"
            viewBox="0 0 24 16"
            fill="rgba(255,255,255,0.35)"
            style={{ flexShrink: 0 }}
            aria-hidden
          >
            <path d="M0 16V9.6C0 4.267 3.2.8 9.6 0l1.2 2.4C7.2 3.2 5.333 5.067 5.333 7.2H9.6V16H0zm13.6 0V9.6C13.6 4.267 16.8.8 23.2 0l1.2 2.4C20.8 3.2 18.933 5.067 18.933 7.2H23.2V16H13.6z" />
          </svg>

          {/* Title */}
          <p
            style={{
              margin: 0,
              fontSize: '10px',
              fontWeight: 800,
              color: darken(color),
              lineHeight: 1.25,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '8.5px',
              fontWeight: 600,
              color: `${darken(color)}99`,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {author}
          </p>

          {/* Review */}
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '9.5px',
              lineHeight: 1.45,
              color: darken(color),
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              flex: 1,
            }}
          >
            {review}
          </p>
        </div>
      </div>
    </div>
  );
}
