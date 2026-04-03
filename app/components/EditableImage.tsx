"use client";

import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Edit } from 'lucide-react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  configKey: string;
  defaultSrc: string;
}

const EditableImage: React.FC<EditableImageProps> = ({ configKey, defaultSrc, className, ...props }) => {
  const { config, isEditing, setEditKey } = useSiteConfig();
  const src = config[configKey] || defaultSrc;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setEditKey(configKey);
    }
  };

  return (
    <div className={`relative ${className} group`}>
      <img 
        src={src} 
        className={`w-full h-full object-cover ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={handleClick}
        {...props}
      />
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none bg-black/30 transition-opacity">
          <div className="bg-pink-600 text-white p-2 rounded-full shadow-lg">
            <Edit size={24} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
