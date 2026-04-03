import React from 'react'
import { useSiteConfig } from '../context/SiteConfigContext'
import Editable from './Editable';

const CreativePage = () => {
  const { config } = useSiteConfig();

  return (
    <section className='w-full py-20 md:py-32 bg-transparent relative overflow-hidden'>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center' >
                <div className='flex flex-col justify-center order-1 lg:order-1'>
                    <Editable 
                        name="creativeTitle" 
                        as="h1" 
                        type="text"
                        defaultValue="Your Visibility Challenge\nOur Creative Solution"
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 whitespace-pre-line"
                    />
                    
                    <Editable 
                        name="creativeHighlight" 
                        as="h3" 
                        type="text"
                        defaultValue="Struggling to Stand Out?"
                        className="text-2xl md:text-3xl font-bold mb-4"
                        style={{ color: config.primaryColor || '#ff0060' }}
                    />

                    <Editable 
                        name="creativeSubtitle" 
                        as="p" 
                        type="text"
                        defaultValue="In a crowded market, your brand can easily get lost. Burnbox Printing delivers innovative signage and print solutions that make your business impossible to miss. We help you capture attention and drive real results fast."
                        className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed font-medium"
                    />
                </div>
            {/* image */}
            <div className='relative w-full h-full min-h-[300px] lg:min-h-[500px] order-2 lg:order-2'>
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Editable
                      name="creativeImage"
                      type="image"
                      defaultValue="/onetree.jpg" 
                      className="w-full h-full rounded-2xl overflow-hidden"
                    />
                </div>
            </div>
             </div>
        </div>
    </section>
  )
}

export default CreativePage
