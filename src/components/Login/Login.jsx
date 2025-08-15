import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    // Simulación de autenticación (reemplazar por llamada real al backend)
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
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="show-hide"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
