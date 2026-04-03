"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type TooltipContextType = {
  showAbout: boolean;
  setShowAbout: (value: boolean) => void;
  showServices: boolean;
  setShowServices: (value: boolean) => void;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showServices, setShowServices] = useState(false);

  return (
    <TooltipContext.Provider value={{ showAbout, setShowAbout, showServices, setShowServices }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("useTooltip must be used within TooltipProvider");
  return context;
};


