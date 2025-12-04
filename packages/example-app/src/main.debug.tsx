import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import MinimalApp from './App.minimal';
import './styles/index.css';

console.log('main.tsx is executing');
console.log('Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<h1 style="color: red; padding: 50px;">Error: Root element not found!</h1>';
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <MinimalApp />
    </React.StrictMode>
  );
  console.log('React rendered successfully');
} catch (error) {
  console.error('Rendering error:', error);
  document.body.innerHTML = `<h1 style="color: red; padding: 50px;">Rendering Error: ${error}</h1>`;
}
