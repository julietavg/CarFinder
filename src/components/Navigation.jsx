import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/Navigation.css';
import logo from '../assets/CarFinderLogo_white.png';

const Navigation = ({ onSearch = () => {}, onAddVehicle = () => {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Efecto para enfocar el campo de búsqueda cuando se muestra
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    console.log('Searching:', searchQuery);
    
    // Redirigir a la página principal con el parámetro de búsqueda
    // En una aplicación real podríamos usar React Router
    window.sessionStorage.setItem('carfinder-search', searchQuery.trim());
    onSearch(searchQuery.trim()); // comunicar directamente al padre
    
    // Ocultar la barra de búsqueda después de realizar la búsqueda
    setShowSearch(false);
  };
  
  // Función para cerrar la búsqueda
  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
    onSearch('');
  };
  
  return (
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo-container">
          <img src={logo} alt="CarFinder Logo" className="nav-logo" />
        </div>
        
        <div className="nav-links">
          <button className="nav-link active" type="button">Browse</button>
          <button className="nav-link" type="button">Saved Cars</button>
          <button className="nav-link add-link" type="button" onClick={() => onAddVehicle()}>Add Vehicle</button>
        </div>
        
        <div className="nav-right">
          {showSearch ? (
            <div className="search-bar">
              <form onSubmit={handleSearch} className="search-inline">
                <button type="submit" className="icon-btn" aria-label="Buscar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                <button type="button" className="icon-btn" onClick={handleCloseSearch} aria-label="Cerrar búsqueda">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vehículos..."
                  className="search-input inline"
                />
              </form>
            </div>
          ) : (
            <button className="search-icon" onClick={() => {
              setShowSearch(true);
              setTimeout(() => searchInputRef.current?.focus(), 20);
            }} aria-label="Open search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}
          
          <div className="user-profile">
            <div className="user-avatar">JS</div>
            <span className="user-name">Julia Smith</span>
          </div>
        </div>
      </div>
      
  {/* Menú móvil eliminado */}
    </nav>
  );
};

export default Navigation;
