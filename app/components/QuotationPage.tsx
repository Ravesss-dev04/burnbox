import React from 'react'
import Editable from './Editable';

const QuotationPage = () => {
  return (
    <section className='w-full py-20 md:py-32 px-4 md:px-8 bg-[#ff0060]/5 relative overflow-hidden'>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,96,0.1)_0%,transparent_70%)]"></div>
      
      <div className='max-w-5xl mx-auto text-center relative z-10'>
        <Editable 
          name="quotationTitle" 
          as="h1" 
          type="text"
          defaultValue="Get a Free Quotation Today"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white"
        />
        <Editable 
          name="quotationSubtitle" 
          as="p" 
          type="text"
          defaultValue="Ready to elevate your brand? Contact us now for a complimentary quotation and expert guidance. Let's make your business stand out in Las Piñas and beyond."
          className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed font-medium max-w-3xl mx-auto"
        />
      
        <button className='bg-[#ff0060] hover:bg-[#d60050] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 text-lg shadow-[0_0_20px_rgba(255,0,96,0.3)] hover:shadow-[0_0_30px_rgba(255,0,96,0.5)] hover:-translate-y-1'>
          Request a Site Visit
        </button>
      </div>
    </section>
  )
}

export default QuotationPage
