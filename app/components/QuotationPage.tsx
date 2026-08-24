'use client';

import React from 'react';
import Editable from './Editable';
import ContactEmailForm from './ContactEmailForm';

const QuotationPage = () => {
  return (
    <section
      id="quote"
      className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-[#171414] relative overflow-hidden text-[#F7F1EA]"
    >
      <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-[#FF0060]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-[#FFC93C]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <span className="block uppercase tracking-[0.1em] text-xs text-[#FFC93C] mb-4 font-medium">
            Get a Quotation
          </span>
          <Editable
            name="quotationTitle"
            as="h1"
            type="text"
            defaultValue="Ready to be impossible to ignore?"
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-6 text-[#F7F1EA] tracking-tight"
          />
          <Editable
            name="quotationSubtitle"
            as="p"
            type="text"
            defaultValue="Get a free quotation for signage, digital marketing, airport advertising, or 3D printing — offline and online, all from one team."
            className="text-base md:text-lg text-[#B7AFA6] leading-relaxed max-w-xl mx-auto lg:mx-0"
          />
          <p className="mt-8 text-sm text-[#F7F1EA]/45 hidden lg:block">
            Tell us about your project on the right — we&apos;ll get back to you shortly.
          </p>
        </div>

        <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
          <ContactEmailForm />
        </div>
      </div>
    </section>
  );
};

export default QuotationPage;
