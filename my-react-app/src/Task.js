import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        setTasks(tasks.filter(task => task.TaskID !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (id, isChecked) => {
    const newStatus = isChecked ? 'Complete' : 'InProgress';
    try {
      // Update the API endpoint to match the backend route
      await axios.put(`http://localhost:5000/tasks/${id}/status`, { Status: newStatus });
      setTasks(tasks.map(task => task.TaskID === id ? { ...task, Status: newStatus } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const handleCreate = () => {
    navigate('/create-task');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task Management</h2>
        <Button variant="success" onClick={handleCreate}>Add New Task</Button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Actions</th>
            <th>Mark Complete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.TaskID}>
              <td>{task.TaskID}</td>
              <td>{task.Title}</td>
              <td>{task.Description}</td>
              <td>{task.Status}</td>
              <td>{task.AssignedTo}</td>
              <td>{task.DueDate}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(task.TaskID)}>Delete</Button>
              </td>
              <td>
                <Form.Check 
                  type="checkbox"
                  checked={task.Status === 'Complete'}
                  onChange={(e) => handleStatusChange(task.TaskID, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagement;
