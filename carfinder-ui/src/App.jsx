import { useState } from 'react';
import './App.css';
import Login from './components/Login/Login';
import VehicleList from './components/vehicle-list/VehicleList';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransitionProvider } from './contexts/PageTransitionContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Solo mantener login en la sesión actual del navegador
    return sessionStorage.getItem('carfinder-logged-in') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('carfinder-logged-in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('carfinder-logged-in');
  };

  return (
    <ThemeProvider>
      <PageTransitionProvider>
  {isLoggedIn ? <VehicleList onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
      </PageTransitionProvider>
    </ThemeProvider>
  );
}

export default App;