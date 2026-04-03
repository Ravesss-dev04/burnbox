import React from 'react'
import { ClipboardList, PenTool, Factory, Hammer } from 'lucide-react'
import Editable from './Editable';

const SeamlessProcess = () => {

    const services = [
        {
            title: 'Consultation & Planning',
            description: "We listen to your need and goals, then recommend the best solutions for your brand and budget",
            icon: <ClipboardList size={40} />
        },
        {
            title: "Design",
            description: "Our creative team crafts bold, effetive designs the reflect your brand and attract your target audience.",
            icon: <PenTool size={40} />
        },

        {
            title: "Production",
            description: "We use advanced equipment and quality materials to produce. durable variant print and signage",
            icon: <Factory size={40} />
        },
        {
            title: "Installation",
            description: "Our skilled team installs your signage, your signage safely and efficiently, ensuring a flawless finish evertime",
            icon: <Hammer size={40} />
        }
    ]

    
  return (
    <section className='w-full py-20 md:py-30 px-4 md:px-8 lg:px-16 relative bg-transparent'>
        <div className='max-w-7xl mx-auto '>
            <Editable 
              name="processTitle" 
              as="h2" 
              type="text"
              defaultValue="Our Seamless Process"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-white"
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8'>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className='bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 md:p-10 flex flex-col items-center text-center hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(255,0,96,0.1)] hover:border-pink-500/20 transition-all duration-300 group rounded-2xl'
                    >
                        <div className='text-[#ff0060] mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-pink-500/10 p-4 rounded-full'>
                            {service.icon}
                        </div>
                        <h3 className='text-xl md:text-2xl font-bold text-pink-400 mb-6'>{service.title}</h3>

                        <p className='text-gray-300 leading-relaxed text-sm md:text-base font-medium'>
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default SeamlessProcess
