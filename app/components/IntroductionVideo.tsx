"use client";

import { IntroductionVideoProps } from '@/types';
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { HiVideoCamera } from 'react-icons/hi2'

const IntroductionVideo = ({ isVideoVisible }: IntroductionVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [skipTimer, setSkipTimer] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setSkipTimer((prev) => {
        if(prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);

    const video = videoRef.current;

    if(video) {
      video.play().catch((err) => console.log("Autoplay blocked:", err))
    }
    return () => clearInterval(interval);
  }, [])





  return (
    <div className="h-full w-full z-[99] bg-black/40 backdrop-blur-md top-0 left-0 fixed flex items-center justify-center px-4">
      <div className="h-auto w-full sm:w-3/4 lg:w-1/2 bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4">
        
        {/* Header Section */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-[18px] lg:text-[20px]  sm:text-base md:text-lg font-medium leading-relaxed text-gray-800">
            Thank you for visiting us!
          </h1>
          <span className="flex items-center gap-18 lg:gap-3 text-sm sm:text-base">
            <p className="text-gray-600">You can skip after {skipTimer} seconds</p>
            <button
              type="button"
              className={`text-lg p-1 rounded-full transition ${
                canSkip
                  ? 'border border-rose-500 text-rose-500 hover:bg-rose-100'
                  : 'border border-transparent bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canSkip}
              onClick={() => isVideoVisible(false)}
            >
              <HiOutlineX />
            </button>
          </span>
        </div>

        {/* Video Placeholder */}
        <div className="h-48 sm:h-64 md:h-120 w-full bg-gray-900 rounded-md flex items-center justify-center text-6xl sm:text-7xl md:text-8xl">
        <video 
        ref={videoRef}
        src="/videos/video.mp4"
        className='w-full h-full object-cover'
        autoPlay
        playsInline
        muted
        controls
        />
        </div>
      </div>
    </div>
  );
};

export default IntroductionVideo
