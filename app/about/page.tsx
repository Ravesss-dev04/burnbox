"use client";
import React from 'react'
import AboutPages from '../components/AboutPages';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const page = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='relative min-h-screen bg-[#F7F1EA]'
    >
      {/* Grid Pattern matching MainPage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(35,31,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,31,32,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Background with overlay */}
      <div 
        className='absolute inset-0 opacity-5 pointer-events-none'
        style={{
          backgroundImage: "url('/missionbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content */}
      <div className='relative z-10'>
        <AboutPages/>
       
        <Footer/>
      </div>
    </motion.div>
  )
}

export default page




