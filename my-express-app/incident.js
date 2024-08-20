const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Get all incidents
    router.get('/incidents', (req, res) => {
        const query = 'SELECT * FROM incident';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching incidents:', err);
                return res.status(500).json({ message: 'Failed to retrieve incidents' });
            }
            res.json(results);
        });
    });

    // Get an incident by ID
    router.get('/incidents/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM incident WHERE IncidentID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching incident:', err);
                return res.status(500).json({ message: 'Failed to retrieve incident' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Incident not found' });
            }
        });
    });

      // Create an incident
      router.post('/incidents', (req, res) => {
        const { Title, Description, Status, Date, Latitude, Longitude } = req.body;
        const query = `
            INSERT INTO incident (Title, Description, Status, Date, Latitude, Longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [Title, Description, Status, Date, Latitude, Longitude], (err, results) => {
            if (err) {
                console.error('Error creating incident:', err.sqlMessage || err);
                return res.status(500).json({ message: 'Failed to create incident' });
            }
            res.status(201).json({ message: 'Incident created successfully', incidentId: results.insertId });
        });
    });

    // Update an incident
    router.put('/incidents/:id', (req, res) => {
        const { id } = req.params;
        const { Title, Description, Status, Date, Latitude, Longitude } = req.body;
        const query = `
            UPDATE incident 
            SET Title = ?, Description = ?, Status = ?, Date = ?, Latitude = ?, Longitude = ?
            WHERE IncidentID = ?
        `;
        db.query(query, [Title, Description, Status, Date, Latitude, Longitude, id], (err, results) => {
            if (err) {
                console.error('Error updating incident:', err);
                return res.status(500).json({ message: 'Failed to update incident' });
            }
            if (results.affectedRows > 0) {
                res.json({ message: 'Incident updated successfully' });
            } else {
                res.status(404).json({ message: 'Incident not found' });
            }
        });
    });

    // Delete an incident
    router.delete('/incidents/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM incident WHERE IncidentID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting incident:', err);
                return res.status(500).json({ message: 'Failed to delete incident' });
            }
            if (results.affectedRows > 0) {
                res.json({ message: 'Incident deleted successfully' });
            } else {
                res.status(404).json({ message: 'Incident not found' });
            }
        });
    });

    return router;
};
