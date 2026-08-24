"use client";

import React from "react";
import {
  FaFacebookF,
  FaMapMarkerAlt,
  FaClock,
  FaMobileAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import Editable from "./Editable";

const CONTACT_ROWS = [
  {
    label: "Address",
    valueKey: "visitAddress",
    value: "17 Vatican Bldg, BF Resort Village, Las Piñas City",
    Icon: FaMapMarkerAlt,
  },
  {
    label: "Hours",
    valueKey: "visitHours",
    value: "Mon – Sun, 9:00 AM – 6:00 PM",
    Icon: FaClock,
  },
  {
    label: "Mobile",
    valueKey: "visitMobile",
    value: "+63 917 700 8364",
    Icon: FaMobileAlt,
  },
  {
    label: "Landline",
    valueKey: "visitLandline",
    value: "(02) 7007 2412",
    Icon: FaPhoneAlt,
  },
  {
    label: "Facebook",
    valueKey: "visitFacebook",
    value: "facebook.com/burnboxprinting",
    Icon: FaFacebookF,
  },
];

const Maps = () => {
  const scrollToQuote = () => {
    const el =
      document.getElementById("quote") ||
      document.getElementById("quotation") ||
      document.getElementById("home");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="location"
      className="relative w-full py-16 md:py-24 px-4 md:px-8 bg-[#F7F1EA] text-[#231F20] overflow-hidden"
    >
      {/* Soft depth so the glass panel reads clearly */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#FF0060]/[0.07] blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[#231F20]/[0.05] blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[#FF0060]/[0.05] blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-10 mb-8 md:mb-10">
          <div className="max-w-lg">
            <span className="block uppercase tracking-[0.14em] text-[11px] text-[#FF0060] mb-2.5 font-semibold">
              06 / Visit Us
            </span>
            <Editable
              name="visitTitle"
              as="h2"
              type="text"
              defaultValue="BF Resort Branch"
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-black uppercase leading-[1.05] tracking-tight text-[#231F20]"
            />
          </div>
          <Editable
            name="visitIntro"
            as="p"
            type="text"
            defaultValue="Drop by for a consultation, or reach out for a free site visit and quotation."
            className="text-[#231F20] text-sm md:text-[15px] max-w-[280px] leading-relaxed sm:text-right"
          />
        </div>

        {/* Frosted glass card */}
        <div className="relative rounded-2xl overflow-hidden border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_8px_40px_rgba(35,31,32,0.1),inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-[#FF0060]/[0.03]" aria-hidden />

          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* Get in touch */}
            <div className="p-8 md:p-10 lg:p-12 md:border-r border-[rgba(35,31,32,0.1)]">
              <span className="block uppercase tracking-[0.12em] text-[11px] text-[#FF0060] mb-3 font-semibold">
                Studio & Production
              </span>
              <Editable
                name="visitContactHeading"
                as="h3"
                type="text"
                defaultValue="Get in touch"
                className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#231F20] mb-8"
              />
              <div className="flex flex-col gap-6">
                {CONTACT_ROWS.map((row) => (
                  <div key={row.label} className="flex gap-3.5 items-start">
                    <row.Icon
                      className="text-[#9A928A] mt-0.5 shrink-0"
                      size={15}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <span className="block uppercase tracking-[0.1em] text-[10px] text-[#9A928A] mb-1 font-medium">
                        {row.label}
                      </span>
                      <Editable
                        name={row.valueKey}
                        as="span"
                        type="text"
                        defaultValue={row.value}
                        className="text-[#231F20] text-[14.5px] leading-snug"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request a quote */}
            <div className="p-8 md:p-10 lg:p-12 flex flex-col border-t md:border-t-0 border-[rgba(35,31,32,0.1)]">
              <span className="block uppercase tracking-[0.12em] text-[11px] text-[#FF0060] mb-3 font-semibold">
                Request A Quote
              </span>
              <Editable
                name="visitQuoteHeading"
                as="h3"
                type="text"
                defaultValue="Tell us what you're building"
                className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#231F20] mb-4"
              />
              <Editable
                name="visitQuoteBody"
                as="p"
                type="text"
                defaultValue="Signage, a digital campaign, an airport placement, or a 3D print — send us the details and we'll get back with a free quotation."
                className="text-[#231F20] text-[14.5px] leading-relaxed mb-8 flex-1"
              />
              <button
                type="button"
                onClick={scrollToQuote}
                className="w-full inline-flex flex-col items-center justify-center bg-[#FF0060]/90 backdrop-blur-sm text-white uppercase tracking-[0.08em] font-bold py-4 px-6 rounded-lg border border-white/25 shadow-[0_4px_0_#C4004A,0_8px_24px_rgba(255,0,96,0.25)] hover:bg-[#E60056] hover:shadow-[0_2px_0_#C4004A,0_4px_16px_rgba(255,0,96,0.2)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150"
              >
                <span className="text-sm md:text-[15px] leading-tight">
                  Request a Site Visit
                </span>
              </button>
            </div>
          </div>

          <div className="relative pb-5 pt-1 text-center" aria-hidden>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#231F20]/25 font-medium select-none">
              Burnbox Studio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Maps;
