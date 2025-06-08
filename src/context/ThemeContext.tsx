import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available themes
export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Define themes directly in the context
const availableThemes: ThemeType[] = ['light', 'dark'];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme');
    return saved && availableThemes.includes(saved as ThemeType) ? saved as ThemeType : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeType) => {
    if (availableThemes.includes(theme)) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 