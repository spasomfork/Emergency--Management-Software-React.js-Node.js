const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

module.exports = (db) => {
    const router = express.Router();

    // Multer setup for file upload
    const upload = multer({ dest: 'uploads/' });

    // Send a notification when a hospital is created, updated, or deleted
    const sendNotification = async (message) => {
        try {
            await axios.post('http://localhost:5000/notifications', {
                message,  // Only send message
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Get all hospitals
    router.get('/hospitals', (req, res) => {
        const query = 'SELECT * FROM hospital';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching hospitals:', err);
                return res.status(500).json({ message: 'Failed to retrieve hospitals' });
            }
            res.json(results);
        });
    });

    // Get a hospital by ID
    router.get('/hospitals/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM hospital WHERE HospitalID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching hospital:', err);
                return res.status(500).json({ message: 'Failed to retrieve hospital' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Hospital not found' });
            }
        });
    });

    // Create a new hospital
    router.post('/hospitals', (req, res) => {
        const { Name, Location, Status, Capacity } = req.body;

        if (!Name || !Location || !Status || !Capacity) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Location, Status, and Capacity' });
        }

        const query = 'INSERT INTO hospital (Name, Location, Status, Capacity) VALUES (?, ?, ?, ?)';
        db.query(query, [Name, Location, Status, Capacity], (err, results) => {
            if (err) {
                console.error('Error creating hospital:', err);
                return res.status(500).json({ message: 'Failed to create hospital' });
            }
            sendNotification('A new hospital has been created');
            res.status(201).json({ message: 'Hospital created successfully', HospitalID: results.insertId });
        });
    });

    // Update a hospital by ID
    router.put('/hospitals/:id', (req, res) => {
        const { id } = req.params;
        const { Name, Location, Status, Capacity } = req.body;

        // Validate required fields
        if (!Name || !Location || !Status || !Capacity) {
            return res.status(400).json({ message: 'Please provide all required fields: Name, Location, Status, and Capacity' });
        }

        const query = 'UPDATE hospital SET Name = ?, Location = ?, Status = ?, Capacity = ? WHERE HospitalID = ?';
        db.query(query, [Name, Location, Status, Capacity, id], (err, results) => {
            if (err) {
                console.error('Error updating hospital:', err);
                return res.status(500).json({ message: 'Failed to update hospital' });
            }
            if (results.affectedRows > 0) {
                sendNotification(`Hospital ID ${id} has been updated`);
                res.json({ message: 'Hospital updated successfully' });
            } else {
                res.status(404).json({ message: 'Hospital not found' });
            }
        });
    });

    // Delete a hospital by ID
    router.delete('/hospitals/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM hospital WHERE HospitalID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting hospital:', err);
                return res.status(500).json({ message: 'Failed to delete hospital' });
            }
            if (results.affectedRows > 0) {
                sendNotification(`Hospital ID ${id} has been deleted`);
                res.json({ message: 'Hospital deleted successfully' });
            } else {
                res.status(404).json({ message: 'Hospital not found' });
            }
        });
    });

    // Upload and process CSV file
    router.post('/hospitals/upload', upload.single('file'), (req, res) => {
        const filePath = req.file.path;
        const hospitals = [];

        // Parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Trim field names and values
                const trimmedRow = {};
                for (const [key, value] of Object.entries(row)) {
                    trimmedRow[key.trim()] = value.trim();
                }

                const { Name, Location, Status, Capacity } = trimmedRow;

                // Ensure all fields are present and valid
                if (Name && Location && Status && Capacity) {
                    hospitals.push([Name, Location, Status, parseInt(Capacity, 10)]);
                } else {
                    console.warn(`Invalid row detected and skipped: ${JSON.stringify(trimmedRow)}`);
                }
            })
            .on('end', () => {
                if (hospitals.length === 0) {
                    return res.status(400).json({ message: 'No valid hospital data found in the CSV file.' });
                }

                // Bulk insert into the database
                const query = 'INSERT INTO hospital (Name, Location, Status, Capacity) VALUES ?';
                db.query(query, [hospitals], (err, results) => {
                    // Delete the file after processing
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting the file:', unlinkErr);
                        }
                    });

                    if (err) {
                        console.error('Error inserting hospitals:', err);
                        return res.status(500).json({ message: 'Failed to upload hospitals' });
                    }
                    sendNotification(`${results.affectedRows} hospitals have been uploaded`);
                    res.status(201).json({ message: 'Hospitals uploaded successfully', insertedCount: results.affectedRows });
                });
            })
            .on('error', (err) => {
                console.error('Error processing CSV:', err);
                res.status(500).json({ message: 'Failed to process CSV file' });
            });
    });

    return router;
};
