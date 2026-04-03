import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { config } = useSiteConfig();

  const defaultFaqs = [
    {
      question: "how do i request a quotation",
      answer: "You can request a quotation by clicking the email button in the bottom right corner, or by visiting our contact page to send us a direct message with your project details."
    },
    {
      question: "What Areas do you serve",
      answer: "We primarily serve the Metro Manila area and nearby provinces. For specific locations or long-distance projects, please contact us to discuss logistics."
    },
    {
      question: "Can you handle rush orders?",
      answer: "Yes, we understand that deadlines can be tight. We do accept rush orders depending on our current production schedule. Please mention your deadline when inquiring."
    },
    {
      question: "Do you offer installation Service?",
      answer: "Absolutely! We provide professional installation services for all our signage, wall murals, and large format prints to ensure a perfect finish."
    }
  ];

  const faqs = config.faqData || defaultFaqs;
  const title = config.faqTitle || "Frequently Asked Questions";

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    
    <section className="w-full py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">
          {title}
        </h2>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq: any, index: number) => (
            <div 
              key={index}
              className="border border-white/10 rounded-lg overflow-hidden bg-[#1F1F1F] hover:border-[#ff0060]/50 transition-colors duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left gap-4 group"
              >
                <span className="text-lg md:text-xl font-semibold text-white group-hover:text-[#ff0060] transition-colors duration-300">
                  {faq.question}
                </span>
                <span className="text-[#ff0060] flex-shrink-0">
                  {activeIndex === index ? <Minus size={24} /> : <Plus size={24} />}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
