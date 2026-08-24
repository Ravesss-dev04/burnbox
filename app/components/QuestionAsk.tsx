import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Editable from './Editable';

const QuestionAsk = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            questions: "How do i request a quotation",
            answer: "You can request a quotation using the contact form in our Get a Quotation section, chat with us via the Messenger button in the bottom right, or visit our contact page with your project details."
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
   <section className='w-full py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-[#F7F1EA] text-[#231F20] relative'>
    <div className='max-w-4xl mx-auto relative z-10'>
        <span className="block text-center uppercase tracking-[0.1em] text-xs text-[#FF0060] mb-3.5 font-medium">
          07 / FAQ
        </span>
        <Editable 
          name="faqTitle" 
          as="h2" 
          type="text"
          defaultValue="Frequently Asked Questions"
          className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center mb-12 text-[#231F20] tracking-tight"
        />

        <div className='flex flex-col border-t-[1.5px] border-[#231F20]'>
            {faqs.map((faq, index) => (
                <div
                    className='border-b-[1.5px] border-[#231F20] overflow-hidden'
                    key={index}
                >
                    <button
                    className='w-full py-5 md:py-6 flex items-center justify-between text-left gap-4 group'
                        onClick={() => toggleFAQ(index)}
                    >
                        <Editable
                            name={`faqQuestion_${index}`}
                            as="span"
                            type="text"
                            defaultValue={faq.questions}
                            className='text-base md:text-lg font-medium text-[#231F20] group-hover:text-[#FF0060] transition-colors duration-200'
                        />
                        <span className='text-[#FF0060] flex-shrink-0 font-bold text-xl'>
                            {activeIndex === index ? <IoIosArrowUp size={22} /> : <IoIosArrowDown size={22} /> }
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
                                <div className='pb-6 text-[#7A736D] leading-relaxed'>
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
