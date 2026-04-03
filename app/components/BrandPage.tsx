"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSiteConfig } from '../context/SiteConfigContext'
import Editable from './Editable';

const BrandPage = () => {
  const { config } = useSiteConfig();
  const router = useRouter();

  return (
    <section id="home" className="w-full py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center order-1 lg:order-1">
            <Editable 
              name="heroTitle" 
              as="h1" 
              type="text"
              defaultValue="Elevate Your Brand\nWith Professional\nPrinting"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 whitespace-pre-line"
            />
            
            <Editable 
              name="heroSubtitle" 
              as="p" 
              type="text"
              defaultValue="Discover how Burnbox Printing transforms your business visibility with expert signage and creative print solutions. Make your brand impossible to ignore and stand out in Las Piñas and beyond."
              className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed font-medium"
            />
            
            <div>
              <button
                onClick={() => router.push('/quotation')}
                style={{ 
                  backgroundColor: config.primaryColor || '#ff0060',
                  boxShadow: `0 0 20px ${config.primaryColor ? config.primaryColor + '4D' : 'rgba(255,0,96,0.3)'}`
                }}
                className="hover:brightness-110 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg hover:-translate-y-1"
              >
                Get a Free Quotation
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative w-full h-full min-h-[300px] lg:min-h-[500px] order-2 lg:order-2">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Editable
                name="heroImage"
                type="image"
                defaultValue="/onetwo.jpg" 
                className="w-full h-full rounded-2xl overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandPage
