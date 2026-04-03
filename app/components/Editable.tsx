"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Move, Type, Image as ImageIcon, Layout, Trash2, Upload, Palette, X, Check } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

interface EditableProps {
  name: string;
  defaultValue?: string;
  type?: 'text' | 'image' | 'container' | 'section';
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  style?: React.CSSProperties;
  as?: any; // Component to render as (h1, p, div, etc.)
}

const Editable = ({ 
  name, 
  defaultValue = '', 
  type = 'text', 
  className = '', 
  children, 
  placeholder,
  style = {},
  as: Component = 'div'
}: EditableProps) => {
  const { config, isEditing, setEditKey, editKey, updateConfig } = useSiteConfig();
  const [isHovered, setIsHovered] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const dragControls = useDragControls();

  // Get current value from config or fallback to default
  const value = config[name] !== undefined ? config[name] : defaultValue;
  
  // Get custom styles and position
  const customStyles = config[`${name}_style`] || {};
  const position = config[`${name}_pos`] || { x: 0, y: 0 };
  const isHidden = config[`${name}_hidden`];
  
  // Extract rotation from styles if present (stored as number or string with deg)
  const rotation = customStyles.rotate ? parseFloat(customStyles.rotate) : 0;

  const isSelected = editKey === name;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    setEditKey(name);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing || type !== 'text') return;
    e.stopPropagation();
    setIsInlineEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsInlineEditing(false);
    if (type === 'text') {
      updateConfig(name, e.currentTarget.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
    updateConfig(`${name}_pos`, newPos);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to hide this element?')) {
      updateConfig(`${name}_hidden`, true);
      setEditKey(null);
    }
  };

  const handleImageUpload = () => {
    // Trigger hidden file input
    const fileInput = document.getElementById(`file-input-${name}`) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateConfig(name, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resize Logic
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(customStyles.width || (elementRef.current?.offsetWidth + 'px'), 10);
    const startHeight = parseInt(customStyles.height || (elementRef.current?.offsetHeight + 'px'), 10);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      updateConfig(`${name}_style`, { 
        ...customStyles, 
        width: `${Math.max(20, newWidth)}px`, 
        height: `${Math.max(20, newHeight)}px` 
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Combined styles
  const finalStyle = {
    ...style,
    ...customStyles,
    cursor: isEditing ? (isSelected ? 'move' : 'pointer') : 'inherit',
    outline: isEditing && isSelected && !isInlineEditing ? '2px solid #ec4899' : isEditing && isHovered && !isInlineEditing ? '1px dashed #ec4899' : 'none',
    position: (style.position || 'relative') as any,
    minHeight: type === 'text' && !value ? '1em' : undefined,
    opacity: isHidden && !isEditing ? 0 : isHidden && isEditing ? 0.3 : 1,
    pointerEvents: isHidden && !isEditing ? 'none' : 'auto',
    display: isHidden && !isEditing ? 'none' : undefined,
    zIndex: isSelected ? 50 : undefined, // Bring to front when selected
  };

  // Motion Component
  const MotionComponent = motion.create(Component);

  
  if (!isEditing) {
    if (isHidden) return null;
    // Render normally when not editing (with saved position)
    const renderStyle = { 
      ...finalStyle, 
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)` 
    };
    
    if (type === 'image') {
      return <motion.img src={value} alt={name} className={className} style={renderStyle} />;
    }
    if (type === 'text') {
      const displayValue = typeof value === 'string' ? value.replace(/\\n/g, '\n') : value;
      return <MotionComponent className={className} style={{...renderStyle, whiteSpace: 'pre-wrap'}}>{displayValue}</MotionComponent>;
    }
    return <MotionComponent className={className} style={renderStyle}>{children}</MotionComponent>;
  }

  // Render with editing wrappers
  return (
    <MotionComponent
      ref={elementRef}
      className={`${className} relative transition-colors duration-200`}
      style={{...finalStyle, whiteSpace: type === 'text' ? 'pre-wrap' : undefined}}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      contentEditable={isInlineEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      drag={isSelected && !isInlineEditing}
      dragMomentum={false}
      dragListener={isSelected}
      onDragEnd={handleDragEnd}
      initial={{ ...position, rotate: rotation }}
      animate={{ ...position, rotate: rotation }}
    >
      {/* Selection Label & Toolbar */}
      {isEditing && (isSelected || isHovered) && !isInlineEditing && (
        <>
            <div className="absolute -top-10 left-0 flex items-center gap-1 z-[60] pointer-events-none">
            <div className="bg-pink-600 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 shadow-lg whitespace-nowrap">
                {type === 'text' && <Type size={10} />}
                {type === 'image' && <ImageIcon size={10} />}
                {type === 'container' && <Layout size={10} />}
                <span className="font-mono">{name}</span>
            </div>
            <div className="bg-gray-800 text-white p-1 rounded-md shadow-lg flex items-center gap-1 pointer-events-auto">
                {type === 'image' && (
                 <button onClick={handleImageUpload} className="p-1 hover:bg-gray-700 rounded" title="Change Image">
                   <Upload size={12} />
                 </button>
                )}
                <button onClick={handleDelete} className="hover:text-red-400 p-1"><Trash2 size={12} /></button>
                <div className="w-[1px] h-3 bg-gray-600"></div>
                <div className="cursor-move p-1"><Move size={12} /></div>
            </div>
            </div>
            
            {/* Resize Handle */}
            {isSelected && (
                <div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-pink-500 rounded-full cursor-se-resize z-[60] hover:scale-125 transition-transform"
                    onMouseDown={handleResizeStart}
                />
            )}
        </>
      )}

      {/* Content */}
      {type === 'image' ? (
        <>
            <img src={value} alt={name} className="w-full h-full object-cover pointer-events-none" />
            <input 
                type="file" 
                id={`file-input-${name}`} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </>
      ) : type === 'text' ? (
        isInlineEditing ? value : (typeof value === 'string' ? value.replace(/\\n/g, '\n') : (value || placeholder || 'Empty Text'))
      ) : (
        children
      )}
    </MotionComponent>
  );
};

export default Editable;
