import { createContext, useContext, useState, useEffect } from 'react';

const ScaleModeContext = createContext();

export function ScaleModeProvider({ children }) {
  // Mode can be 'SMALL' (Lite) or 'LARGE' (Enterprise)
  const [scaleMode, setScaleMode] = useState(() => {
    const saved = localStorage.getItem('erp_scale_mode');
    return saved || 'SMALL';
  });

  useEffect(() => {
    localStorage.setItem('erp_scale_mode', scaleMode);
  }, [scaleMode]);

  const toggleScaleMode = () => {
    setScaleMode(prev => prev === 'SMALL' ? 'LARGE' : 'SMALL');
  };

  return (
    <ScaleModeContext.Provider value={{ scaleMode, setScaleMode, toggleScaleMode }}>
      {children}
    </ScaleModeContext.Provider>
  );
}

export function useScaleMode() {
  const context = useContext(ScaleModeContext);
  if (!context) {
    throw new Error('useScaleMode must be used within a ScaleModeProvider');
  }
  return context;
}
