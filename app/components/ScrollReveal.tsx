"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom' | 'blur' | 'flipUp';
  className?: string;
  distance?: number;
  duration?: number;
}

// ScrollScale component for scroll-based scaling effects
interface ScrollScaleProps {
  children: ReactNode;
  scaleRange?: [number, number];
  className?: string;
}

export function ScrollScale({ 
  children, 
  scaleRange = [0.9, 1],
  className = '' 
}: ScrollScaleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: scaleRange[0],
    },
    visible: {
      opacity: 1,
      scale: scaleRange[1],
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '',
  distance = 30,
  duration = 0.8
}: ScrollRevealProps) {
  const { config } = useSiteConfig();
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px" // Trigger slightly earlier
  });
  const controls = useAnimation();

  // Override direction if global transition is set
  const effectiveDirection = config.transitionType || direction;

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const getDirectionOffset = () => {
    switch (effectiveDirection) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'zoom': return { scale: 0.8 };
      case 'blur': return { y: distance, filter: 'blur(10px)' };
      case 'flipUp': return { y: distance, rotateX: 15 };
      case 'fade': return {}; // Just opacity
      default: return { y: distance }; // Default to up
    }
  };



  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: direction === 'fade' ? 0.95 : (direction === 'zoom' ? 0.8 : 1),
      filter: direction === 'blur' ? 'blur(10px)' : 'blur(0px)',
      rotateX: direction === 'flipUp' ? 15 : 0,
      ...getDirectionOffset(),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for "professional" smooth ease
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
