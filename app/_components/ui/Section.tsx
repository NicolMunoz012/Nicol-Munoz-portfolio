import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  alignTitle?: "left" | "right" | "center";
};

export function Section({
  id,
  title,
  subtitle,
  children,
  alignTitle = "left",
}: SectionProps) {
  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl gap-10 rounded-3xl border border-border/70 bg-surface/70 px-5 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:px-8 sm:py-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12"
    >
      <div
        className={`flex flex-col gap-3 ${
          alignTitle === "right"
            ? "items-end text-right"
            : alignTitle === "center"
              ? "items-center text-center"
              : ""
        }`}
      >
        <h2 className="font-display text-balance text-[clamp(1.75rem,3.5vw,3rem)] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-col justify-center gap-4 text-sm text-muted-foreground">
          {children}
        </div>
      ) : null}
    </section>
  );
}
