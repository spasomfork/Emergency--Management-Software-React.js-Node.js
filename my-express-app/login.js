const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Login route
    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const query = 'SELECT * FROM personnel WHERE Name = ? AND Password = ?';
        db.query(query, [username, password], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                req.session.user = results[0];
                return res.json({ message: 'Login successful', user: results[0] });
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        });
    });

    // Logout route
    router.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.json({ message: 'Logout successful' });
        });
    });

    return router;
};
