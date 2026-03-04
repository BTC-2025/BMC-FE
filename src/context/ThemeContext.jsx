import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  CLASSIC: 'classic', // The current dark elegant theme (Default)
  SUNSET: 'sunset', // Warm oranges, purples, gradients
  FUNKY: 'funky', // Neon contrast, wild colors
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false); // Default to Light Mode as requested
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(THEMES.CLASSIC);

  useEffect(() => {
    // Apply theme classes to body/html
    const root = document.documentElement;
    
    // Reset classes
    root.classList.remove('theme-sunset', 'theme-funky', 'theme-classic');
    
    // Apply current theme
    root.classList.add(`theme-${currentTheme}`);
    
    // Apply dark mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

  }, [darkMode, currentTheme]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const changeTheme = (theme) => setCurrentTheme(theme);

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      notificationsEnabled,
      toggleNotifications,
      currentTheme,
      changeTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
