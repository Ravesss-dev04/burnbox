'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AboutTooltipProps {
  aboutus: string[];
}
const AboutTooltip: React.FC<AboutTooltipProps> = ({ aboutus }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (label: string) => {

    const routeMap: Record<string, string> = {
      'About Us': '/about#about-us',
      'Mission and Vission': '/about#mission-and-vision',
      'Why Choose Burnbox Printing?': '#why-choose-burnbox',
    };
    const target = routeMap[label];
    if (!target) return;
    if (label === 'Why Choose Burnbox Printing?') {
      if (pathname === '/') {
        // Already on homepage — scroll
        const section = document.querySelector(target);
        section?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home, then scroll after load
        router.push('/#why-choose-burnbox');
      }
    } else {
      router.push(target); // About Us and Mission navigate normally
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50"
    >
      <ul>
        {aboutus.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            className="px-4 py-2 hover:bg-pink-500 hover:text-white cursor-pointer transition-colors duration-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
export default AboutTooltip;