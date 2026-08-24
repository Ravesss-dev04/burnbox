"use client";

import React from "react";
import Editable from "./Editable";

const WHY_CARDS = [
  {
    n: "01",
    titleKey: "whyCardTitle_0",
    title: "One-Stop Partner",
    descKey: "whyCardDesc_0",
    desc: "From ID laces to airport ads to Meta campaigns — all under one roof.",
  },
  {
    n: "02",
    titleKey: "whyCardTitle_1",
    title: "Quality Meets Affordability",
    descKey: "whyCardDesc_1",
    desc: "State-of-the-art machines and skilled specialists deliver premium output every time.",
  },
  {
    n: "03",
    titleKey: "whyCardTitle_2",
    title: "Tailored Solutions",
    descKey: "whyCardDesc_2",
    desc: "We don't just print or post — we design and strategize around your exact goals.",
  },
  {
    n: "04",
    titleKey: "whyCardTitle_3",
    title: "Proven Trust",
    descKey: "whyCardDesc_3",
    desc: "Serving SMEs, big brands, and government clients with repeat partnership since 2015.",
  },
  {
    n: "05",
    titleKey: "whyCardTitle_4",
    title: "Hassle-Free Service",
    descKey: "whyCardDesc_4",
    desc: "Fast turnaround, expert installation, and after-sales support on every project.",
  },
];

const WhyChooseBurnBox = () => {
  return (
    <section
      id="why-choose-burnbox"
      className="w-full py-12 md:py-16 px-4 md:px-8 bg-[#FF0060] text-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-8 mb-8 md:mb-10">
          <div className="max-w-lg">
            <span className="block uppercase tracking-[0.1em] text-[11px] text-[#231F20] mb-2.5 font-medium">
              05 / Why Burnbox
            </span>
            <Editable
              name="whyChooseTitle"
              as="h2"
              type="text"
              defaultValue="Why business owners choose Burnbox"
              className="text-2xl md:text-3xl lg:text-[2.25rem] font-black uppercase leading-[1.05] tracking-tight text-white"
            />
          </div>
          <Editable
            name="whyChooseSubtitle"
            as="p"
            type="text"
            defaultValue="We combine production capability with creative strategy — so your brand shows up consistently everywhere."
            className="text-white/90 text-sm max-w-xs leading-relaxed sm:text-right"
          />
        </div>

        {/* 5-column grid (HTML why-grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[1.5px] bg-white/35 border-[1.5px] border-white/35">
          {WHY_CARDS.map((card) => (
            <div
              key={card.n}
              className="bg-[#FF0060] px-5 py-6 md:px-[22px] md:py-7"
            >
              <span className="block uppercase tracking-[0.08em] text-[11px] text-white/75 mb-3.5 font-medium">
                {card.n}
              </span>
              <Editable
                name={card.titleKey}
                as="h4"
                type="text"
                defaultValue={card.title}
                className="text-[15px] md:text-base font-black uppercase leading-snug tracking-tight text-white mb-2.5"
              />
              <Editable
                name={card.descKey}
                as="p"
                type="text"
                defaultValue={card.desc}
                className="text-[13px] md:text-[13.5px] text-white/90 leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBurnBox;
