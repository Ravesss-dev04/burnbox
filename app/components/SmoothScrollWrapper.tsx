"use client";

import { useEffect, ReactNode } from 'react';

interface SmoothScrollWrapperProps {
  children: ReactNode;
}

export default function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  useEffect(() => {
    // Enable smooth scrolling globally via CSS
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Add CSS for smooth scrolling
      const style = document.createElement('style');
      style.textContent = `
        * {
          scroll-behavior: smooth;
        }
        html {
          scroll-padding-top: 80px;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return <>{children}</>;
}

