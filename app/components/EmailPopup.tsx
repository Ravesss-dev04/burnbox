import React, { useState, useRef } from 'react'
import { RiMailSendLine } from 'react-icons/ri'
import Image from 'next/image'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { AnimatePresence, motion } from 'framer-motion'
import { EmailPopupProps } from '@/types'
import { FaFacebook } from "react-icons/fa";
import { FaViber } from "react-icons/fa";

const EmailPopup = ({ setShowEmailPopup }: EmailPopupProps) => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Honeypot field reference
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if this field is filled, it's likely a bot
    if (honeypotRef.current && honeypotRef.current.value !== '') {
      console.log('Bot detected - honeypot triggered');
      // Silently succeed to avoid giving feedback to bots
      setIsSent(true);
      setTimeout(() => {
        setFormData({ email: '', message: '' });
        setShowEmailPopup(false);
        setIsSent(false);
      }, 2000);
      return;
    }

    // Basic client-side validation
    if (!formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          timestamp: Date.now(), // For rate limiting on server
          source: 'website-contact-form' // Identify the source
        }),
      });
      const result = await response.json();
      if (response.ok) {
        // Show sent animation
        setIsSent(true);
        // Close popup after 2 seconds
        setTimeout(() => {
          setFormData({ email: '', message: '' });
          setShowEmailPopup(false);
          setIsSent(false);
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'circOut' }}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:right-5 z-[70] flex flex-col gap-4 w-[350px] md:w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto scrollbar-hide'
    >
      {/* Main Form Card */}
      <div className='w-full backdrop-blur-xl bg-[#1a1a1a]/90 border border-white/10 shadow-2xl rounded-2xl p-6 overflow-hidden relative'>
        {/* Gradient Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className='flex items-center justify-between mb-6 relative z-10'>
          <div className='flex items-center gap-3'>
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <Image
                height={20}
                width={20}
                alt='gmail icon'
                src={'/gmail.png'}
                className='w-5 h-5 object-contain'
              />
            </div>
            <h2 className='text-white font-medium text-sm tracking-wide'>Reach us out via gmail.</h2>
          </div>
          <button 
            type="button" 
            className='p-2 rounded-full hover:bg-white/10 transition-colors group'
            onClick={() => setShowEmailPopup(false)}
          >
            <HiOutlineArrowSmallRight className='text-white/60 group-hover:text-white text-xl' />
          </button>
        </div>

        {/* Form */}
        <form className='flex flex-col gap-4 relative z-10' onSubmit={handleSubmit}>
          {/* Honeypot Field - Hidden from real users */}
          <input
            type="text"
            name="website"
            ref={honeypotRef}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          <div className="space-y-4">
            <input 
              type="email" 
              name="email" 
              placeholder='Input your email address'
              className='w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 focus:bg-black/40 transition-all'
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <textarea 
              name="message"
              placeholder='Write us a message...'
              className='w-full h-32 bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 focus:bg-black/40 transition-all resize-none' 
              value={formData.message}
              onChange={handleChange}
              required
              minLength={5}
            />
          </div>

          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isLoading || isSent}
              className={`
                flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl 
                bg-[#FA7EA0] hover:bg-[#f06d90] active:scale-95
                text-white font-medium text-sm shadow-lg shadow-pink-500/20
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${isSent ? 'w-14' : 'w-auto'}
              `}
            >
              {isSent ? (
                <Image
                  src="/EmailSent.gif"
                  alt="Sent"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              ) : (
                <>
                  <RiMailSendLine className="text-lg" /> 
                  <span>{isLoading ? 'Sending...' : 'Send'}</span>
                </>
              )}
            </button>        
          </div>
        </form>
      </div>

      {/* Footer Card */}
      <div className='w-full backdrop-blur-xl bg-[#1a1a1a]/90 border border-white/10 shadow-xl rounded-2xl p-4 flex items-center justify-between relative overflow-hidden'>
         {/* Gradient Glow Effect */}
         <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
         
        <span className='text-white/50 text-sm font-medium relative z-10'>other ways to contact us</span>
        
        <div className="flex items-center gap-3 relative z-10">
          <a
            href="https://facebook.com/burnboxprinting"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-all hover:scale-110"
            aria-label="Facebook"
          >
            <FaFacebook className='text-xl'/>
          </a>
          <a
            href="https://www.instagram.com/burnboxprinting/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all hover:scale-110"
            aria-label="Instagram"
          >
            <Image
              height={20}
              width={20}
              alt='instagram'
              src='/instagram.png'
              className='w-5 h-5 object-contain'
            />
          </a>
          <a
            href="viber://chat?number=YOUR_PHONE_NUMBER"
            className="p-2 rounded-lg bg-[#7360f2]/10 hover:bg-[#7360f2]/20 text-[#7360f2] transition-all hover:scale-110"
            aria-label="Viber"
          >
            <FaViber className='text-xl'/>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailPopup
