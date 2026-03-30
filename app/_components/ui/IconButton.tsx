'use client';

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

export function IconButton({ icon, label, className, ...props }: IconButtonProps) {
  // Comentario: Botón compacto para iconos con accesibilidad.
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full border border-border/70 bg-surface/60 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors transition-shadow hover:border-border hover:bg-surface btn-icon ${className ?? ""}`}
      {...props}
    >
      {icon}
    </button>
  );
}

