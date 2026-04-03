import React from 'react';
import { Lightbulb, Clock, Headphones } from 'lucide-react';
import Editable from './Editable';

const BurnboxIdeal = () => {
  const features = [
    {
      title: "Creative Excellence",
      description: "Our team brings bold ideas and expert craftsmanship to every project, ensuring your brand stands out with style",
      icon: <Lightbulb size={40} />
    },
    {
      title: "On-Time Delivery",
      description: "We value your time. Our streamlined process guarantees your signage and prints are delivered when you need them- no delays",
      icon: <Clock size={40} />
    },
    
    {
      title: "Reliable Support",
      description: "We value your time. Our streamlined process guarantees your signage and prints are delivered when you need them- no delays",
      icon: <Headphones size={40} />
    }
  ];

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16 relative">
      {/* Pink Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Editable 
          name="idealTitle" 
          as="h2" 
          type="text"
          defaultValue="Why burnbox is your ideal advertising Partner"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-[#ff0060]"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 md:p-10 flex flex-col items-center text-center hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(255,0,96,0.1)] hover:border-pink-500/20 transition-all duration-300 group rounded-2xl"
            >
              {/* Icon */}
              <div className="text-[#ff0060] mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-pink-500/10 p-4 rounded-full">
                {feature.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                <Editable 
                  name={`idealTitle_${index}`}
                  as="span"
                  type="text"
                  defaultValue={feature.title}
                />
              </h3>
              
              <div className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                <Editable 
                  name={`idealDesc_${index}`}
                  as="p"
                  type="text"
                  defaultValue={feature.description}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BurnboxIdeal;
