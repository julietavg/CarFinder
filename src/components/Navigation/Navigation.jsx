import { useState } from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Assets from '../../assets';
import './Navigation.css';

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo-container">
          <img src={Assets.logo} alt="CarFinder Logo" className="logo" />
          <h1 className="app-title">CarFinder</h1>
        </div>

        <form onSubmit={handleSearch} className="search-container" style={{ margin: '0 20px', minWidth: '300px' }}>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '8px 35px 8px 15px',
              borderRadius: '20px',
              border: '1px solid #ccc'
            }}
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Search"
          >
            <img src={Assets.icons.search} alt="" style={{ width: '16px', height: '16px' }} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={Assets.icons.user} alt="" style={{ width: '20px', height: '20px' }} />
            <span>Julia Smith</span>
          </div>
          <ThemeToggle />
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
      </div>
    </nav>
  );
};

export default Navigation;
