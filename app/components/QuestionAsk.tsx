import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Editable from './Editable';

const QuestionAsk = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);


    const faqs = [
        {
            questions: "How do i request a quotation",
            answer: "You can request a quotation by clicking the email button in the bottom right corner, or by visiting our contact page to send us a direct message with your project details"
        },
        {
            questions: "What Areas do you serve",
            answer: "We primarily serve the Metro Manila area and nearby provinces. For specific locations or long-distance projects, please contact us to discuss logistics."
        },
        
        {
            questions: "Can you handle rush orders?",
            answer: "Yes, we understand that deadlines can be tight. We do accept rush orders depending on our current production schedule. Please mention your deadline when inquiring."
        },
        {
            questions: "Do you offer installation Service?",
            answer: "Absolutely! We provide professional installation services for all our signage, wall murals, and large format prints to ensure a perfect finish."
        }
    ]

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    }
  return (
   <section className='w-full py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-transparent relative'>
    <div className='max-w-4xl mx-auto relative z-10'>
        <Editable 
          name="faqTitle" 
          as="h2" 
          type="text"
          defaultValue="Frequently Asked Questions"
          className="text-3xl text-white md:text-4xl lg:text-5xl font-bold text-center mb-12"
        />


        <div className='flex flex-col gap-4'>
            {faqs.map((faq, index) => (
                <div
                    className='border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-sm hover:border-[#ff0060]/50 transition-colors duration-300'
                    key={index}
                >
                    <button
                    className='w-full p-6 flex items-center justify-between text-left gap-4 group'
                        onClick={() => toggleFAQ(index)}
                    >
                        <Editable
                            name={`faqQuestion_${index}`}
                            as="span"
                            type="text"
                            defaultValue={faq.questions}
                            className='text-lg md:text-xl font-semibold text-white group-hover:text-[#ff0060] transition-colors duration-300'
                        />
                        <span className='text-[#ff0060] flex-shrink-0'>
                            {activeIndex === index ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} /> }
                        </span>
                    </button>
                    <AnimatePresence>
                        {activeIndex === index && (
                            <motion.div
                                initial={{height: 0, opacity: 0}}
                                animate={{height: "auto", opacity: 1}}
                                exit={{height: 0, opacity: 0}}
                                transition={{duration: 0.3, ease: "easeInOut"}}
                            >
                                <div className='px-6 pb-6 text-gray-300 leading-relaxed'>
                                    <Editable
                                        name={`faqAnswer_${index}`}
                                        as="p"
                                        type="text"
                                        defaultValue={faq.answer}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    </div>
   </section>
  )
}

export default QuestionAsk
