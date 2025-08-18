import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import "../../styles/components/Navigation.css";
import logo from '../../assets/CarFinderLogo_white.png';

const Navigation = ({
  onSearch = () => {},
  onAddVehicle = () => {},
  onShowSaved = () => {},
  onBrowse = () => {},
  showSaved = false,
  onLogout = () => {},
  isAdmin = false,
  username = null
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const displayName = username || (isAdmin ? 'Admin' : 'User');
  const initialsFrom = (name) => {
    if (!name) return 'US';
    const base = name.includes('@') ? name.split('@')[0] : name;
    const parts = base.trim().split(/\s+/);
    if (parts.length === 1) {
      const p = parts[0];
      return (p[0] || 'U').toUpperCase() + (p[1] ? p[1].toUpperCase() : '');
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const initials = initialsFrom(displayName);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    window.sessionStorage.setItem('carfinder-search', searchQuery.trim());
    onSearch(searchQuery.trim());
    setShowSearch(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    window.sessionStorage.removeItem('carfinder-search');
    onSearch('');
  };

  // >>> Nuevo: ir a “Home” al click en el logo
  const handleLogoHome = () => {
    // Limpia búsqueda activa
    setShowSearch(false);
    if (searchQuery) {
      setSearchQuery('');
      window.sessionStorage.removeItem('carfinder-search');
      onSearch('');
    }
    // Cambia a vista Browse (quita “Saved” si estaba activo)
    onBrowse();
    // Scroll al tope
    try {
      (document.scrollingElement || document.documentElement).scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogoHome();
    }
  };

  return (
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo -> Home */}
        <div
          className="logo-container"
          onClick={handleLogoHome}
          onKeyDown={handleLogoKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Go to home"
          title="Home"
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="CarFinder Logo" className="nav-logo" />
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${!showSaved ? 'active' : ''}`}
            type="button"
            onClick={onBrowse}
            title="Browse inventory"
          >
            Browse
          </button>

          <button
            className={`nav-link ${showSaved ? 'active' : ''}`}
            type="button"
            onClick={onShowSaved}
            title="Saved cars"
          >
            Saved Cars
          </button>

          {/* Solo Admin */}
          {isAdmin && typeof onAddVehicle === 'function' && (
            <button
              className="nav-link add-link"
              type="button"
              onClick={() => onAddVehicle()}
              title="Add new vehicle"
            >
              Add new vehicle
            </button>
          )}
        </div>

        <div className="nav-right">
          {showSearch ? (
            <div className="search-bar">
              <form onSubmit={handleSearch} className="search-inline">
                <button type="submit" className="icon-btn" aria-label="Search">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                <button type="button" className="icon-btn" onClick={handleCloseSearch} aria-label="Close search">
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
            <button
              className="search-icon"
              onClick={() => {
                setShowSearch(true);
                setTimeout(() => searchInputRef.current?.focus(), 20);
              }}
              aria-label="Open search"
              title="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}

          <div className="user-profile" ref={userMenuRef}>
            <button
              type="button"
              className={`user-trigger ${userMenuOpen ? 'open' : ''}`}
              onClick={() => setUserMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              title={displayName}
            >
              <div className="user-avatar">{initials}</div>
              <span className="user-name">{displayName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="user-dropdown" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => { setUserMenuOpen(false); onLogout(); }}
                >
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
  onLogout: PropTypes.func,
  isAdmin: PropTypes.bool,
  username: PropTypes.string
};
