/**
 * ============================================
 * Theme Context - Light/Dark Mode Management
 * ============================================
 * 
 * Provides theme switching functionality across the app.
 * Persists theme preference in localStorage.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('edusync-theme') as Theme;
      const resolved: Theme = stored
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';

      // Apply immediately — before first render — so Tailwind dark: CSS selectors
      // and the isDark boolean are in sync from frame 0 (prevents mixed theming).
      window.document.documentElement.classList.remove('light', 'dark');
      window.document.documentElement.classList.add(resolved);
      return resolved;
    }
    return 'dark'; // Default to dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('edusync-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem('edusync-theme');
      // Only auto-switch if user hasn't manually set a preference
      if (!storedTheme) {
        setThemeState(e.matches ? 'light' : 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
