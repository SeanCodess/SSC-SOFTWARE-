// src/components/EventForm.jsx
import React, { useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './EventForm.css'
import { mockDataService } from '../utils/mockData';

export default function EventForm({ onCreated }) {
  const [title, setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart]       = useState(new Date())
  const [end, setEnd]           = useState(new Date(Date.now() + 3600*1000))
  const [tasks, setTasks]       = useState([{ title: '', dueDate: new Date() }])
  const [error, setError]       = useState('')

  const addTaskRow = () =>
    setTasks([...tasks, { title: '', dueDate: new Date() }])

  const updateTask = (idx, key, val) => {
    const updated = [...tasks]
    updated[idx][key] = val
    setTasks(updated)
  }

  const submit = async e => {
    e.preventDefault();
    try {
      await mockDataService.events.create({
        title,
        description,
        start,
        end
      });
      // Reset form
      setTitle('');
      setDescription('');
      setStart(new Date());
      setEnd(new Date(Date.now() + 3600*1000));
      setError('');
      onCreated(); // Ensure this is called
    } catch (err) {
      setError('Could not create event');
    }
  };

  return (
    <form onSubmit={submit} className="event-form">
      <h2>New Event</h2>
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
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Start</label>
        <DatePicker
          selected={start}
          onChange={setStart}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>

      <div className="form-group">
        <label>End</label>
        <DatePicker
          selected={end}
          onChange={setEnd}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>

      <h3>Tasks for this event</h3>
      {tasks.map((t, i) => (
        <div key={i} className="task-row">
          <div className="form-group task-group">
            <label>Task Title</label>
            <input
              type="text"
              value={t.title}
              onChange={e => updateTask(i, 'title', e.target.value)}
              required
            />
          </div>
          <div className="form-group task-group">
            <label>Due Date</label>
            <DatePicker
              selected={t.dueDate}
              onChange={d => updateTask(i, 'dueDate', d)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>
        </div>
      ))}

      <div className="button-row">
        <button type="button" onClick={addTaskRow} className="btn secondary">
          + Add Task
        </button>
        <button type="submit" className="btn primary">
          Create Event
        </button>
      </div>
    </form>
  )
}
