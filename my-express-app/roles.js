const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Get all personnel
    router.get('/personnel', (req, res) => {
        const query = 'SELECT PersonnelID, Name, Status, ContactInformation, Role FROM personnel';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching personnel:', err);
                return res.status(500).json({ message: 'Failed to retrieve personnel' });
            }
            res.json(results);
        });
    });

    // Update role of a personnel by ID
    router.put('/personnel/:id', (req, res) => {
        const { id } = req.params;
        const { Role } = req.body;

        const query = 'UPDATE personnel SET Role = ? WHERE PersonnelID = ?';
        db.query(query, [Role, id], (err, results) => {
            if (err) {
                console.error('Error updating personnel:', err);
                return res.status(500).json({ message: 'Failed to update personnel' });
            }
            res.json({ message: 'Personnel role updated successfully' });
        });
    });

    // Delete personnel by ID
    router.delete('/personnel/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM personnel WHERE PersonnelID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting personnel:', err);
                return res.status(500).json({ message: 'Failed to delete personnel' });
            }
            if (results.affectedRows > 0) {
                res.json({ message: 'Personnel deleted successfully' });
            } else {
                res.status(404).json({ message: 'Personnel not found' });
            }
        });
    });

    return router;
};
