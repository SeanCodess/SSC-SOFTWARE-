// src/App.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Login      from './components/Login'
import EventForm  from './components/EventForm'
import EventList  from './components/EventList'
import TaskForm   from './components/TaskForm'
import TaskList   from './components/TaskList'
import ChatWidget from './components/ChatWidget'

import SSCLogo from './assets/ssc-logo.png'
import UPHLogo from './assets/uph-logo.png'

import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('mockUser'));
  const [refreshKey, setRefreshKey] = useState(0);
  const [events, setEvents] = useState([]);

  // Mock data instead of API calls
  useEffect(() => {
    if (loggedIn) {
      // Load mock events from localStorage or use defaults
      const savedEvents = localStorage.getItem('mockEvents');
      setEvents(savedEvents ? JSON.parse(savedEvents) : []);
    }
  }, [loggedIn, refreshKey]);

  const handleCreated = async () => {
    setRefreshKey(k => k + 1);
    const savedEvents = localStorage.getItem('mockEvents');
    setEvents(savedEvents ? JSON.parse(savedEvents) : []);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="container">
        <Login onSuccess={() => setLoggedIn(true)} />
      </div>
    )
  }

  // main dashboard
  return (
    <div className="container">
      <header className="dashboard-header">
        <div className="logo-row">
          <img src={SSCLogo} alt="SSC Logo" className="logo" />
          <img src={UPHLogo} alt="UPH Logo" className="logo" />
        </div>
        <h1 className="app-title">SSC Management Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {/* Event creation */}
      <div className="tile green">
        <EventForm onCreated={handleCreated} />
      </div>
      <div className="hr" />

      {/* Task creation (pass events for the dropdown) */}
      <div className="tile green">
        <TaskForm events={events} onCreated={handleCreated} />
      </div>
      <div className="hr" />

      {/* Event list (auto-refresh) */}
      <div className="tile blue">
        {/* Changed to pass events prop instead of refreshKey */}
        <EventList events={events} />
      </div>
      <div className="hr" />

      {/* Task list (auto-refresh & ticking) */}
      <div className="tile yellow">
        <TaskList refreshKey={refreshKey} />
      </div>
      <div className="hr" />

      {/* Chat widget */}
      <div className="tile blue">
        <ChatWidget roomName="general" />
      </div>
    </div>
  )
}

export default App
