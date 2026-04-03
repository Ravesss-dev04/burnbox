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
      className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50"
    >
      <ul className="text-sm text-white relative">
        {services.map((service, index) => (
          <li
            key={service.id}
            className="px-4 py-2 hover:bg-pink-600 hover:text-white cursor-pointer transition-colors duration-200 relative"
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
                className="absolute top-0 right-full w-40 bg-gray-900 border border-gray-600 rounded-md shadow-lg p-2 z-50 text-xs"
              >
                <ul>
                  {service.nestedTooltip.map((nestedItem, i) => (
                    <li
                      key={i}
                      className="py-2 hover:text-pink-500 cursor-default text-based"
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