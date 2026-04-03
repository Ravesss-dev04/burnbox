// app/components/StoreDetail.tsx
import React, { useState, useEffect } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Branch } from '@/data/branches';
import Image from 'next/image';

interface StoreDetailProps {
    branch: Branch;
    onDirectionClick: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ branch, onDirectionClick }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const checkStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple logic: 9am-6pm
    const isOpenHours = currentHour >= 9 && currentHour < 18;
    setIsOpen(isOpenHours);
  }

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [branch]);

  const handleCall = () => {
    window.open(`tel:${branch.phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const handleGetDirections = () => {
    onDirectionClick();
    setTimeout(() => {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
    }, 500);
  };

  return (
    <div className='text-white space-y-4'>
        {/* Image Preview */}
        <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 border border-white/10 group">
           <Image 
             src={branch.image} 
             alt={branch.name}
             fill
             className="object-cover group-hover:scale-110 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
           <div className="absolute bottom-3 left-3">
             <h2 className='text-lg font-bold text-white shadow-black drop-shadow-md'>{branch.name}</h2>
           </div>
        </div>

        <div className='space-y-3 px-1'>
            <div className='flex items-start gap-3'>
                <FaLocationDot className='text-pink-500 mt-1 shrink-0'/>
                <span className="text-sm text-gray-300 leading-relaxed">
                    {branch.address}<br />
                    {branch.city}
                </span>
            </div>

            <div className='flex items-start gap-3'>
                <FaCalendar className='mt-1 text-pink-500 shrink-0'/>
                <div className="text-sm w-full">
                  <div className="flex justify-between items-center">
                    <p className='text-gray-300'>
                        {branch.hours}
                    </p>
                  </div>
                  <span 
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        isOpen 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {isOpen ? 'Open Now' : 'Closed'}
                    </span>
                </div>
            </div>

            <div className='flex items-center gap-3 text-sm text-gray-300'>
                <FaPhoneAlt className='text-pink-500 shrink-0'/>
                <a href={`tel:${branch.phone}`} className="hover:text-pink-400 transition-colors">{branch.phone}</a>
            </div>
            
            <div className='flex items-center gap-3 text-sm text-gray-300'>
                <FaEnvelope className='text-pink-500 shrink-0'/>
                <a href={`mailto:${branch.email}`} className="hover:text-pink-400 transition-colors truncate">{branch.email}</a>
            </div>
        </div>

        <div className='grid grid-cols-2 gap-3 pt-2'>
            <button 
              onClick={handleCall}
              className='bg-white/5 border border-white/10 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 hover:border-pink-500/30 transition-all group'
            >
                <FaPhoneAlt className='text-pink-500 group-hover:scale-110 transition-transform'/>
                <span className="font-medium text-sm">Call</span>
            </button>
            <button 
              onClick={handleGetDirections} 
              className='bg-[#ff0060] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d60050] transition-all shadow-lg shadow-pink-900/20 group'
            >
                <FaLocationDot className="group-hover:scale-110 transition-transform"/>
                <span className="font-medium text-sm">Navigate</span>
            </button>
        </div>
    </div> 
  )
}

export default StoreDetail