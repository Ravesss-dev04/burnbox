import React from 'react'
import { useSiteConfig } from '../context/SiteConfigContext'
import Editable from './Editable';

const ContactBurnbox = () => {
  const { config } = useSiteConfig();
  const pink = config.primaryColor || '#FF0060';

  return (
    <section className='w-full py-20 md:py-28 relative overflow-hidden bg-[#F7F1EA] text-[#231F20]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
                <div className='flex flex-col justify-center order-1'>
                <span className="uppercase tracking-[0.1em] text-xs text-[#FF0060] mb-3.5 font-medium">
                  Visit / Contact
                </span>
                <Editable 
                    name="contactTitle" 
                    as="h1" 
                    type="text"
                    defaultValue="Contact Burnbox for\nYour Next Project"
                    className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-[#231F20] mb-6 whitespace-pre-line tracking-tight"
                />
                
                <Editable 
                    name="contactSubtitle" 
                    as="p" 
                    type="text"
                    defaultValue="Let's bring your vision to life. Request a site visit or contact us to discuss your project needs. Our team is ready to help you stand out."
                    className="text-base md:text-lg text-[#7A736D] mb-8 max-w-xl leading-relaxed"
                />
                
                <div>
                  <button
                    style={{ 
                      backgroundColor: pink,
                      borderColor: pink,
                    }}
                    className="hover:bg-[#231F20] hover:border-[#231F20] text-white font-bold uppercase tracking-[0.06em] text-xs py-[13px] px-[22px] border-[1.5px] rounded-sm transition-colors duration-200"
                  >
                    <Editable 
                        name="contactButtonText" 
                        as="span" 
                        type="text"
                        defaultValue="Request a Site Visit"
                    />
                  </button>
                </div>
            </div>
               
                <div className='relative w-full h-full min-h-[280px] lg:min-h-[420px] order-2'>
                    <div className='relative w-full h-full min-h-[280px] lg:min-h-[420px] overflow-hidden border-[1.5px] border-[#231F20] rounded-sm'>
                        <Editable
                          name="contactImage"
                          type="image"
                          defaultValue="/aboutusimage.png" 
                          className="w-full h-full min-h-[280px] lg:min-h-[420px] overflow-hidden rounded-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ContactBurnbox
