import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
// Importamos el logo para usarlo como favicon dinámicamente
import carFinderFavicon from './assets/CarFinderLogo_black.png';

// Establecer favicon (y reemplazar si ya existe)
(() => {
  try {
    const head = document.head;
    const existing = head.querySelector("link[rel='icon']");
    const link = existing || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = carFinderFavicon;
    if (!existing) head.appendChild(link);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo establecer el favicon:', e);
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();