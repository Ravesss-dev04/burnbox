"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteConfig {
  [key: string]: any;
}

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (key: string, value: any) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  editKey: string | null;
  setEditKey: (key: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(
  undefined
);

export const SiteConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [config, setConfig] = useState<SiteConfig>({});
  const [history, setHistory] = useState<SiteConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/zapi/site-config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setHistory([data]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newConfig);
      
      // Limit history size if needed (e.g., 50 steps)
      if (newHistory.length > 50) newHistory.shift();
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      return newConfig;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setConfig(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setConfig(history[historyIndex + 1]);
    }
  };

  const saveConfig = async () => {
    try {
      const res = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        throw new Error("Failed to save config");
      }
      alert("Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save configuration.");
    }
  };
  return (
    <SiteConfigContext.Provider
      value={{  
        config,   
        updateConfig, 
        saveConfig, 
        isLoading, 
        isEditing, 
        setEditing, 
        editKey, 
        setEditKey,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
};