"use client";
import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Type, Image as ImageIcon, Layout, 
  Trash2, X, Move, Maximize, Palette,
  Circle, Triangle, Square,
  RotateCw, BoxSelect, Layers, Sun, Minus, Plus,
  MousePointer2, CornerUpLeft, LogOut
} from 'lucide-react';

const EditorSidebar = () => {
  const { config, updateConfig, editKey, setEditKey } = useSiteConfig();

  // Helper to update style of selected element
  const updateSelectedStyle = (property: string, value: any) => {
    if (!editKey) return;
    const currentStyle = config[`${editKey}_style`] || {};
    updateConfig(`${editKey}_style`, { ...currentStyle, [property]: value });
  };

  const getSelectedStyle = (property: string) => {
    if (!editKey) return '';
    const style = config[`${editKey}_style`] || {};
    return style[property] || '';
  };

  const updatePosition = (axis: 'x' | 'y', value: number) => {
    if (!editKey) return;
    const currentPos = config[`${editKey}_pos`] || { x: 0, y: 0 };
    updateConfig(`${editKey}_pos`, { ...currentPos, [axis]: value });
  };

  const getPosition = (axis: 'x' | 'y') => {
    if (!editKey) return 0;
    const pos = config[`${editKey}_pos`] || { x: 0, y: 0 };
    return pos[axis];
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
        if (config.addedElements) {
            const newElements = config.addedElements.filter((el: any) => el.id !== editKey);
            updateConfig('addedElements', newElements);
        }
        updateConfig(`${editKey}_hidden`, true);
        setEditKey(null);
    }
  };

  // --- RENDER: NO ELEMENT SELECTED (GLOBAL STYLES) ---
  if (!editKey) {
    return (
      <div className="hidden md:flex w-80 bg-[#1e1e1e] border-l border-[#333] shadow-2xl z-40 overflow-y-auto custom-scrollbar text-white font-sans text-xs select-none flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] bg-[#1e1e1e] sticky top-0 z-10">
          <div className="flex items-center gap-2 font-semibold">
            <Palette size={14} className="text-pink-500" />
            <span>Page Settings</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Section title="Global Colors">
             <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Background</label>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-white/10 overflow-hidden relative">
                            <input 
                                type="color" 
                                value={config.globalBgColor || "#000000"}
                                onChange={(e) => updateConfig('globalBgColor', e.target.value)}
                                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                            />
                        </div>
                        <input 
                            type="text" 
                            value={config.globalBgColor || "#000000"}
                            onChange={(e) => updateConfig('globalBgColor', e.target.value)}
                            className="flex-1 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none uppercase"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Text Color</label>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-white/10 overflow-hidden relative">
                            <input 
                                type="color" 
                                value={config.globalTextColor || "#ffffff"}
                                onChange={(e) => updateConfig('globalTextColor', e.target.value)}
                                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                            />
                        </div>
                        <input 
                            type="text" 
                            value={config.globalTextColor || "#ffffff"}
                            onChange={(e) => updateConfig('globalTextColor', e.target.value)}
                            className="flex-1 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none uppercase"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Primary Color</label>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-white/10 overflow-hidden relative">
                            <input 
                                type="color" 
                                value={config.primaryColor || "#ec4899"}
                                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                            />
                        </div>
                        <input 
                            type="text" 
                            value={config.primaryColor || "#ec4899"}
                            onChange={(e) => updateConfig('primaryColor', e.target.value)}
                            className="flex-1 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none uppercase"
                        />
                    </div>
                </div>
             </div>
          </Section>

          <Section title="Typography">
             <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Font Family</label>
                    <select 
                        value={config.fontFamily || 'Outfit, sans-serif'}
                        onChange={(e) => updateConfig('fontFamily', e.target.value)}
                        className="w-full bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                    >
                        <option value="Outfit, sans-serif">Outfit</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                        <option value="Courier New, monospace">Courier New</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                    </select>
                </div>
             </div>
          </Section>

          <Section title="Assets & Transitions">
             <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Logo URL</label>
                    <input 
                        type="text" 
                        value={config.logo || "/burnboxlogo.png"}
                        onChange={(e) => updateConfig('logo', e.target.value)}
                        className="w-full bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Page Transitions</label>
                    <select 
                        value={config.transitionType || 'up'}
                        onChange={(e) => updateConfig('transitionType', e.target.value)}
                        className="w-full bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                    >
                        <option value="up">Fade Up</option>
                        <option value="down">Fade Down</option>
                        <option value="left">Slide Left</option>
                        <option value="right">Slide Right</option>
                        <option value="zoom">Zoom In</option>
                        <option value="fade">Simple Fade</option>
                    </select>
                </div>
             </div>
          </Section>
        </div>
      </div>
    );
  }

  // --- RENDER: ELEMENT SELECTED ---
  const elementType = config[`${editKey}_type`] || 'text';

  return (
    <div className="fixed inset-y-0 right-0 z-50 md:static md:z-auto w-80 bg-[#1e1e1e] border-l border-[#333] shadow-2xl overflow-y-auto custom-scrollbar text-white font-sans text-xs select-none flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] bg-[#1e1e1e] sticky top-0 z-10">
        <div className="flex items-center gap-2 font-semibold">
          <SettingsIcon type={elementType} />
          <span className="capitalize">{elementType}</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setEditKey(null)} className="text-gray-400 hover:text-white">
                <X size={16} />
            </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Layout Section (Position, Size, Rotation) */}
        <Section title="Layout">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <InputGroup label="X" value={getPosition('x')} onChange={(v) => updatePosition('x', Number(v))} type="number" />
            <InputGroup label="Y" value={getPosition('y')} onChange={(v) => updatePosition('y', Number(v))} type="number" />
            <InputGroup label="W" value={getSelectedStyle('width')} onChange={(v) => updateSelectedStyle('width', v)} />
            <InputGroup label="H" value={getSelectedStyle('height')} onChange={(v) => updateSelectedStyle('height', v)} />
            <div className="col-span-2 flex items-center gap-2">
               <RotateCw size={12} className="text-gray-400" />
               <InputGroup label="Rotation" value={getSelectedStyle('rotate')} onChange={(v) => updateSelectedStyle('rotate', v)} placeholder="0deg" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
               <CornerUpLeft size={12} className="text-gray-400" />
               <InputGroup label="Radius" value={getSelectedStyle('borderRadius')} onChange={(v) => updateSelectedStyle('borderRadius', v)} placeholder="0px" />
            </div>
          </div>
        </Section>

        {/* Typography (Only for text) */}
        {elementType === 'text' && (
          <Section title="Typography">
             <div className="space-y-3">
                <select 
                  value={getSelectedStyle('fontFamily') || ''}
                  onChange={(e) => updateSelectedStyle('fontFamily', e.target.value)}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                >
                  <option value="">Default Font</option>
                  <option value="Outfit, sans-serif">Outfit</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Courier New, monospace">Courier New</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Impact, sans-serif">Impact</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                   <select 
                      value={getSelectedStyle('fontWeight') || '400'}
                      onChange={(e) => updateSelectedStyle('fontWeight', e.target.value)}
                      className="bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                    >
                      <option value="300">Light</option>
                      <option value="400">Regular</option>
                      <option value="600">SemiBold</option>
                      <option value="700">Bold</option>
                      <option value="900">Black</option>
                    </select>
                    <InputGroup label="Size" value={getSelectedStyle('fontSize')} onChange={(v) => updateSelectedStyle('fontSize', v)} />
                </div>

                <div className="flex bg-[#2c2c2c] rounded p-1 gap-1">
                    <AlignButton icon={AlignLeft} active={getSelectedStyle('textAlign') === 'left'} onClick={() => updateSelectedStyle('textAlign', 'left')} />
                    <AlignButton icon={AlignCenter} active={getSelectedStyle('textAlign') === 'center'} onClick={() => updateSelectedStyle('textAlign', 'center')} />
                    <AlignButton icon={AlignRight} active={getSelectedStyle('textAlign') === 'right'} onClick={() => updateSelectedStyle('textAlign', 'right')} />
                </div>
             </div>
          </Section>
        )}

        {/* Fill */}
        <Section title="Fill">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded border border-white/10 overflow-hidden relative">
                    <input 
                      type="color" 
                      value={getSelectedStyle(elementType === 'text' ? 'color' : 'backgroundColor') || '#000000'}
                      onChange={(e) => updateSelectedStyle(elementType === 'text' ? 'color' : 'backgroundColor', e.target.value)}
                      className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                    />
                 </div>
                 <input 
                    type="text" 
                    value={getSelectedStyle(elementType === 'text' ? 'color' : 'backgroundColor') || ''}
                    onChange={(e) => updateSelectedStyle(elementType === 'text' ? 'color' : 'backgroundColor', e.target.value)}
                    className="flex-1 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none uppercase"
                    placeholder="#000000"
                 />
                 <div className="w-16 flex items-center gap-1">
                    <span className="text-gray-500 text-[10px]">%</span>
                    <input 
                        type="number" 
                        min="0" max="100"
                        value={((getSelectedStyle('opacity') || 1) * 100)}
                        onChange={(e) => updateSelectedStyle('opacity', Number(e.target.value) / 100)}
                        className="w-full bg-transparent text-right focus:outline-none"
                    />
                 </div>
              </div>
           </div>
        </Section>

        {/* Stroke */}
        <Section title="Stroke">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded border border-white/10 overflow-hidden relative">
                    <input 
                      type="color" 
                      value={getSelectedStyle('borderColor') || '#000000'}
                      onChange={(e) => updateSelectedStyle('borderColor', e.target.value)}
                      className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                    />
                 </div>
                 <input 
                    type="text" 
                    value={getSelectedStyle('borderColor') || ''}
                    onChange={(e) => updateSelectedStyle('borderColor', e.target.value)}
                    className="flex-1 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none uppercase"
                    placeholder="Color"
                 />
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <InputGroup label="Width" value={getSelectedStyle('borderWidth')} onChange={(v) => updateSelectedStyle('borderWidth', v)} placeholder="0px" />
                  <select 
                      value={getSelectedStyle('borderStyle') || 'solid'}
                      onChange={(e) => updateSelectedStyle('borderStyle', e.target.value)}
                      className="bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none"
                    >
                      <option value="none">None</option>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
              </div>
           </div>
        </Section>

        {/* Effects */}
        <Section title="Effects">
           <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <label className="text-gray-400">Drop Shadow</label>
                 <button 
                    onClick={() => updateSelectedStyle('boxShadow', getSelectedStyle('boxShadow') ? '' : '0px 4px 10px rgba(0,0,0,0.5)')}
                    className="text-gray-400 hover:text-white"
                 >
                    {getSelectedStyle('boxShadow') ? <Minus size={14} /> : <Plus size={14} />}
                 </button>
              </div>
              {getSelectedStyle('boxShadow') && (
                  <textarea 
                    value={getSelectedStyle('boxShadow')}
                    onChange={(e) => updateSelectedStyle('boxShadow', e.target.value)}
                    className="w-full h-16 bg-[#2c2c2c] border border-transparent rounded px-2 py-1.5 focus:border-pink-500 focus:outline-none text-[10px]"
                    placeholder="0px 4px 10px rgba(0,0,0,0.5)"
                  />
              )}
           </div>
        </Section>

        {/* Delete Button */}
        <div className="pt-4 border-t border-[#333]">
            <button 
                onClick={handleDelete}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded flex items-center justify-center gap-2 transition-colors"
            >
                <Trash2 size={14} /> Delete
            </button>
        </div>

      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="border-b border-[#333] pb-4 last:border-0">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-3">{title}</h4>
        {children}
    </div>
);

