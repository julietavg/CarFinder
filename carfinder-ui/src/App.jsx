import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Login from './components/Login/Login';
import VehicleList from './components/vehicle-list/VehicleList';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransitionProvider } from './contexts/PageTransitionContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
axios.defaults.baseURL = API_BASE;

console.log('[API_BASE]', axios.defaults.baseURL);

// Attach Basic Auth from localStorage once
if (!window.__axiosAuthAttached) {
  axios.interceptors.request.use((cfg) => {
    const basicAuth = localStorage.getItem('basicAuth');
    if (basicAuth) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Basic ${basicAuth}`;
    }
    return cfg;
  });
  window.__axiosAuthAttached = true;
}

function App() {
  // Keep session with role info
  const [session, setSession] = useState({
    isLoggedIn: !!localStorage.getItem('basicAuth'),
    isAdmin: false,
    username: null
  });
  const [authError, setAuthError] = useState(null);
  const [checking, setChecking] = useState(false);

  // Helper to compute admin flag from /auth/me response
  const computeIsAdmin = (roles) => {
    const set = Array.isArray(roles) ? roles : [...(roles || [])];
    return set.includes('ROLE_ADMIN') || set.includes('ADMIN');
  };

  // On mount: if token exists, verify and fetch roles
  useEffect(() => {
    const token = localStorage.getItem('basicAuth');
    if (!token) return;

    (async () => {
      setChecking(true);
      try {
        // Validate credentials
        await axios.get('/cars');
        // Fetch identity & roles
        const me = await axios.get('/auth/me');
        const isAdmin = computeIsAdmin(me.data?.roles);
        setSession({
          isLoggedIn: true,
          isAdmin,
          username: me.data?.username ?? null
        });
      } catch {
        localStorage.removeItem('basicAuth');
        setSession({ isLoggedIn: false, isAdmin: false, username: null });
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Login handler expects { username, password }
  const handleLogin = async ({ username, password }) => {
    setChecking(true);
    setAuthError(null);
    const token = btoa(`${username}:${password}`);
    try {
      // Validate
      await axios.get('/cars', { headers: { Authorization: `Basic ${token}` } });
      localStorage.setItem('basicAuth', token);
      // Who am I?
      const me = await axios.get('/auth/me', { headers: { Authorization: `Basic ${token}` } });
      const isAdmin = computeIsAdmin(me.data?.roles);
      setSession({ isLoggedIn: true, isAdmin, username: me.data?.username ?? null });
    } catch (err) {
      if (!err.response) {
        setAuthError('Cannot reach API. Check VITE_API_BASE and CORS on backend.');
        console.error('[Login] Network/CORS error', err);
      } else if (err.response.status === 401) {
        setAuthError('Invalid username or password.');
      } else {
        setAuthError(`Login failed (HTTP ${err.response.status}).`);
      }
      localStorage.removeItem('basicAuth');
      setSession({ isLoggedIn: false, isAdmin: false, username: null });
      throw err;
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('basicAuth');
    setSession({ isLoggedIn: false, isAdmin: false, username: null });
    setAuthError(null);
  };

  return (
    <ThemeProvider>
      <PageTransitionProvider>
        {checking && <div className="loading">Loading…</div>}
        {session.isLoggedIn
        ? (
            <VehicleList
              onLogout={handleLogout}
              isAdmin={session.isAdmin}
              username={session.user}
            />
          )
        : <Login onLogin={handleLogin} error={authError} />}

      </PageTransitionProvider>
    </ThemeProvider>
  );
}

export default App;
