import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#111820',
            color: '#e8edf3',
            border: '1px solid #1e2d3d',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '10px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
