// Mock data storage using localStorage
export const mockDataService = {
  events: {
    getAll: () => {
      const events = localStorage.getItem('mockEvents');
      return Promise.resolve(events ? JSON.parse(events) : []);
    },
    create: (event) => {
      const events = JSON.parse(localStorage.getItem('mockEvents') || '[]');
      const newEvent = {
        ...event,
        id: Date.now(),
        organizer: localStorage.getItem('mockUser')
      };
      events.push(newEvent);
      localStorage.setItem('mockEvents', JSON.stringify(events));
      return Promise.resolve(newEvent);
    },
    delete: (eventId) => {
      const events = JSON.parse(localStorage.getItem('mockEvents') || '[]');
      const updatedEvents = events.filter(event => event.id !== eventId);
      localStorage.setItem('mockEvents', JSON.stringify(updatedEvents));
      return Promise.resolve();
    }
  },
  tasks: {
    getAll: () => {
      const tasks = localStorage.getItem('mockTasks');
      return Promise.resolve(tasks ? JSON.parse(tasks) : []);
    },
    create: (task) => {
      const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
      const newTask = {
        ...task,
        id: Date.now(),
        user: localStorage.getItem('mockUser')
      };
      tasks.push(newTask);
      localStorage.setItem('mockTasks', JSON.stringify(tasks));
      return Promise.resolve(newTask);
    },
    delete: (taskId) => {
      const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('mockTasks', JSON.stringify(updatedTasks));
      return Promise.resolve();
    }
  },
  messages: {
    getAll: (roomName) => {
      const messages = JSON.parse(localStorage.getItem('mockMessages') || '[]');
      return Promise.resolve(
        messages.filter(m => m.roomName === roomName)
      );
    },
    create: (message) => {
      const messages = JSON.parse(localStorage.getItem('mockMessages') || '[]');
      const newMessage = {
        ...message,
        id: Date.now(),
        user: localStorage.getItem('mockUser'),
        timestamp: new Date().toISOString()
      };
      messages.push(newMessage);
      localStorage.setItem('mockMessages', JSON.stringify(messages));
      return Promise.resolve(newMessage);
    }
  }
};
