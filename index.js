import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This finds the <div id="root"> in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// This renders your <App /> component inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);