"use client";

import React from "react";
import Editable from "./Editable";
import { useSiteConfig } from "../context/SiteConfigContext";

const META_TAGS = ["NFC Cards", "Tap-to-Share", "Digital Profile"] as const;
const ONTAP_URL = "https://ontap.ph";

/** Decorative QR-style mark for the On Tap card mockup (not a real scannable code). */
const MockQrCode = () => (
  <svg
    viewBox="0 0 40 40"
    className="h-full w-full"
    aria-hidden
    shapeRendering="crispEdges"
  >
    {/* finder patterns */}
    <rect x="1" y="1" width="11" height="11" fill="white" />
    <rect x="3" y="3" width="7" height="7" fill="#0B1526" />
    <rect x="5" y="5" width="3" height="3" fill="white" />
    <rect x="28" y="1" width="11" height="11" fill="white" />
    <rect x="30" y="3" width="7" height="7" fill="#0B1526" />
    <rect x="32" y="5" width="3" height="3" fill="white" />
    <rect x="1" y="28" width="11" height="11" fill="white" />
    <rect x="3" y="30" width="7" height="7" fill="#0B1526" />
    <rect x="5" y="32" width="3" height="3" fill="white" />
    {/* data modules */}
    <rect x="14" y="2" width="2" height="2" fill="white" />
    <rect x="18" y="2" width="2" height="2" fill="white" />
    <rect x="22" y="2" width="2" height="2" fill="white" />
    <rect x="14" y="6" width="2" height="2" fill="white" />
    <rect x="20" y="6" width="2" height="2" fill="white" />
    <rect x="16" y="10" width="2" height="2" fill="white" />
    <rect x="22" y="10" width="2" height="2" fill="white" />
    <rect x="2" y="14" width="2" height="2" fill="white" />
    <rect x="6" y="14" width="2" height="2" fill="white" />
    <rect x="10" y="14" width="2" height="2" fill="white" />
    <rect x="14" y="14" width="2" height="2" fill="white" />
    <rect x="18" y="14" width="2" height="2" fill="white" />
    <rect x="22" y="14" width="2" height="2" fill="white" />
    <rect x="26" y="14" width="2" height="2" fill="white" />
    <rect x="30" y="14" width="2" height="2" fill="white" />
    <rect x="34" y="14" width="2" height="2" fill="white" />
    <rect x="4" y="18" width="2" height="2" fill="white" />
    <rect x="10" y="18" width="2" height="2" fill="white" />
    <rect x="16" y="18" width="2" height="2" fill="white" />
    <rect x="20" y="18" width="2" height="2" fill="white" />
    <rect x="28" y="18" width="2" height="2" fill="white" />
    <rect x="36" y="18" width="2" height="2" fill="white" />
    <rect x="2" y="22" width="2" height="2" fill="white" />
    <rect x="8" y="22" width="2" height="2" fill="white" />
    <rect x="14" y="22" width="2" height="2" fill="white" />
    <rect x="24" y="22" width="2" height="2" fill="white" />
    <rect x="32" y="22" width="2" height="2" fill="white" />
    <rect x="14" y="28" width="2" height="2" fill="white" />
    <rect x="18" y="28" width="2" height="2" fill="white" />
    <rect x="24" y="28" width="2" height="2" fill="white" />
    <rect x="30" y="28" width="2" height="2" fill="white" />
    <rect x="34" y="28" width="2" height="2" fill="white" />
    <rect x="16" y="32" width="2" height="2" fill="white" />
    <rect x="22" y="32" width="2" height="2" fill="white" />
    <rect x="28" y="32" width="2" height="2" fill="white" />
    <rect x="36" y="32" width="2" height="2" fill="white" />
    <rect x="14" y="36" width="2" height="2" fill="white" />
    <rect x="20" y="36" width="2" height="2" fill="white" />
    <rect x="26" y="36" width="2" height="2" fill="white" />
    <rect x="32" y="36" width="2" height="2" fill="white" />
    {/* center mark */}
    <rect x="18" y="18" width="6" height="6" fill="white" />
    <rect x="20" y="20" width="2" height="2" fill="#0B1526" />
  </svg>
);

const NfcWavesIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M8 8.5c2.2 2.2 2.2 4.8 0 7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M11.2 6c3.4 3.2 3.4 8.8 0 12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M14.4 3.5c4.6 4.2 4.6 12.8 0 17"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const LinkMarkIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 12" className={className} aria-hidden fill="none">
    <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="14" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

