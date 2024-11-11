const express = require('express');
const axios = require('axios');

module.exports = (db) => {
    const router = express.Router();

    // Send a notification when a resource is created, updated, or deleted
    const sendNotification = async (message) => {
        try {
            await axios.post('http://localhost:5000/notifications', {
                message,  // Only send message
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Get all resources
    router.get('/resources', (req, res) => {
        const query = 'SELECT * FROM resource';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching resources:', err);
                return res.status(500).json({ message: 'Failed to retrieve resources' });
            }
            res.json(results);
        });
    });

    // Get a resource by ID
    router.get('/resources/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM resource WHERE ResourceID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching resource:', err);
                return res.status(500).json({ message: 'Failed to retrieve resource' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        });
    });

    // Create a new resource
    router.post('/resources', (req, res) => {
        const { Name, Description, Quantity, Status } = req.body;

        // Validate required fields
        if (!Name || !Description || !Quantity || !Status) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Description, Quantity, and Status' });
        }

        const query = 'INSERT INTO resource (Name, Description, Quantity, Status) VALUES (?, ?, ?, ?)';
        db.query(query, [Name, Description, Quantity, Status], (err, results) => {
            if (err) {
                console.error('Error creating resource:', err);
                return res.status(500).json({ message: 'Failed to create resource' });
            }
            // Send notification on successful creation
            sendNotification('A new resource has been created');
            res.status(201).json({ message: 'Resource created successfully', ResourceID: results.insertId });
        });
    });

    // Update a resource by ID (only if Status is 'open')
    router.put('/resources/:id', (req, res) => {
        const { id } = req.params;
        const { Name, Description, Quantity, Status } = req.body;

        // Validate required fields
        if (!Name || !Description || !Quantity) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Description, and Quantity' });
        }

        // Only allow update if the resource status is 'open'
        const query = `
            UPDATE resource
            SET Name = ?, Description = ?, Quantity = ?
            WHERE ResourceID = ? AND Status = 'open';
        `;
        db.query(query, [Name, Description, Quantity, id], (err, results) => {
            if (err) {
                console.error('Error updating resource:', err);
                return res.status(500).json({ message: 'Failed to update resource' });
            }
            if (results.affectedRows === 0) {
                // No rows affected, meaning resource status is not 'open'
                return res.status(400).json({ message: 'Resource can only be updated when its status is open' });
            }
            // Send notification on successful update
            sendNotification(`Resource ID ${id} has been updated`);
            res.json({ message: 'Resource updated successfully' });
        });
    });

    // Change the status of a resource (must handle rules for specific statuses)
    router.put('/resources/:id/status', (req, res) => {
        const { id } = req.params;
        const { newStatus } = req.body;

        // Validate new status
        if (!['open', 'ongoing', 'completed', 'rejected'].includes(newStatus)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        // Handle status transitions logic
        const query = 'SELECT Status FROM resource WHERE ResourceID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching resource status:', err);
                return res.status(500).json({ message: 'Failed to fetch resource' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            const currentStatus = results[0].Status;

            // If status is 'completed', it can't be changed
            if (currentStatus === 'completed') {
                return res.status(400).json({ message: 'Resource status cannot be changed once it is completed' });
            }

            // If status is 'rejected', it can't be changed
            if (currentStatus === 'rejected') {
                return res.status(400).json({ message: 'Rejected resources cannot be edited' });
            }

            // If resource is 'open' and trying to transition to other states, allow the update
            const updateQuery = 'UPDATE resource SET Status = ? WHERE ResourceID = ?';
            db.query(updateQuery, [newStatus, id], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating resource status:', updateErr);
                    return res.status(500).json({ message: 'Failed to update resource status' });
                }
                // Send notification on successful status change
                sendNotification(`Resource ID ${id} status updated to ${newStatus}`);
                res.json({ message: 'Resource status updated successfully' });
            });
        });
    });

    // Delete a resource by ID
    router.delete('/resources/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM resource WHERE ResourceID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting resource:', err);
                return res.status(500).json({ message: 'Failed to delete resource' });
            }
            if (results.affectedRows > 0) {
                // Send notification on successful deletion
                sendNotification(`Resource ID ${id} has been deleted`);
                res.json({ message: 'Resource deleted successfully' });
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        });
    });

    return router;
};
