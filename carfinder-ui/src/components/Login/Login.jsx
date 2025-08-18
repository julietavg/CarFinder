import React, { useState, useEffect } from 'react';
import '../../styles/components/Login.css';
import logo from '../../assets/CarFinderLogo.png';

const Login = ({ onLogin, error: externalError }) => {
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => { document.body.classList.remove('login-page'); };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If App.jsx provides an error prop, mirror it here
  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // IMPORTANT: pass credentials to App.jsx
      await onLogin?.({ username, password });
      // If credentials are wrong, onLogin will throw and we land in catch
    } catch {
      // App.jsx typically sets its own error; provide a fallback here
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
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
              placeholder="Email address"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="dots-spinner" aria-label="Cargando">
                  <span></span><span></span><span></span>
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
