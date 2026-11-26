'use client';

import { useState } from "react";
import Image from "next/image";
import { Mail, Copy, Check, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
import { SectionHeading } from "../_components/ui/SectionHeading";
import { CvPill } from "../_components/ui/CvPill";
import { EMAIL, GITHUB_USERNAME, SOCIAL_LINKS } from "../_lib/links";

const row = "flex items-center gap-4 rounded-2xl bg-card-2 px-5 py-4 shadow-sm";
const iconBox = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-dark/15";
const emailAction =
  "flex h-11 w-11 items-center justify-center rounded-full bg-primary-dark/15 text-foreground/80 transition-[background-color,color,scale] hover:bg-primary-dark/25 hover:text-accent active:scale-95";

export function ContactSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <section id="contact" className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <div className="mb-12">
          <SectionHeading title={t("sections.contact.title")} />
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="surface-card mx-auto max-w-2xl rounded-3xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 gap-3">
              <div className={`${row} flex-col items-start justify-between sm:flex-row sm:items-center`}>
                <div className="flex w-full min-w-0 flex-1 items-center gap-4 sm:w-auto">
                  <span className={iconBox}>
                    <Mail size={18} className="text-accent" aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-base font-bold text-foreground">Email</span>
                    <span className="break-all text-sm text-foreground/75 sm:break-normal">{EMAIL}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={t("sections.contact.copyEmail")}
                    title={t("sections.contact.copyEmail")}
                    className={emailAction}
                  >
                    {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  </button>
                  <a
                    href={`${SOCIAL_LINKS.email}?subject=${encodeURIComponent(t("sections.contact.emailSubject"))}`}
                    aria-label={t("sections.contact.sendEmail")}
                    title={t("sections.contact.sendEmail")}
                    className={emailAction}
                  >
                    <Send size={16} aria-hidden />
                  </a>
                  <span role="status" className="sr-only">
                    {copied ? t("sections.contact.copied") : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${row} transition-[background-color,translate] hover:-translate-y-0.5 hover:bg-primary-dark/15`}
                >
                  <span className={iconBox}>
                    <FaGithub size={18} className="text-foreground" aria-hidden />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-bold text-foreground">GitHub</span>
                    <span className="text-sm text-foreground/75">@{GITHUB_USERNAME}</span>
                  </span>
                </a>

                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${row} transition-[background-color,translate] hover:-translate-y-0.5 hover:bg-primary-dark/15`}
                >
                  <span className={iconBox}>
                    <FaLinkedin size={18} className="text-[#0077b5] dark:text-[#6cb8e6]" aria-hidden />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-bold text-foreground">LinkedIn</span>
                    <span className="text-sm text-foreground/75">{t("sections.contact.profile")}</span>
                  </span>
                </a>
              </div>
            </div>

            <CvPill className="mt-8 flex w-full" />
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-10">
        <Reveal direction="up">
          <figure className="surface-card mx-auto max-w-2xl rounded-3xl p-8 text-center shadow-2xl">
            <Image
              src="/sheep.png"
              alt=""
              width={128}
              height={128}
              className="mx-auto mb-6 h-32 w-32 object-contain"
            />
            <blockquote className="text-pretty text-base leading-relaxed text-foreground/85">
              &ldquo;{t("sections.contact.verse")}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm font-semibold text-accent">
              {t("sections.contact.verseRef")}
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </>
  );
}
