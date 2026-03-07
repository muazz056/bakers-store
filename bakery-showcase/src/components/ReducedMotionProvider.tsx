'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';

interface ReducedMotionContextType {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  setReducedMotion: (value: boolean) => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotionState] = useState(true);

  useEffect(() => {
    // Check for saved preference, otherwise default to reduced motion (animations off)
    const savedPreference = localStorage.getItem('reducedMotion');
    const initialValue = savedPreference !== null ? savedPreference === 'true' : true;
    setReducedMotionState(initialValue);
    
    // Update CSS custom property
    document.documentElement.style.setProperty(
      '--animation-duration',
      initialValue ? '0.01ms' : ''
    );
  }, []);

  const setReducedMotion = (value: boolean) => {
    setReducedMotionState(value);
    localStorage.setItem('reducedMotion', String(value));
    document.documentElement.style.setProperty(
      '--animation-duration',
      value ? '0.01ms' : ''
    );
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const value = useMemo(
    () => ({ reducedMotion, toggleReducedMotion, setReducedMotion }),
    [reducedMotion]
  );

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotion must be used within a ReducedMotionProvider');
  }
  return context;
}
