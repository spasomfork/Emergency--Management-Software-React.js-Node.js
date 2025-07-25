const express = require('express');
const multer = require('multer');
const mime = require('mime-types');
const axios = require('axios');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 10MB limit
  });

module.exports = (db) => {
    const router = express.Router();

    // Send a notification when a damage report is created, updated, or deleted
    const sendNotification = async (message) => {
        try {
            await axios.post('http://localhost:5000/notifications', {
                message,  // Only send message
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Get all damage reports
    router.get('/damagereports', (req, res) => {
        const query = 'SELECT * FROM damagereport';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching damage reports:', err);
                return res.status(500).json({ message: 'Failed to retrieve damage reports' });
            }
    
            const reportsWithImages = results.map(report => {
                if (report.Photo) {
                    const mimeType = report.PhotoMimeType || 'image/jpeg';
                    const base64Image = `data:${mimeType};base64,${report.Photo.toString('base64')}`;
                    return { ...report, Photo: base64Image };
                }
                return report;
            });
    
            res.json(reportsWithImages);
        });
    });

    // Get a damage report by ID
    router.get('/damagereports/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM damagereport WHERE ReportID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching damage report:', err);
                return res.status(500).json({ message: 'Failed to retrieve damage report' });
            }
            if (results.length > 0) {
                const report = results[0];
                if (report.Photo) {
                    const mimeType = 'image/jpeg'; // Update this according to the image type stored in your database
                    report.Photo = `data:${mimeType};base64,${report.Photo.toString('base64')}`;
                }
                res.json(report);
            } else {
                res.status(404).json({ message: 'Damage report not found' });
            }
        });
    });

    // Create a new damage report
    router.post('/damagereports', upload.single('Photo'), (req, res) => {
        const { DamageDescription, Severity, Property, Name, Latitude, Longitude } = req.body;
        const Photo = req.file ? req.file.buffer : null;
        const PhotoMimeType = req.file ? req.file.mimetype : null;
    
        const query = `
            INSERT INTO damagereport (DamageDescription, Severity, Property, Name, Latitude, Longitude, Photo, PhotoMimeType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [DamageDescription, Severity, Property, Name, Latitude, Longitude, Photo, PhotoMimeType], (err, results) => {
            if (err) {
                console.error('Error creating damage report:', err.sqlMessage || err);
                return res.status(500).json({ message: 'Failed to create damage report' });
            }
            sendNotification('A new damage report has been created');
            res.status(201).json({ message: 'Damage report created successfully', reportId: results.insertId });
        });
    });

    // Delete a damage report
    router.delete('/damagereports/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM damagereport WHERE ReportID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting damage report:', err);
                return res.status(500).json({ message: 'Failed to delete damage report' });
            }
            if (results.affectedRows > 0) {
                // Send notification on successful deletion
                sendNotification(`Damage report ID ${id} has been deleted`);
                res.json({ message: 'Damage report deleted successfully' });
            } else {
                res.status(404).json({ message: 'Damage report not found' });
            }
        });
    });

    return router;
};
