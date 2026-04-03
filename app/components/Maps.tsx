// app/components/Maps.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import StoreLocation from './StoreLocation';
import StoreDetail from './StoreDetail';
import { FaMap, FaSatellite, FaStreetView, FaCompass, FaTimes, FaExpand, FaCompress, FaCube, FaMoon } from "react-icons/fa";
import { branches, Branch } from '@/data/branches';

const Maps = () => {
  const [target, setTarget] = useState<[number, number] | undefined>(undefined);
  const [isInView, setIsInView] = useState(false);
  const [mapStyle, setMapStyle] = useState<'street' | 'dark' | 'satellite' | 'terrain'>('street');
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewMode, setStreetViewMode] = useState<'split' | 'full'>('split');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
  const [is3DMode, setIs3DMode] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        if (entry.isIntersecting) {
          flyToStore();
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const flyToStore = () => {
    setTarget([selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]);
  };

  // Update target when branch changes
  useEffect(() => {
    flyToStore();
  }, [selectedBranch]);

  const handleDirectionClick = () => {
    console.log("Directions clicked - flying to store");
    flyToStore();
  };

  const handleStreetViewClick = () => {
    setShowStreetView(!showStreetView);
  };

  const toggleStreetViewMode = () => {
    setStreetViewMode(streetViewMode === 'split' ? 'full' : 'split');
  };
  const closeStreetView = () => {
    setShowStreetView(false);
    setStreetViewMode('split');
  };
  const handleMapStyleChange = (style: 'street' | 'dark' | 'satellite' | 'terrain') => {
    setMapStyle(style);
  };
  
  // Map style configurations
  const mapStyles = {
    street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', // Voyager (Light/Modern)
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', // Dark Matter
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Direct Google Street View URL
  const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s${selectedBranch.coordinates.lat},${selectedBranch.coordinates.lng}!2m2!1d${selectedBranch.coordinates.lat}!2d${selectedBranch.coordinates.lng}!3f0!4f0!5f0.7820865974627469`;

  return (
    <section 
      id='maps' 
      ref={sectionRef}
      className='min-h-screen w-full z-0 relative bg-[#050505] overflow-hidden'
    >
      {/* Store Details Card */}
      <div className={`rounded-xl p-5 h-auto absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-[99999] bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 md:block ${
        showStreetView && streetViewMode === 'split' ? 'sm:w-[280px] md:w-[320px]' : 'sm:w-[320px] md:w-[380px] lg:w-[420px]'
      }`}>
        <StoreDetail 
          branch={selectedBranch}
          onDirectionClick={handleDirectionClick} 
        />
      </div>

      {/* Map Style Controls */}
      <div className='absolute top-6 right-6 z-[999] flex flex-col gap-3'>
        <div className="flex gap-2 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10 shadow-xl">
          <button
            onClick={() => handleMapStyleChange('street')}
            className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
              mapStyle === 'street' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title="Light Map"
          >
            <FaMap size={18} />
          </button>
          <button
            onClick={() => handleMapStyleChange('dark')}
            className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
              mapStyle === 'dark' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title="Dark Map"
          >
            <FaMoon size={18} />
          </button>
          <button
            onClick={() => handleMapStyleChange('satellite')}
            className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
              mapStyle === 'satellite' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title="Satellite"
          >
            <FaSatellite size={18} />
          </button>
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
              is3DMode ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title="3D Mode"
          >
            <FaCube size={18} />
          </button>
        </div>

        <div className="bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10 shadow-xl self-end">
           <button
            onClick={handleStreetViewClick}
            className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${
              showStreetView ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title="Street View"
          >
            <FaStreetView size={18} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className='w-full h-screen relative z-0'>
        <StoreLocation 
          target={target} 
          mapStyle={mapStyles[mapStyle]} 
          branches={branches}
          onSelectBranch={setSelectedBranch}
          is3DMode={is3DMode}
        />
      </div>

      {/* Street View Overlay */}
      {showStreetView && (
        <div className={`absolute z-[9999] transition-all duration-500 ease-in-out bg-black border-l border-white/10 shadow-2xl ${
          streetViewMode === 'full' 
            ? 'inset-0 w-full h-full' 
            : 'top-6 right-6 bottom-6 w-[400px] rounded-2xl overflow-hidden'
        }`}>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={toggleStreetViewMode}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-pink-600 transition-colors"
            >
              {streetViewMode === 'full' ? <FaCompress /> : <FaExpand />}
            </button>
            <button 
              onClick={closeStreetView}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-red-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <iframe
            src={streetViewUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      )}
    </section>
  );
};

export default Maps;