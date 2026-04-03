"use client";
import { motion, useInView } from 'framer-motion'
import { Target, Eye, Sparkles } from 'lucide-react'
import React, { useRef } from 'react'

const MissionVission = () => {
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const visionInView = useInView(visionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as const
      }
    }
  };

  return (
    <motion.section 
      id='mission-and-vision' 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className='relative bg-[#050505] z-[1] mt-10 md:mt-20 w-full min-h-[100vh] overflow-hidden flex flex-col items-center pb-10 py-16 gap-8 md:gap-12 px-4 md:px-8'
    >
      {/* Dark background with grid pattern matching MainPage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      
      {/* Background image overlay */}
      <div 
        className='absolute inset-0 opacity-10 pointer-events-none'
        style={{
          backgroundImage: "url('/missionbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Subtle decorative background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px]'></div>
        <div className='absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]'></div>
      </div>

      {/* Mission section */}
      <motion.div
        ref={missionRef}
        initial="hidden"
        animate={missionInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='relative w-full max-w-7xl'
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          className='flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_0_30px_rgba(236,72,153,0.1)] border border-white/10 hover:border-pink-500/30 transition-all duration-500 overflow-hidden group'
        >
          {/* Subtle glow effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          
          {/* Text content */}
          <motion.div
            variants={textVariants}
            className='relative z-10 md:w-1/2 text-center md:text-left space-y-6 md:pr-8'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={missionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='relative flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4'
            >
              <div className='flex items-center gap-3'>
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className='p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg'
                >
                  <Target className='w-6 h-6 md:w-8 md:h-8 text-white' />
                </motion.div>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent'>
                  Our Mission
                </h2>
              </div>
              <motion.img
                src="/missionicon.png"
                alt="Mission icon"
                className='w-24 md:w-32 h-auto object-contain opacity-80'
                initial={{ opacity: 0, x: -20 }}
                animate={missionInView ? { opacity: 0.8, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className='text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl font-light'
            >
              To exceed client expectations by delivering innovative printing
              solutions, exceptional services, and continuous improvement in
              everything we do.
            </motion.p>
          </motion.div>
          {/* Image */}
          <motion.div
            variants={imageVariants}
            className='relative md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end'
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2, y: -3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className='relative'
            >
              {/* Subtle glow behind image */}
              <div className='absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/5 blur-xl rounded-full scale-105'></div>
              <img
                src="/mission.png"
                alt="Mission"
                className='relative w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl'
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={missionInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className='absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-[#333333]/80 to-transparent blur-xl rounded-full'
              ></motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Vision section */}
      <motion.div
        ref={visionRef}
        initial="hidden"
        animate={visionInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='relative w-full max-w-7xl'
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          className='flex flex-col md:flex-row-reverse justify-between items-center bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_0_30px_rgba(168,85,247,0.1)] border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden group'
        >
          {/* Subtle glow effect */}
          <div className='absolute inset-0 bg-gradient-to-l from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

          {/* Text content */}
          <motion.div
            variants={textVariants}
            className='relative z-10 md:w-1/2 text-center md:text-left space-y-6 md:pl-8'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={visionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='relative flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4'
            >
              <div className='flex items-center gap-3'>
                <motion.div
                  whileHover={{ rotate: -360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className='p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg'
                >
                  <Eye className='w-6 h-6 md:w-8 md:h-8 text-white' />
                </motion.div>
                <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent'>
                  Our Vision
                </h2>
              </div>
              <motion.img
                src="/vissionicon.png"
                alt="Vision icon"
                className='w-24 md:w-32 h-auto object-contain opacity-80'
                initial={{ opacity: 0, x: 20 }}
                animate={visionInView ? { opacity: 0.8, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className='text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl font-light'
            >
              To become the go-to creative printing partner for businesses
              nationwide, recognized for reliability, creativity, and quality that
              inspires clients to recommend us again and again.
            </motion.p>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={imageVariants}
            className='relative md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-start'
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2, y: -3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className='relative'
            >
              {/* Subtle glow behind image */}
              <div className='absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-purple-600/5 blur-xl rounded-full scale-105'></div>
              <img
                src="/visionimg.png"
                alt="Vision"
                className='relative w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl'
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visionInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className='absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-[#333333]/80 to-transparent blur-xl rounded-full'
              ></motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default MissionVission