const express = require('express');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

module.exports = (db) => {
    const router = express.Router();

    // Multer setup for file upload
    const upload = multer({ dest: 'uploads/' });

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
            res.status(201).json({ message: 'Lifeline number created successfully' });
        });
    });

    // Update a lifeline number
    router.put('/lifeline-numbers/:id', (req, res) => {
        const { id } = req.params;
        const { ServiceName, ContactNumber } = req.body;

        const query = 'UPDATE lifelinenumber SET ServiceName = ?, ContactNumber = ? WHERE NumberID = ?';
        db.query(query, [ServiceName, ContactNumber, id], (err, results) => {
            if (err) {
                console.error('Error updating lifeline number:', err);
                return res.status(500).json({ message: 'Failed to update lifeline number' });
            }
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
            res.json({ message: 'Lifeline number deleted successfully' });
        });
    });

    // Create lifeline numbers via CSV
    router.post('/lifeline-numbers/upload', upload.single('file'), (req, res) => {
        const filePath = req.file.path;

        const lifelineNumbers = [];

        // Parse CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Assuming the CSV has headers: ServiceName, ContactNumber
                const { ServiceName, ContactNumber } = row;
                lifelineNumbers.push([ServiceName, ContactNumber]);
            })
            .on('end', () => {
                const query = 'INSERT INTO lifelinenumber (ServiceName, ContactNumber) VALUES ?';

                db.query(query, [lifelineNumbers], (err, results) => {
                    if (err) {
                        console.error('Error uploading lifeline numbers:', err);
                        return res.status(500).json({ message: 'Failed to upload lifeline numbers' });
                    }
                    res.status(201).json({ message: 'Lifeline numbers uploaded successfully' });
                });

                // Clean up the uploaded file
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            });
    });

    // Generate PDF for lifeline numbers
router.get('/lifeline-numbers/pdf', async (req, res) => {
    try {
        // Query to get all lifeline numbers
        const query = 'SELECT * FROM lifelinenumber';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching lifeline numbers:', err);
                return res.status(500).json({ message: 'Failed to retrieve lifeline numbers' });
            }

            if (results.length === 0) {
                console.log('No lifeline numbers found');
                return res.status(404).json({ message: 'No lifeline numbers found' });
            }

            const doc = new PDFDocument();
            let pdfStream = doc.pipe(new stream.PassThrough());

            // Add more detailed logging
            doc.on('error', (err) => {
            console.error('PDFKit Error:', err);
            });


            doc.fontSize(16).text('Lifeline Numbers', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12);
            doc.text('ID', { continued: true, underline: true });
            doc.text('Service Name', { continued: true, underline: true });
            doc.text('Contact Number', { underline: true });
            doc.moveDown();

            results.forEach((number) => {
                doc.text(number.NumberID.toString(), { continued: true });
                doc.text(number.ServiceName, { continued: true });
                doc.text(number.ContactNumber);
            });

            doc.end();
            
            pdfStream.on('end', () => {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="lifeline_numbers.pdf"');
                pdfStream.pipe(res);
            });

        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Failed to generate PDF' });
    }
});


    return router;
};
