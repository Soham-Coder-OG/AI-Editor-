import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { Mode } from '../types';

interface NavigationContextType {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>('editor');

  const value = {
    mode,
    setMode,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};
