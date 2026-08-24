"use client";

import React from "react";
import Editable from "./Editable";

const PROCESS_STEPS = [
  {
    num: "01",
    titleKey: "processStepTitle_0",
    title: "Consultation & Planning",
    descKey: "processStepDesc_0",
    desc: "We listen to your goals, then recommend the right mix of offline and online solutions for your brand and budget.",
  },
  {
    num: "02",
    titleKey: "processStepTitle_1",
    title: "Design",
    descKey: "processStepDesc_1",
    desc: "Our creative team crafts bold, effective designs — from tarpaulin layouts to ad creatives — that reflect your brand and reach your audience.",
  },
  {
    num: "03",
    titleKey: "processStepTitle_2",
    title: "Production",
    descKey: "processStepDesc_2",
    desc: "Advanced equipment and quality materials produce durable prints and precise 3D models, while our team builds and schedules your digital campaigns.",
  },
  {
    num: "04",
    titleKey: "processStepTitle_3",
    title: "Installation & Launch",
    descKey: "processStepDesc_3",
    desc: "Signage installed safely and on-site, ads placed at your chosen locations, and campaigns launched — with after-sales support throughout.",
  },
];

const BurnboxIdeal = () => {
  return (
    <section
      id="process"
      className="w-full py-12 md:py-16 px-4 md:px-8 bg-[#FDF6EE] text-[#231F20]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header — tighter, balanced */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-6 mb-8 md:mb-10">
          <div className="max-w-md">
            <span className="block uppercase tracking-[0.1em] text-[11px] text-[#FF0060] mb-2.5 font-medium">
              04 / Process
            </span>
            <Editable
              name="processTitle"
              as="h2"
              type="text"
              defaultValue="Our Seamless Process"
              className="text-2xl md:text-3xl lg:text-[2.25rem] font-black uppercase leading-[1.05] tracking-tight text-[#231F20]"
            />
          </div>
          <Editable
            name="processIntro"
            as="p"
            type="text"
            defaultValue="From first consultation to final installation — or campaign launch — we keep every step visible to you."
            className="text-[#7A736D] text-sm max-w-xs leading-relaxed sm:text-right"
          />
        </div>

        {/* Process rows — number + title grouped, desc capped */}
        <div className="border-t border-[#231F20]/80">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6 py-5 md:py-6 border-b border-[#231F20]/80"
            >
              <div className="flex items-baseline gap-4 min-w-0 sm:max-w-[48%]">
                <span className="text-xl md:text-2xl font-black text-[#FF0060] tracking-tight leading-none shrink-0">
                  {step.num}
                </span>
                <Editable
                  name={step.titleKey}
                  as="h3"
                  type="text"
                  defaultValue={step.title}
                  className="text-base md:text-lg font-black uppercase tracking-tight text-[#231F20]"
                />
              </div>
              <Editable
                name={step.descKey}
                as="p"
                type="text"
                defaultValue={step.desc}
                className="text-[#7A736D] text-sm leading-relaxed sm:max-w-[46%] sm:text-right"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BurnboxIdeal;
