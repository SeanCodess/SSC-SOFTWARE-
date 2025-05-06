// src/components/TaskForm.jsx
import React, { useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './TaskForm.css'
import { mockDataService } from '../utils/mockData';

export default function TaskForm({ events, onCreated }) {
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [eventId, setEventId]       = useState('')
  const [dueDate, setDueDate]       = useState(new Date())
  const [error, setError]           = useState('')

  const submit = async e => {
    e.preventDefault()
    try {
      await mockDataService.tasks.create({
        title,
        description,
        event: eventId || null,
        due_date: dueDate,
      });
      // reset form
      setTitle('')
      setDescription('')
      setEventId('')
      setDueDate(new Date())
      setError('')
      onCreated()
    } catch (err) {
      setError('Could not create task')
    }
  }

  return (
    <form onSubmit={submit} className="task-form">
      <h2>Create Task</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Attach to Event</label>
        <select
          value={eventId}
          onChange={e => setEventId(e.target.value)}
        >
          <option value="">— No Event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Due Date &amp; Time</label>
        <DatePicker
          selected={dueDate}
          onChange={setDueDate}
          showTimeSelect
          dateFormat="Pp"
          required
        />
      </div>

      <div className="button-row">
        <button type="submit" className="btn primary">
          ➕ Add Task
        </button>
      </div>
    </form>
  )
}
