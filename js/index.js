import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CSS 파일들 import
import './css/reset.css';
import './css/global.css';
import './css/pages/index.css';
import './css/pages/market.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);