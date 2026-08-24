'use client';

import React from 'react';
import { HiOutlineArrowSmallRight } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { EmailPopupProps } from '@/types';
import ContactEmailForm from './ContactEmailForm';

const EmailPopup = ({ setShowEmailPopup }: EmailPopupProps) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:right-5 z-[70] flex flex-col gap-4 w-[350px] md:w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto scrollbar-hide"
    >
      <button
        type="button"
        className="absolute -top-2 right-0 z-20 p-2 rounded-full bg-[#231F20]/70 hover:bg-[#FF0060]/20 transition-colors group border border-[#FF0060]/20"
        onClick={() => setShowEmailPopup(false)}
        aria-label="Close contact form"
      >
        <HiOutlineArrowSmallRight className="text-[#F7F1EA]/60 group-hover:text-[#FF0060] text-xl" />
      </button>
      <ContactEmailForm onSuccess={() => setShowEmailPopup(false)} />
    </motion.div>
  );
};

export default EmailPopup;
