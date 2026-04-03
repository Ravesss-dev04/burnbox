"use client";

import { useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

const GlobalStyleInjector = () => {
  const { config } = useSiteConfig();

  useEffect(() => {
    const root = document.documentElement;
    
    if (config.primaryColor) {
      root.style.setProperty('--color-pink', config.primaryColor);
    }
    
    if (config.globalBgColor) {
      root.style.setProperty('--background', config.globalBgColor);
      document.body.style.backgroundColor = config.globalBgColor;
    }

    if (config.globalTextColor) {
      root.style.setProperty('--foreground', config.globalTextColor);
      document.body.style.color = config.globalTextColor;
    }

    if (config.fontFamily) {
      document.body.style.fontFamily = config.fontFamily;
    }

    if (config.borderRadius) {
      root.style.setProperty('--radius', config.borderRadius + 'px');
    }

  }, [config]);

  return null;
};

export default GlobalStyleInjector;