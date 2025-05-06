import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/csrf';

import SSCLogo from '../assets/ssc-logo.png';
import UPHLogo from '../assets/uph-logo.png';

import './Login.css';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // Mock login - accept any non-empty username/password
    if (username.trim() && password.trim()) {
      localStorage.setItem('mockUser', username);
      onSuccess();
    } else {
      setError('Please enter username and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo-row">
          <img src={SSCLogo} alt="SSC Logo" className="logo" />
          <img src={UPHLogo} alt="UPH Logo" className="logo" />
        </div>
        <h2 className="login-title">
          SUPREME STUDENT COUNCIL<br/>
          TEAM COORDINATION MANAGEMENT
        </h2>
      </div>

      <form onSubmit={submit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
