const express = require('express');
const axios = require('axios');

module.exports = (db) => {
    const router = express.Router();

    // Send a notification when an evacuation center is created, updated, or deleted
    const sendNotification = async (message) => {
        try {
            await axios.post('http://localhost:5000/notifications', {
                message,
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Get all evacuation centers
    router.get('/evacuation-centers', (req, res) => {
        const query = 'SELECT * FROM evacuationcenter';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching evacuation centers:', err);
                return res.status(500).json({ message: 'Failed to retrieve evacuation centers' });
            }
            res.json(results);
        });
    });

    // Get an evacuation center by ID
    router.get('/evacuation-centers/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM evacuationcenter WHERE CenterID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching evacuation center:', err);
                return res.status(500).json({ message: 'Failed to retrieve evacuation center' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Evacuation center not found' });
            }
        });
    });

    // Create a new evacuation center
    router.post('/evacuation-centers', (req, res) => {
        const { Name, Location, Capacity, AvailabilityStatus } = req.body;

        // Validate required fields
        if (!Name || !Location || !Capacity || !AvailabilityStatus) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Location, Capacity, and AvailabilityStatus' });
        }

        const query = 'INSERT INTO evacuationcenter (Name, Location, Capacity, AvailabilityStatus) VALUES (?, ?, ?, ?)';
        db.query(query, [Name, Location, Capacity, AvailabilityStatus], (err, results) => {
            if (err) {
                console.error('Error creating evacuation center:', err);
                return res.status(500).json({ message: 'Failed to create evacuation center' });
            }
            sendNotification('A new evacuation center has been created');
            res.status(201).json({ message: 'Evacuation center created successfully', CenterID: results.insertId });
        });
    });

    // Update an evacuation center by ID
    router.put('/evacuation-centers/:id', (req, res) => {
        const { id } = req.params;
        const { Name, Location, Capacity, AvailabilityStatus } = req.body;

        // Validate required fields
        if (!Name || !Location || !Capacity || !AvailabilityStatus) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Location, Capacity, and AvailabilityStatus' });
        }

        const query = `
            UPDATE evacuationcenter 
            SET Name = ?, Location = ?, Capacity = ?, AvailabilityStatus = ? 
            WHERE CenterID = ?
        `;
        db.query(query, [Name, Location, Capacity, AvailabilityStatus, id], (err, results) => {
            if (err) {
                console.error('Error updating evacuation center:', err);
                return res.status(500).json({ message: 'Failed to update evacuation center' });
            }
            if (results.affectedRows > 0) {
                sendNotification(`Evacuation Center ID ${id} has been updated`);
                res.json({ message: 'Evacuation center updated successfully' });
            } else {
                res.status(404).json({ message: 'Evacuation center not found' });
            }
        });
    });

    // Delete an evacuation center by ID
    router.delete('/evacuation-centers/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM evacuationcenter WHERE CenterID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting evacuation center:', err);
                return res.status(500).json({ message: 'Failed to delete evacuation center' });
            }
            if (results.affectedRows > 0) {
                sendNotification(`Evacuation Center ID ${id} has been deleted`);
                res.json({ message: 'Evacuation center deleted successfully' });
            } else {
                res.status(404).json({ message: 'Evacuation center not found' });
            }
        });
    });

    return router;
};
