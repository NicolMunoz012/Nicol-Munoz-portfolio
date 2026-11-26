import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

/** Título de sección con las dos líneas que se desvanecen a los lados. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal direction="up">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-5">
          <div aria-hidden className="h-px flex-1 bg-linear-to-r from-transparent to-primary-dark/35 dark:h-[3px]" />
          <h2 className="shrink-0 text-balance font-display text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-tight text-heading">
            {title}
          </h2>
          <div aria-hidden className="h-px flex-1 bg-linear-to-l from-transparent to-primary-dark/35 dark:h-[3px]" />
        </div>
        {subtitle ? (
          <p className="max-w-2xl text-pretty text-lg text-foreground/75">{subtitle}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