/** Manual recreation of the On Tap Creatives NFC card (reference look). */
const OnTapNfcCard = () => (
  <div
    className="relative z-10 w-[280px] sm:w-[320px] md:w-[360px] aspect-[1.65/1] rounded-[14px] overflow-hidden border border-white/10 shadow-[0_18px_40px_rgba(11,21,38,0.45)]"
    style={{
      background:
        "radial-gradient(ellipse at 28% 45%, rgba(56, 120, 200, 0.28) 0%, transparent 52%), linear-gradient(145deg, #13233A 0%, #0B1526 48%, #08101C 100%)",
    }}
    aria-hidden
  >
    {/* soft blue haze */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(90,160,255,0.08),transparent_45%)]" />

    {/* top-right NFC mark */}
    <NfcWavesIcon className="absolute top-3.5 right-4 h-4 w-4 text-white/55" />

    {/* left brand block */}
    <div className="absolute left-[8%] top-1/2 -translate-y-[58%] flex items-start gap-1.5">
      <div className="text-white leading-none">
        <p
          className="text-[28px] sm:text-[32px] md:text-[36px] font-normal tracking-[-0.02em]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          ON TAP
        </p>
        <p className="mt-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/90 font-medium text-center">
          Creatives
        </p>
      </div>
      <NfcWavesIcon className="mt-1.5 h-5 w-5 sm:h-6 sm:w-6 text-white/90 shrink-0" />
    </div>

    {/* right QR */}
    <div className="absolute right-[9%] top-[18%] h-[48%] aspect-square">
      <MockQrCode />
    </div>

    {/* bottom-left link mark */}
    <LinkMarkIcon className="absolute bottom-4 left-5 h-3 w-5 text-white/70" />

    {/* bottom-right serial */}
    <p className="absolute bottom-3.5 right-5 text-[9px] sm:text-[10px] tracking-[0.12em] text-white/85 font-medium tabular-nums">
      000000
    </p>
  </div>
);

const CropMarks = () => (
  <>
    <span
      className="pointer-events-none absolute -top-[7px] -left-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]"
      aria-hidden
    />
    <span
      className="pointer-events-none absolute -top-[7px] -right-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]"
      aria-hidden
    />
    <span
      className="pointer-events-none absolute -bottom-[7px] -left-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]"
      aria-hidden
    />
    <span
      className="pointer-events-none absolute -bottom-[7px] -right-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]"
      aria-hidden
    />
  </>
);

const SeamlessProcess = () => {
  const { isEditing } = useSiteConfig();

  return (
    <section
      id="partner-brand"
      className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-[#F7F1EA] text-[#231F20]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-10 mb-10 md:mb-12">
          <div className="max-w-[560px]">
            <span className="block uppercase tracking-[0.12em] text-xs text-[#FF0060] mb-3.5 font-medium">
              03 / Partner Brand
            </span>
            <Editable
              name="partnerBrandTitle"
              as="h2"
              type="text"
              defaultValue="Also part of the Burnbox family"
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-black uppercase leading-[1.02] tracking-tight text-[#231F20]"
            />
          </div>
          <Editable
            name="partnerBrandIntro"
            as="p"
            type="text"
            defaultValue="A sister brand built for the digital-first professional."
            className="text-[#7A736D] text-[15px] max-w-[300px] leading-relaxed md:text-right"
          />
        </div>

        {/* Clickable feature panel — whole card opens ontap.ph */}
        <div className="relative">
          <CropMarks />

          <a
            href={ONTAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit On Tap Creatives at ontap.ph"
            onClick={(e) => {
              if (isEditing) e.preventDefault();
            }}
            className={`relative block overflow-hidden border-[1.5px] border-[#231F20] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#231F20] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1EA] ${
              isEditing ? "cursor-default" : "cursor-pointer"
            }`}
            style={{
              background:
                "linear-gradient(135deg, #C4004A 0%, #E60056 32%, #FF0060 68%, #FF2A78 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.12)_0%,transparent_55%)]"
              aria-hidden
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2">
              {/* Left — product stage */}
              <div className="relative flex items-center justify-center px-6 py-12 md:py-14 lg:px-12 lg:py-16 lg:border-r border-white/20 min-h-[280px] md:min-h-[320px]">
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden
                >
                  <div className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full border border-white/15" />
                  <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/20" />
                  <div className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/25" />
                </div>

                <OnTapNfcCard />
              </div>

              {/* Right — message */}
              <div className="relative flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
                <span className="block uppercase tracking-[0.12em] text-[11px] text-white/75 mb-3 font-medium">
                  By On Tap Creatives
                </span>

                <Editable
                  name="partnerBrandCardTitle"
                  as="h3"
                  type="text"
                  defaultValue="Tap to share. No app needed."
                  className="text-xl md:text-2xl lg:text-[1.85rem] font-black uppercase leading-[1.05] tracking-tight text-white mb-3"
                />

                <Editable
                  name="partnerBrandCardDesc"
                  as="p"
                  type="text"
                  defaultValue="On Tap Creatives makes NFC digital business cards — one tap shares your contact info, socials, and portfolio instantly."
                  className="text-white/90 text-[14px] leading-[1.65] max-w-[400px] mb-5"
                />

                <p className="uppercase text-[10px] tracking-[0.1em] text-white/65 mb-6 font-medium">
                  {META_TAGS.map((tag, i) => (
                    <React.Fragment key={tag}>
                      {i > 0 && (
                        <span className="mx-2.5 text-white/35" aria-hidden>
                          ·
                        </span>
                      )}
                      <span>{tag}</span>
                    </React.Fragment>
                  ))}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <span className="inline-flex items-center gap-2 bg-[#171414] border-[1.5px] border-[#171414] text-[#F7F1EA] uppercase tracking-[0.06em] text-xs font-bold py-3 px-5 rounded-sm">
                    Visit ontap.ph →
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.08em] text-white/75 underline underline-offset-4 decoration-white/30">
                    Opens ontap.ph
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SeamlessProcess;
