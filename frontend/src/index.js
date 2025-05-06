import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';                // ← import axios
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Basic axios setup
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Simple error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode><App /></React.StrictMode>
);
reportWebVitals(console.log);