interface InputGroupProps {
  label: string;
  value: any;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const InputGroup = ({ label, value, onChange, type = "text", placeholder }: InputGroupProps) => (
    <div className="flex items-center gap-2 bg-[#2c2c2c] rounded px-2 py-1.5 hover:border-gray-600 border border-transparent focus-within:border-pink-500 transition-colors">
        <span className="text-gray-500 w-4 text-[10px]">{label}</span>
        <input 
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-white"
            placeholder={placeholder}
        />
    </div>
);

const AlignButton = ({ icon: Icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 p-1.5 rounded hover:bg-[#3e3e3e] flex justify-center transition-colors ${active ? 'bg-[#3e3e3e] text-white' : 'text-gray-400'}`}
  >
    <Icon size={14} />
  </button>
);

const SettingsIcon = ({ type }: { type: string }) => {
    switch(type) {
        case 'text': return <Type size={14} className="text-blue-400" />;
        case 'image': return <ImageIcon size={14} className="text-green-400" />;
        case 'card': return <Layout size={14} className="text-orange-400" />;
        case 'circle': return <Circle size={14} className="text-pink-400" />;
        case 'triangle': return <Triangle size={14} className="text-purple-400" />;
        case 'square': return <Square size={14} className="text-yellow-400" />;
        default: return <Move size={14} className="text-gray-400" />;
    }
}

export default EditorSidebar;