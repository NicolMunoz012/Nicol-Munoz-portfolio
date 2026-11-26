import type { KeyboardEvent } from "react";

const TAB_KEYS = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];

/**
 * Navegación con flechas para un contenedor `role="tablist"`: mueve el foco
 * entre sus `role="tab"` y activa el que lo recibe.
 */
export function handleTabListKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (!TAB_KEYS.includes(event.key)) return;

  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
  const current = tabs.indexOf(document.activeElement as HTMLElement);
  if (current < 0) return;

  event.preventDefault();

  let next = current;
  if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
  else next = (current - 1 + tabs.length) % tabs.length;

  tabs[next].focus();
  tabs[next].click();
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/** Mantiene el foco dentro de `container` al pulsar Tab (para diálogos modales). */
export function trapFocus(event: KeyboardEvent<HTMLElement>, container: HTMLElement) {
  if (event.key !== "Tab") return;

  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
