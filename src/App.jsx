import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import VehicleList from './components/VehicleList';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransitionProvider } from './contexts/PageTransitionContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mostrar login al inicio
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider>
      <PageTransitionProvider>
        {isLoggedIn ? <VehicleList /> : <Login onLogin={handleLogin} />}
      </PageTransitionProvider>
    </ThemeProvider>
  );
}

export default App;
