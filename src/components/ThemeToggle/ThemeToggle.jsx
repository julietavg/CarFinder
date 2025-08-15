import { useState, useEffect } from 'react';
import '../styles/components/ThemeToggle.css';

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const theme = isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
    >
      {isDarkTheme ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
