"use client";

import React from "react";
import { useSiteConfig } from "../context/SiteConfigContext";
import Editable from "./Editable";

type ServiceCard = {
  idx: string;
  titleKey: string;
  titleDefault: string;
  descKey: string;
  descDefault: string;
  tags: string[];
  pink?: boolean;
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    idx: "A — Physical",
    titleKey: "serviceTitle_0",
    titleDefault: "Large Format & Signage",
    descKey: "serviceDesc_0",
    descDefault:
      "Tarpaulins, wall stickers, lightboxes and 3D letters — designed, produced, and installed for storefronts, events, and promotions.",
    tags: ["Tarpaulins", "Wall Stickers", "Lightbox", "Vehicle Wrap"],
  },
  {
    idx: "B — Digital",
    titleKey: "serviceTitle_1",
    titleDefault: "Digital Marketing",
    descKey: "serviceDesc_1",
    descDefault:
      "Social media management, Meta & Google ads, content creation, and page optimization — built to bring your offline brand online.",
    tags: ["Social Media", "Meta Ads", "Content", "Page Setup"],
    pink: true,
  },
  {
    idx: "C — Online Store",
    titleKey: "serviceTitle_2",
    titleDefault: "Ecommerce",
    descKey: "serviceDesc_2",
    descDefault:
      "Online store setup and management — from product listings to checkout — so your business can sell beyond foot traffic.",
    tags: ["Store Setup", "Product Listings", "Order Mgmt."],
  },
  {
    idx: "D — Fabrication",
    titleKey: "serviceTitle_3",
    titleDefault: "3D Printing",
    descKey: "serviceDesc_3",
    descDefault:
      "Custom prototypes, models, and dimensional signage letters — printed in-house with precision.",
    tags: ["Prototypes", "Custom Models", "3D Letters"],
  },
  {
    idx: "E — Fabrication",
    titleKey: "serviceTitle_4",
    titleDefault: "Fabrication",
    descKey: "serviceDesc_4",
    descDefault:
      "Gondolas, kiosks, and custom retail fixtures — built for display, storage, and selling on-site.",
    tags: ["Gondolas", "Kiosks", "Retail Fixtures"],
  },
];

const ComprehensiveServices = () => {
  const { config } = useSiteConfig();
  const pink = config.primaryColor || "#FF0060";

  return (
    <section
      id="services"
      className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F1EA] text-[#231F20] relative overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto relative z-10">
        {/* Section head */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 md:gap-12 mb-14 md:mb-16 animate-fadeInUp">
          <div className="max-w-[640px]">
            <span
              className="block font-medium uppercase tracking-[0.12em] text-xs mb-4"
              style={{ color: pink }}
            >
              01 / Services
            </span>
            <Editable
              name="servicesTitle"
              as="h2"
              type="text"
              defaultValue="Four service lines. One partner."
              className="text-[clamp(2rem,4.5vw,3rem)] font-black uppercase leading-[1.02] tracking-tight text-[#231F20]"
            />
          </div>
          <Editable
            name="servicesIntro"
            as="p"
            type="text"
            defaultValue="Whatever channel your customers are on — a busy street, a departure gate, or their phone — Burnbox builds for it."
            className="text-[#7A736D] text-[15px] md:text-base max-w-[360px] leading-[1.7] md:text-right"
          />
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#231F20]/15 border-[1.5px] border-[#231F20]/15">
          {SERVICE_CARDS.map((card, i) => (
            <div
              key={card.titleKey}
              className={`group relative flex flex-col p-8 md:px-9 md:py-10 transition-colors duration-300 ease-out motion-safe:animate-fadeInUp ${
                card.pink
                  ? "text-white hover:brightness-[0.96]"
                  : "bg-[#F7F1EA] hover:bg-[#F0E6DA]"
              }`}
              style={{
                ...(card.pink ? { backgroundColor: pink } : undefined),
                animationDelay: `${120 + i * 70}ms`,
              }}
            >
              <span
                className={`block uppercase tracking-[0.1em] text-[11px] mb-6 font-medium ${
                  card.pink ? "text-white/85" : ""
                }`}
                style={card.pink ? undefined : { color: pink }}
              >
                {card.idx}
              </span>
              <Editable
                name={card.titleKey}
                as="h3"
                type="text"
                defaultValue={card.titleDefault}
                className={`text-[1.35rem] md:text-xl font-black uppercase leading-[1.15] tracking-tight mb-4 ${
                  card.pink ? "text-white" : "text-[#231F20]"
                }`}
              />
              <Editable
                name={card.descKey}
                as="p"
                type="text"
                defaultValue={card.descDefault}
                className={`text-[14.5px] leading-[1.7] mb-7 max-w-[420px] flex-1 ${
                  card.pink ? "text-white/90" : "text-[#7A736D]"
                }`}
              />
              <p
                className={`mt-auto uppercase text-[10.5px] tracking-[0.08em] leading-relaxed ${
                  card.pink ? "text-white/75" : "text-[#231F20]/55"
                }`}
              >
                {card.tags.join(" · ")}
              </p>
            </div>
          ))}

          {/* Empty sixth cell — preserves 3-col rhythm on desktop */}
          <div
            className="hidden lg:block min-h-[140px] bg-[#F3EBE1]/70"
            aria-hidden
          />
        </div>

        {/* Also available */}
        <div
          className="border-[1.5px] border-t-0 border-[#231F20]/15 bg-[#F7F1EA] px-6 md:px-9 py-8 md:py-9 motion-safe:animate-fadeInUp"
          style={{ animationDelay: "520ms" }}
        >
          <span
            className="block uppercase tracking-[0.1em] text-[11px] font-medium mb-5"
            style={{ color: pink }}
          >
            Also available
          </span>
          <div
            className="max-w-[440px] pl-4 border-l-2 transition-transform duration-300 ease-out hover:translate-x-0.5"
            style={{ borderColor: pink }}
          >
            <Editable
              name="addlServiceTitle"
              as="h4"
              type="text"
              defaultValue="Airport Advertising"
              className="text-[15px] font-black uppercase tracking-tight text-[#231F20] mb-2"
            />
            <Editable
              name="addlServiceDesc"
              as="p"
              type="text"
              defaultValue="Terminal displays and gate signage placements — an add-on for brands wanting high-traffic visibility."
              className="text-[14px] text-[#7A736D] leading-[1.7]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveServices;
