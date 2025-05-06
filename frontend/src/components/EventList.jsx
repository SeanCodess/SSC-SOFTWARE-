// src/components/EventList.jsx
import React, { useState } from 'react'
import './EventList.css'
import { mockDataService } from '../utils/mockData';

export default function EventList({ events: initialEvents }) {
  const [events, setEvents] = useState(initialEvents);

  const deleteEvent = async (eventId) => {
    try {
      await mockDataService.events.delete(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p className="loading">No events to display.</p>
      ) : (
        <div className="event-grid">
          {events.map(e => (
            <div key={e.id} className="event-card">
              <h3 className="event-title">{e.title}</h3>
              <p className="event-time">
                {new Date(e.start).toLocaleString()}
                {e.end && <> → {new Date(e.end).toLocaleString()}</>}
              </p>
              {e.description && (
                <p className="event-desc">{e.description}</p>
              )}
              <button onClick={() => deleteEvent(e.id)} className="btn secondary">
                Remove Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
