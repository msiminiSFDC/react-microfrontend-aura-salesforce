import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Agora aceita 'route' como segundo parâmetro
window.mountReactApp = (elementId, route) => {
  const el = document.getElementById(elementId);
  if (el) {
    // Se já houver algo montado, desmonta para evitar duplicação em re-renders do Aura
    const root = ReactDOM.createRoot(el);
    root.render(
      <React.StrictMode>
        <App initialRoute={route} />
      </React.StrictMode>,
    );
  }
};