import React from 'react'
import { useSiteConfig } from '../context/SiteConfigContext'
import Editable from './Editable';

const ContactBurnbox = () => {
  const { config } = useSiteConfig();

  return (
    <section className='w-full py-20 md:py-32 relative overflow-hidden'>
        <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#ff0060]/10 to-transparent pointer-events-none"></div>
        
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
                <div className='flex flex-col justify-center order-1 lg:order-1'>
                <Editable 
                    name="contactTitle" 
                    as="h1" 
                    type="text"
                    defaultValue="Contact Burnbox for\nYour Next Project"
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 whitespace-pre-line"
                />
                
                <Editable 
                    name="contactSubtitle" 
                    as="p" 
                    type="text"
                    defaultValue="Let's bring your vision to life. Request a site visit or contact us to discuss your project needs. Our team is ready to help you stand out."
                    className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed font-medium"
                />
                
                <div>
                  <button
                    style={{ 
                      backgroundColor: config.primaryColor || '#ff0060',
                      boxShadow: `0 0 20px ${config.primaryColor ? config.primaryColor + '4D' : 'rgba(255,0,96,0.3)'}`
                    }}
                    className="hover:brightness-110 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg hover:-translate-y-1"
                  >
                    <Editable 
                        name="contactButtonText" 
                        as="span" 
                        type="text"
                        defaultValue="Contact Us Now"
                    />
                  </button>
                </div>
            </div>
               
                <div className='relative w-full h-full min-h-[300px] lg:min-h-[500px] order-2 lg:order-2'>
                    <div className='w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10'>
                        <Editable
                          name="contactImage"
                          type="image"
                          defaultValue="/aboutusimage.png" 
                          className="w-full h-full rounded-2xl overflow-hidden"
                        />
                    </div>
                </div>
            </div>

        </div>
    </section>
  )
}

export default ContactBurnbox
