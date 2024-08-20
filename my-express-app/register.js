// register.js
const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Registration route
    router.post('/register', (req, res) => {
        const { name, password, contact, role } = req.body;

        // Validate input
        if (!name || !password || !contact || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Prepare SQL query
        const query = 'INSERT INTO personnel (Name, Password, ContactInformation, Role) VALUES (?, ?, ?, ?)';

        // Execute query
        db.query(query, [name, password, contact, role], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Registration failed' });
            }
            res.status(201).json({ message: 'Registration successful' });
        });
    });

    return router;
};
