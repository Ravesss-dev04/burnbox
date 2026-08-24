"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSiteConfig } from '../context/SiteConfigContext'
import Editable from './Editable';

const TICKER_ITEMS = [
  'Large Format Printing',
  'Custom Signage',
  'Digital Marketing',
  'Ecommerce',
  '3D Printing',
  'Fabrication',
];

const BrandPage = () => {
  const { config } = useSiteConfig();
  const router = useRouter();
  const primaryColor = config.primaryColor || '#FF0060';

  return (
    <section
      id="home"
      className="w-full relative overflow-hidden bg-[#F7F1EA] text-[#231F20]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-24 pb-14 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center max-w-[640px]">
            <div
              className="flex items-center gap-2.5 uppercase text-xs tracking-[0.1em] font-medium mb-[18px]"
              style={{ color: primaryColor }}
            >
              <span
                className="inline-block w-[26px] h-[1.5px] shrink-0"
                style={{ backgroundColor: primaryColor }}
                aria-hidden
              />
              Offline + Online Advertising Partner
            </div>

            <Editable
              name="heroTitle"
              as="h1"
              type="text"
              defaultValue={"Your brand,\nprinted, placed\n& promoted."}
              className="text-4xl md:text-5xl lg:text-[4.5rem] font-black uppercase leading-[1.02] tracking-tight !text-[#231F20] mb-6 whitespace-pre-line"
              style={{ color: '#231F20' }}
            />

            <Editable
              name="heroSubtitle"
              as="p"
              type="text"
              defaultValue="Burnbox is your one-stop advertising partner — from signage on your storefront to campaigns running on Facebook, from wall stickers to your own online store. Offline and online, under one roof."
              className="text-base md:text-lg text-[#231F20]/80 mb-8 max-w-[480px] leading-relaxed"
            />

            <div className="flex flex-wrap gap-3.5">
              <button
                type="button"
                onClick={() => router.push('/quotation')}
                style={{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                }}
                className="inline-flex items-center border-[1.5px] text-white font-bold uppercase tracking-[0.06em] text-xs py-[13px] px-[22px] rounded-sm transition-colors duration-200 hover:bg-[#231F20] hover:border-[#231F20]"
              >
                Get a Free Quotation
              </button>
              <button
                type="button"
                onClick={() => router.push('/services')}
                className="inline-flex items-center border-[1.5px] border-[#231F20] bg-transparent text-[#231F20] font-bold uppercase tracking-[0.06em] text-xs py-[13px] px-[22px] rounded-sm transition-colors duration-200 hover:bg-[#231F20] hover:text-[#F7F1EA]"
              >
                See All Services
              </button>
            </div>
          </div>

          {/* Right: Image — kept for CMS editability, restyled */}
          <div className="relative w-full min-h-[280px] lg:min-h-[420px]">
            <div className="relative w-full h-full min-h-[280px] lg:min-h-[420px] border-[1.5px] border-[#231F20] overflow-hidden rounded-sm">
              {/* Crop marks */}
              <span className="pointer-events-none absolute -top-[7px] -left-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]" aria-hidden />
              <span className="pointer-events-none absolute -top-[7px] -right-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]" aria-hidden />
              <span className="pointer-events-none absolute -bottom-[7px] -left-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]" aria-hidden />
              <span className="pointer-events-none absolute -bottom-[7px] -right-[7px] z-10 h-3.5 w-3.5 before:absolute before:left-0 before:top-1/2 before:h-[1.5px] before:w-3.5 before:-translate-y-1/2 before:bg-[#231F20] after:absolute after:left-1/2 after:top-0 after:h-3.5 after:w-[1.5px] after:-translate-x-1/2 after:bg-[#231F20]" aria-hidden />

              <Editable
                name="heroImage"
                type="image"
                defaultValue="/onetwo.jpg"
                className="w-full h-full min-h-[280px] lg:min-h-[420px] overflow-hidden rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
                
      {/* Service ticker — decorative, part of hero */}
      <div className="border-y-[1.5px] border-[#231F20] bg-[#171414] text-[#F7F1EA] overflow-hidden mt-4 md:mt-8">
        <div className="flex whitespace-nowrap animate-hero-ticker w-max">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {TICKER_ITEMS.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="inline-flex items-center gap-8 px-8 py-3.5 text-[13px] uppercase tracking-[0.08em] font-medium"
                >
                  {item}
                  <span style={{ color: primaryColor }} aria-hidden>
                    ✕
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandPage
