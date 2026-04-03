"use client";

import { ToolTipProps } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'



const ToolTip = ({ buttons, setToolTip }: ToolTipProps) => {
  const toolTipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolTipRef.current && !toolTipRef.current.contains(event.target as Node)) {
        setToolTip(false);
      }
    };  

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if (!setToolTip) return null;
  return (
    <AnimatePresence>
      <motion.div 
        ref={toolTipRef}
        className='w-48 flex flex-col rounded-md shadow-md bg-black/75 backdrop-blur-md absolute right-0 top-full mt-8 text-white text-nowrap overflow-hidden z-50 border border-white/50'
        initial={{
          opacity: 0,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        exit={{
          opacity: 0,
          scale: 0.8
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
      >
        {buttons.map((val, i) => {
          return (
           <Link href={`/${val.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '')}`} key={i} onClick={() => setToolTip(false)}>
              <button 
                type='button'
                className='w-full text-left px-3 py-2 font-base hover:bg-[#FAECEC] hover:text-pink hover:font-medium ease-in-out duration-200'
              >
                {val}
              </button>
            </Link>
          );
        })}
      </motion.div>
    </AnimatePresence>
  )
}

export default ToolTip