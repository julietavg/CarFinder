import { useState } from 'react';
import './App.css';
import Login from './components/Login/Login';
import VehicleList from './components/vehicle-list/VehicleList';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransitionProvider } from './contexts/PageTransitionContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mostrar login al inicio
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <ThemeProvider>
      <PageTransitionProvider>
  {isLoggedIn ? <VehicleList onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
      </PageTransitionProvider>
    </ThemeProvider>
  );
}

export default App;