import React, { useState, useEffect } from 'react';
import '../styles/components/Login.css';
import logo from '../assets/CarFinderLogo.png';

const Login = ({ onLogin }) => {
  // Efecto de animación al cargar
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    // Aquí irá la llamada real al backend
    setTimeout(() => {
      setLoading(false);
      if (username === 'admin' && password === 'admin123') {
        onLogin && onLogin();
      } else {
        setError('Invalid username or password.');
      }
    }, 1200);
  };

  return (
    <div className="login-bg">
      <div className="login-header">
        <img src={logo} alt="CarFinder Logo" className="login-logo" />
      </div>
      <div className="login-container">
        <div className="login-box">
          <h2>Sign in</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="user@mail.com"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="userpassword4567"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
