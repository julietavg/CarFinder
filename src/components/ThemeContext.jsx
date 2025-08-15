import React, { createContext, useState, useEffect } from 'react';

// Create a context for the theme
export const ThemeContext = createContext();

// Theme provider component
const ThemeProvider = ({ children }) => {
  // Try to get the theme from localStorage, or use 'dark' as default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('carfinder-theme');
    // Check if the user has a system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return savedTheme;
  });

  // Apply the theme to the document element when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Set a specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
