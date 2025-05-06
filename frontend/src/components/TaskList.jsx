import React, { useState, useEffect } from 'react'
import { mockDataService } from '../utils/mockData'
import './TaskList.css'

export default function TaskList({ refreshKey }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await mockDataService.tasks.getAll()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
    setLoading(false)
  }

  const deleteTask = async (taskId) => {
    try {
      await mockDataService.tasks.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  useEffect(() => {
    fetchTasks()
  }, [refreshKey])

  if (loading) return <p className="loading">Loading tasks…</p>

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-meta">
                Due: {new Date(task.due_date).toLocaleString()}
                <br />
                Assigned to: {task.user || '—'}
              </p>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
              <button onClick={() => deleteTask(task.id)} className="btn secondary">
                Remove Task
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
