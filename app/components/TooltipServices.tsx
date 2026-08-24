// components/TooltipServices.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useHeaderContext } from "../context/HeaderContext";
import { useTooltip } from "../context/TooltipContext";

interface TooltipServicesProps {
  services: { id: number; name: string; nestedTooltip?: string[] }[];
  onServiceClick?: (serviceName: string) => void;
}

const TooltipServices: React.FC<TooltipServicesProps> = ({
  services,
  onServiceClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { selectProductByName } = useHeaderContext(); // Fixed function name
  const { setShowServices } = useTooltip();

  const handleServiceClick = (serviceName: string) => {
    // Close the tooltip
    setShowServices(false);
    
    // Select the corresponding product
    selectProductByName(serviceName); // Fixed function name
    
    // Scroll to products section
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
    
    // Call any additional callback
    onServiceClick?.(serviceName);
  };


  
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 mt-2 w-52 bg-[#F7F1EA] border-[1.5px] border-[#231F20] rounded-sm shadow-[3px_3px_0_0_#231F20] z-50"
    >
      <ul className="text-sm text-[#231F20] relative">
        {services.map((service, index) => (
          <li
            key={service.id}
            className="px-4 py-2.5 hover:bg-[#FF0060] hover:text-white cursor-pointer transition-colors duration-200 relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleServiceClick(service.name)}
          >
            {service.name}
            {/* Nested tooltip */}
            {hoveredIndex === index && service.nestedTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 right-full mr-1.5 w-44 bg-[#F7F1EA] border-[1.5px] border-[#231F20] rounded-sm shadow-[3px_3px_0_0_#231F20] p-2 z-50 text-xs text-[#231F20]"
              >
                <ul>
                  {service.nestedTooltip.map((nestedItem, i) => (
                    <li
                      key={i}
                      className="py-2 px-2 rounded-sm text-[#7A736D] hover:text-[#FF0060] hover:bg-[#EFE6DB] cursor-default"
                    >
                      {nestedItem}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TooltipServices;
