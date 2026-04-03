// components/ImageCard.tsx

import React, { useState } from 'react'
import Image from 'next/image'



type Props = {
  frontImg: string;
  hoverImg: string;
  title: string;
  description: string;
  features: string[];
  relatedImages: { src: string; label: string }[]; 
  isHovered?: boolean;
  onClick: (image: string, title: string, description: string, features: string[], relatedImages: {src: string; label: string}[]) => void;
}

const ImageCard: React.FC<Props> = ({ frontImg, hoverImg, title, description, features, relatedImages, isHovered: isHoveredProp = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const showHover = isHovered || isHoveredProp;

  return (
    <div 
      onClick={() => onClick(hoverImg, title, description, features, relatedImages)} 
      className="relative overflow-hidden group aspect-[4/5] min-w-full bg-gradient-to-tr from-neutral-700 via-neutral-500 to-neutral-300 shadow-md cursor-pointer transition-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
   >
    <div className='w-full transition-all duration-300 ease-in-out'> 
      <Image
        height={500}
        width={500}
        alt='Front image'
        src={isHovered ? hoverImg : frontImg}
        layout="responsive"
        className='w-full  object-contain  aspect-square   transition-opacity duration-300 ease-in-out'
        draggable={false}
      />
      </div>
      <div className="absolute -bottom-99 left-0 right-0 bg-gradient-to-t from-black/60 to-black/20 text-white   z-20 transition-all duration-300 group-hover:bottom-0">
        <h3 className="text-xl font-medium top-50 text-center">{title}</h3>
        <img src="/splashimg.png" alt="" />
        {/* <div className="text-sm flex justify-between items-center mt-1">
          <p>Pricing: <strong>Upon Inquiry</strong></p>
          <em className="text-xs">Tap to view</em>
        </div> */}
      </div>
    </div>
  )
}
export default ImageCard





