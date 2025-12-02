// Import polyfills first to make Buffer and process available globally
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.mui';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
