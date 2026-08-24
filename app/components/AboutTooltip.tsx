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
      className="absolute top-full left-0 mt-2 w-52 bg-[#F7F1EA] border-[1.5px] border-[#231F20] rounded-sm shadow-[3px_3px_0_0_#231F20] z-50 overflow-hidden"
    >
      <ul className="text-sm text-[#231F20]">
        {aboutus.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            className="px-4 py-2.5 hover:bg-[#FF0060] hover:text-white cursor-pointer transition-colors duration-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
export default AboutTooltip;
