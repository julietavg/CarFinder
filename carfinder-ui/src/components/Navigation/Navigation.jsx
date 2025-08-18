import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import "../../styles/components/Navigation.css";
import logo from '../../assets/CarFinderLogo_white.png';

const Navigation = ({ onSearch = () => {}, onAddVehicle = () => {}, onShowSaved = () => {}, onBrowse = () => {}, showSaved = false, onLogout = () => {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop dropdown
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // mobile search
  const [accountOpen, setAccountOpen] = useState(false); // mobile account

  const toggleSearch = () => {
    setMobileSearchOpen(prev => {
      const next = !prev;
      if (next) setAccountOpen(false);
      return next;
    });
  };
  const toggleAccount = () => {
    setAccountOpen(prev => {
      const next = !prev;
      if (next) setMobileSearchOpen(false);
      return next;
    });
  };
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const navLinksRef = useRef(null);

  // Menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Cerrar menú móvil al cambiar tamaño a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 780 && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
  setMobileSearchOpen(false);
  setAccountOpen(false);
  setUserMenuOpen(false);
    }
    return () => document.body.classList.remove('no-scroll');
  }, [mobileMenuOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
  setUserMenuOpen(false);
  setAccountOpen(false);
  setMobileSearchOpen(false);
        if (showSearch) handleCloseSearch();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showSearch]);

  // Cerrar si se hace click fuera del panel de links en modo móvil
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && navLinksRef.current && !navLinksRef.current.contains(e.target)) {
        // Si el click no es el botón hamburguesa
  if (!e.target.closest?.('.hamburger-btn')) {
          setMobileMenuOpen(false);
          setMobileSearchOpen(false);
          setAccountOpen(false);
          setUserMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

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

        <div
          id="primary-navigation"
          ref={navLinksRef}
          className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
        >
          <div className="mobile-menu-inner">
            <div className="menu-scroll glass-block">
              {/* Search (collapsible) */}
              <div className={`collapsible-wrapper ${mobileSearchOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className={`nav-link menu-item collapsible ${mobileSearchOpen ? 'open' : ''}`}
                  onClick={toggleSearch}
                  aria-expanded={mobileSearchOpen}
                >
                  <svg className="nav-item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span>Search vehicles</span>
                  <span className="caret" />
                </button>
                <div className="menu-item-panel-wrapper">
                  <div className="menu-item-panel">
                    <form onSubmit={(e)=>{ handleSearch(e); setMobileMenuOpen(false); setMobileSearchOpen(false); }}>
                      <div className="panel-row">
                        <input
                          type="text"
                          ref={searchInputRef}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Type to search..."
                          className="panel-input"
                        />
                        <button type="submit" className="panel-action" aria-label="Buscar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* Browse */}
              <button
                className={`nav-link menu-item ${!showSaved ? 'active' : ''}`}
                type="button"
                onClick={() => { onBrowse(); setMobileMenuOpen(false); }}
              >
                <svg className="nav-item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                Browse
              </button>
              {/* Saved */}
              <button
                className={`nav-link menu-item ${showSaved ? 'active' : ''}`}
                type="button"
                onClick={() => { onShowSaved(); setMobileMenuOpen(false); }}
              >
                <svg className="nav-item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
                Saved Cars
              </button>
              {/* Add */}
              <button className="nav-link menu-item add-link" type="button" onClick={() => { onAddVehicle(); setMobileMenuOpen(false); }}>
                <svg className="nav-item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add new vehicle
              </button>
              {/* Account (collapsible) */}
        <div className={`collapsible-wrapper ${accountOpen ? 'open' : ''}`}>
                <button
                  type="button"
          className={`nav-link menu-item collapsible ${accountOpen ? 'open' : ''}`}
                  onClick={toggleAccount}
          aria-expanded={accountOpen}
                >
                  <svg className="nav-item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                  <span>Account</span>
                  <span className="caret" />
                </button>
                <div className="menu-item-panel-wrapper">
                  <div className="menu-item-panel">
                    <button className="panel-action wide" type="button" onClick={() => { setAccountOpen(false); onLogout(); setMobileMenuOpen(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

          <button
            type="button"
            className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>
    {mobileMenuOpen && <div className="nav-overlay" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />}
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