import { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Verifica si hay un tema guardado en localStorage, si no, usa el tema oscuro por defecto
  // Siempre usar tema oscuro
  const [theme] = useState('dark');

  // Establece el tema oscuro
  useEffect(() => {
    localStorage.setItem('carfinder-theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Función vacía para mantener compatibilidad
  const toggleTheme = () => {
    // No hace nada, siempre tema oscuro
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => useContext(ThemeContext);
