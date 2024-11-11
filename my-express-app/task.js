const express = require('express');
const axios = require('axios');

module.exports = (db) => {
  const router = express.Router();

  // Send a notification when a task is created, updated, or deleted
  const sendNotification = async (message) => {
    try {
      await axios.post('http://localhost:5000/notifications', {
        message,  // Only send message
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Get all tasks
  router.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM task';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({ message: 'Failed to retrieve tasks' });
      }
      res.json(results);
    });
  });

  // Get a task by ID
  router.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM task WHERE TaskID = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching task:', err);
        return res.status(500).json({ message: 'Failed to retrieve task' });
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    });
  });

  // Create a new task
  router.post('/tasks', (req, res) => {
    const { Title, Description, Status, AssignedTo, DueDate } = req.body;

    // Validate required fields
    if (!Title || !Description || !Status || !AssignedTo || !DueDate) {
      return res.status(400).json({ message: 'Please provide all required fields: Title, Description, Status, AssignedTo, and DueDate' });
    }

    const query = 'INSERT INTO task (Title, Description, Status, AssignedTo, DueDate) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Title, Description, Status, AssignedTo, DueDate], (err, results) => {
      if (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({ message: 'Failed to create task' });
      }
      // Send notification on successful creation
      sendNotification('A new task has been created');
      res.status(201).json({ message: 'Task created successfully', TaskID: results.insertId });
    });
  });

  // Update the status of a task by ID
  router.put('/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    // Validate required field
    if (!Status) {
      return res.status(400).json({ message: 'Please provide the status' });
    }

    const query = 'UPDATE task SET Status = ? WHERE TaskID = ?';
    db.query(query, [Status, id], (err, results) => {
      if (err) {
        console.error('Error updating task status:', err);
        return res.status(500).json({ message: 'Failed to update task status' });
      }
      if (results.affectedRows > 0) {
        // Send notification on successful update
        sendNotification(`Task ID ${id} status updated to ${Status}`);
        res.json({ message: 'Task status updated successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    });
  });

  // Delete a task by ID
  router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM task WHERE TaskID = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({ message: 'Failed to delete task' });
      }
      if (results.affectedRows > 0) {
        // Send notification on successful deletion
        sendNotification(`Task ID ${id} has been deleted`);
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    });
  });

  return router;
};
