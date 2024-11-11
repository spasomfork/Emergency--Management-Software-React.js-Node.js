const express = require('express');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

module.exports = (db) => {
    const router = express.Router();

    // Multer setup for file upload
    const upload = multer({ dest: 'uploads/' });

    // Send a notification when a lifeline number is created, updated, or deleted
    const sendNotification = async (message) => {
        try {
            await axios.post('http://localhost:5000/notifications', {
                message,  // Only send message
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Get all lifeline numbers
    router.get('/lifeline-numbers', (req, res) => {
        const query = 'SELECT * FROM lifelinenumber';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching lifeline numbers:', err);
                return res.status(500).json({ message: 'Failed to retrieve lifeline numbers' });
            }
            res.json(results);
        });
    });

    // Get a lifeline number by ID
    router.get('/lifeline-numbers/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM lifelinenumber WHERE NumberID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching lifeline number:', err);
                return res.status(500).json({ message: 'Failed to retrieve lifeline number' });
            }
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Lifeline number not found' });
            }
        });
    });

    // Create a new lifeline number
    router.post('/lifeline-numbers', (req, res) => {
        const { ServiceName, ContactNumber } = req.body;

        // Validate required fields
        if (!ServiceName || !ContactNumber) {
            return res.status(400).json({ message: 'Please provide all required fields: ServiceName and ContactNumber' });
        }

        const query = 'INSERT INTO lifelinenumber (ServiceName, ContactNumber) VALUES (?, ?)';
        db.query(query, [ServiceName, ContactNumber], (err, results) => {
            if (err) {
                console.error('Error creating lifeline number:', err);
                return res.status(500).json({ message: 'Failed to create lifeline number' });
            }
            // Send notification on successful creation
            sendNotification('A new lifeline number has been created');
            res.status(201).json({ message: 'Lifeline number created successfully' });
        });
    });

    // Update a lifeline number
    router.put('/lifeline-numbers/:id', (req, res) => {
        const { id } = req.params;
        let { ServiceName, ContactNumber } = req.body;

        // Trim the input values
        ServiceName = ServiceName.trim();
        ContactNumber = ContactNumber.trim();

        const query = 'UPDATE lifelinenumber SET ServiceName = ?, ContactNumber = ? WHERE NumberID = ?';
        db.query(query, [ServiceName, ContactNumber, id], (err, results) => {
            if (err) {
                console.error('Error updating lifeline number:', err);
                return res.status(500).json({ message: 'Failed to update lifeline number' });
            }
            // Send notification on successful update
            sendNotification(`Lifeline number ID ${id} has been updated`);
            res.json({ message: 'Lifeline number updated successfully' });
        });
    });

    // Delete a lifeline number
    router.delete('/lifeline-numbers/:id', (req, res) => {
        const { id } = req.params;

        const query = 'DELETE FROM lifelinenumber WHERE NumberID = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting lifeline number:', err);
                return res.status(500).json({ message: 'Failed to delete lifeline number' });
            }
            // Send notification on successful deletion
            sendNotification(`Lifeline number ID ${id} has been deleted`);
            res.json({ message: 'Lifeline number deleted successfully' });
        });
    });

    // Upload and process lifeline numbers via CSV
    router.post('/lifeline-numbers/upload', upload.single('file'), (req, res) => {
        const filePath = req.file.path;
        const lifelineNumbers = [];

        // Parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Trim field names and values
                const trimmedRow = {};
                for (const [key, value] of Object.entries(row)) {
                    trimmedRow[key.trim()] = value.trim();
                }

                const { ServiceName, ContactNumber } = trimmedRow;

                // Ensure all fields are present and valid
                if (ServiceName && ContactNumber) {
                    lifelineNumbers.push([ServiceName, ContactNumber]);
                } else {
                    console.warn(`Invalid row detected and skipped: ${JSON.stringify(trimmedRow)}`);
                }
            })
            .on('end', () => {
                // Log the array content for debugging
                console.log('Lifeline numbers array:', lifelineNumbers);

                if (lifelineNumbers.length === 0) {
                    return res.status(400).json({ message: 'No valid lifeline numbers found in the CSV file.' });
                }

                // Bulk insert into the database
                const query = 'INSERT INTO lifelinenumber (ServiceName, ContactNumber) VALUES ?';
                db.query(query, [lifelineNumbers], (err, results) => {
                    // Delete the file after processing
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting the file:', unlinkErr);
                        }
                    });

                    if (err) {
                        console.error('Error inserting lifeline numbers:', err);
                        return res.status(500).json({ message: 'Failed to upload lifeline numbers' });
                    }
                    // Send notification on successful upload
                    sendNotification('Lifeline numbers uploaded successfully');
                    res.status(201).json({ message: 'Lifeline numbers uploaded successfully', insertedCount: results.affectedRows });
                });
            })
            .on('error', (err) => {
                console.error('Error processing CSV:', err);
                res.status(500).json({ message: 'Failed to process CSV file' });
            });
    });

    return router;
};
