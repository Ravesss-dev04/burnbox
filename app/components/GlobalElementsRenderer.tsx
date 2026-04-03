"use client";
import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import Editable from './Editable';

const GlobalElementsRenderer = () => {
  const { config } = useSiteConfig();
  const elements = config.addedElements || [];

  if (elements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[9999] overflow-visible w-full h-full min-h-screen">
      {elements.map((el: any) => (
        <div key={el.id} className="pointer-events-auto absolute top-0 left-0">
            {el.type === 'text' && (
                <Editable 
                    name={el.id} 
                    type="text" 
                    defaultValue={el.content}
                    className="text-white text-xl font-bold whitespace-pre-wrap"
                />
            )}
            {el.type === 'card' && (
                <Editable 
                    name={el.id} 
                    type="container"
                    className="bg-zinc-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-6 min-w-[300px] min-h-[200px]"
                >
                    <div className="flex flex-col gap-2 h-full">
                        <Editable 
                            name={`${el.id}_title`} 
                            as="h3"
                            type="text" 
                            defaultValue="Card Title" 
                            className="text-xl font-bold text-white" 
                        />
                        <Editable 
                            name={`${el.id}_desc`} 
                            as="p"
                            type="text" 
                            defaultValue="Card description goes here." 
                            className="text-gray-400 flex-1" 
                        />
                    </div>
                </Editable>
            )}
            {el.type === 'image' && (
                <Editable 
                    name={el.id} 
                    type="image"
                    defaultValue={el.content}
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{ width: '200px', height: '200px' }}
                />
            )}
            {(el.type === 'circle' || el.type === 'square' || el.type === 'triangle') && (
                <Editable 
                    name={el.id} 
                    type="container"
                    className="shadow-lg"
                    style={{ width: '100px', height: '100px' }}
                />
            )}
        </div>
      ))}
    </div>
  );
};

export default GlobalElementsRenderer;