import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import "../../styles/components/Navigation.css";
import logo from '../../assets/CarFinderLogo_white.png';

const Navigation = ({ onSearch = () => {}, onAddVehicle = () => {}, onShowSaved = () => {}, onBrowse = () => {}, showSaved = false, onLogout = () => {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  
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
  
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Cerrar menú usuario click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    console.log('Searching:', searchQuery);
    
    window.sessionStorage.setItem('carfinder-search', searchQuery.trim());
    onSearch(searchQuery.trim());
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
          <button
            className={`nav-link ${!showSaved ? 'active' : ''}`}
            type="button"
            onClick={onBrowse}
          >Browse</button>
          <button
            className={`nav-link ${showSaved ? 'active' : ''}`}
            type="button"
            onClick={onShowSaved}
          >Saved Cars</button>
          <button className="nav-link add-link" type="button" onClick={() => onAddVehicle()}> Add new vehicle</button>
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
                  placeholder="Searching for vehicles..."
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
          
          <div className="user-profile" ref={userMenuRef}>
            <button type="button" className={`user-trigger ${userMenuOpen ? 'open' : ''}`} onClick={() => setUserMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={userMenuOpen}>
              <div className="user-avatar">AD</div>
              <span className="user-name">Admin</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                <button className="dropdown-item" role="menuitem" onClick={() => { setUserMenuOpen(false); onLogout(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

Navigation.propTypes = {
  onSearch: PropTypes.func,
  onAddVehicle: PropTypes.func,
  onShowSaved: PropTypes.func,
  onBrowse: PropTypes.func,
  showSaved: PropTypes.bool,
  onLogout: PropTypes.func
};
