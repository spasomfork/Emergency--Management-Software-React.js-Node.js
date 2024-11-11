import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    Title: '',
    Description: '',
    Status: 'InProgress', // Default status
    AssignedTo: '',
    DueDate: ''
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tasks', task);
      alert('Task created successfully');
      navigate('/task-management', { state: { username } });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="container mt-4"style={{ maxWidth: '80%' }}>
      <h2 className="mb-4">Create Task</h2>
      <form onSubmit={handleCreate} className="row justify-content-center">
        <div className="mb-3 col-md-6">
          <label htmlFor="taskTitle" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="taskTitle"
            value={task.Title}
            onChange={(e) => setTask({ ...task, Title: e.target.value })}
            pattern="^[A-Z][a-zA-Z\s]{1,24}$" // First letter capital, 2-25 characters, multiple words
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="taskDescription" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="taskDescription"
            value={task.Description}
            onChange={(e) => setTask({ ...task, Description: e.target.value })}
            pattern="^[A-Z][a-zA-Z\s]{1,24}$" // First letter capital, 2-25 characters, multiple words
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="taskAssignedTo" className="form-label">Assigned To</label>
          <input
            type="text"
            className="form-control"
            id="taskAssignedTo"
            value={task.AssignedTo}
            onChange={(e) => setTask({ ...task, AssignedTo: e.target.value })}
            pattern="^[A-Z][a-zA-Z\s]{1,24}$" // First letter capital, 2-25 characters, multiple words
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="taskDueDate" className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            id="taskDueDate"
            value={task.DueDate}
            onChange={(e) => setTask({ ...task, DueDate: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <Button type="submit" variant="primary" className="w-100">Create Task</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
