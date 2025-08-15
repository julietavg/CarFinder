import { useState } from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Assets from '../../assets';
import '../styles/components/Navigation.css';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo-container">
          <img src={Assets.logo} alt="CarFinder Logo" className="logo" />
          <h1 className="app-title">CarFinder</h1>
        </div>

        <div className="mobile-nav">
          <ThemeToggle />
          <button 
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="menu-icon"></span>
          </button>
        </div>

        <ul className={`nav-links ${menuOpen ? 'menu-open' : ''}`}>
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#search" className="nav-link">Search Cars</a></li>
          <li><a href="#dealers" className="nav-link">Dealers</a></li>
          <li><a href="#about" className="nav-link">About Us</a></li>
          <li className="nav-button">
            <a href="#login" className="login-button">
              <img src={Assets.icons.user} alt="" className="icon" />{' '}
              Login
            </a>
          </li>
          <li className="theme-toggle-container desktop-only">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
