import React, { useState, useEffect } from 'react'
import './ChatWidget.css'

export default function ChatWidget({ roomName = 'general' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('mockMessages') || '[]')
    setMessages(savedMessages.filter(m => m.roomName === roomName))
  }, [roomName])

  const sendMessage = () => {
    if (!input.trim()) return

    const newMessage = {
      id: Date.now(),
      roomName,
      user: localStorage.getItem('mockUser') || 'Anonymous',
      content: input,
      timestamp: new Date().toISOString()
    }

    const allMessages = JSON.parse(localStorage.getItem('mockMessages') || '[]')
    allMessages.push(newMessage)
    localStorage.setItem('mockMessages', JSON.stringify(allMessages))
    
    setMessages(prev => [...prev, newMessage])
    setInput('')
  }

  return (
    <div className="chat-widget">
      <h2 className="chat-header">Chat: {roomName}</h2>

      <div className="chat-frame">
        {messages.map(m => (
          <div key={m.id} className="chat-message">
            <span className="chat-user">{m.user}:</span>
            <span className="chat-text">{m.content}</span>
            <span className="chat-timestamp">
              {new Date(m.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-controls">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message…"
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}
