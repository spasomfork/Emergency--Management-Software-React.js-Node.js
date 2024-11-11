const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Get all notifications
    router.get('/notifications/get', (req, res) => {
        const query = 'SELECT * FROM notification';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching notifications:', err);
                return res.status(500).json({ message: 'Failed to retrieve notifications' });
            }
            res.json(results);
        });
    });

    // Get a notification by ID
    router.get('/notifications/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM notification WHERE notification_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching notification:', err);
                return res.status(500).json({ message: 'Failed to retrieve notification' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        });
    });

    // Create a notification
    router.post('/notifications', (req, res) => {
        const { message, created_at } = req.body;
        const query = `
            INSERT INTO notification (message, created_at)
            VALUES (?, NOW())
        `;
        db.query(query, [message], (err, results) => {
            if (err) {
                console.error('Error creating notification:', err.sqlMessage || err);
                return res.status(500).json({ message: 'Failed to create notification' });
            }
            res.status(201).json({ message: 'Notification created successfully', notificationId: results.insertId });
        });
    });

    // Update a notification
    router.put('/notifications/:id', (req, res) => {
        const { id } = req.params;
        const { message, created_at } = req.body;
        const query = `
            UPDATE notification 
            SET message = ?, created_at = ?
            WHERE notification_id = ?
        `;
        db.query(query, [message, created_at, id], (err, results) => {
            if (err) {
                console.error('Error updating notification:', err);
                return res.status(500).json({ message: 'Failed to update notification' });
            }
            if (results.affectedRows > 0) {
                res.json({ message: 'Notification updated successfully' });
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        });
    });

    // Delete a notification
    router.delete('/notifications/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM notification WHERE notification_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting notification:', err);
                return res.status(500).json({ message: 'Failed to delete notification' });
            }
            if (results.affectedRows > 0) {
                res.json({ message: 'Notification deleted successfully' });
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        });
    });

    return router;
};
