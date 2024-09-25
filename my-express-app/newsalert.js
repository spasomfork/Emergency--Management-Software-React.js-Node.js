const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

module.exports = (db) => {
    const router = express.Router();

    // Fetch all disaster alerts
    router.get('/disaster-alerts', (req, res) => {
        const query = 'SELECT * FROM newsalert ORDER BY AlertDate DESC'; // Table name updated
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching alerts:', err);
                return res.status(500).json({ message: 'Failed to retrieve alerts' });
            }
            res.json(results);
        });
    });

    // Fetch a disaster alert by ID
    router.get('/disaster-alerts/:id', (req, res) => {
        const { id } = req.params;
        const query = 'SELECT * FROM newsalert WHERE AlertID = ?'; // Assuming AlertID is the column name for the unique identifier
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching alert by ID:', err);
                return res.status(500).json({ message: 'Failed to retrieve alert' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Alert not found' });
            }
            res.json(results[0]); // Return the first result as we expect only one alert
        });
    });

    // Delete a disaster alert by ID
    router.delete('/disaster-alerts/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM newsalert WHERE AlertID = ?'; // Table name updated
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting alert:', err);
                return res.status(500).json({ message: 'Failed to delete alert' });
            }
            res.json({ message: 'Alert deleted successfully' });
        });
    });

    // Function to maintain only the latest 100 records
    const maintainAlertLimit = async () => {
        try {
            const countQuery = 'SELECT COUNT(*) AS count FROM newsalert';
            db.query(countQuery, (err, results) => {
                if (err) {
                    console.error('Error counting alerts:', err);
                    return;
                }
                const count = results[0].count;

                if (count > 100) {
                    const deleteQuery = 'DELETE FROM newsalert ORDER BY AlertDate ASC LIMIT ?'; // Delete the oldest records
                    const excessCount = count - 100;
                    db.query(deleteQuery, [excessCount], (err, results) => {
                        if (err) {
                            console.error('Error deleting old alerts:', err);
                        } else {
                            console.log(`Deleted ${excessCount} old alerts to maintain limit of 100.`);
                        }
                    });
                }
            });
        } catch (err) {
            console.error('Error maintaining alert limit:', err);
        }
    };

    // Function to fetch the latest alerts from an external API and update the database
    const fetchAlerts = async () => {
        try {
            const response = await axios.get('https://api.reliefweb.int/v1/disasters?appname=yourAppName&fields[include][]=name&fields[include][]=description');
            const alerts = response.data.data;

            const insertQuery = `
                INSERT INTO newsalert (AlertTitle, AlertDescription, AlertSource, AlertType) 
                VALUES (?, ?, ?, ?)
            `;

            alerts.forEach(alert => {
                const title = alert.fields.name;
                const description = alert.fields.description || 'No description available';  // Fetching the description
                const source = 'ReliefWeb';
                const type = alert.fields.type?.name || 'Unknown';

                db.query(insertQuery, [title, description, source, type], (err, result) => {
                    if (err) {
                        console.error('Error inserting alert:', err);
                    } else {
                        console.log(`Inserted Alert: ${title}`);
                    }
                });
            });

            // Maintain the limit of 100 records
            await maintainAlertLimit(); // Call the function to maintain the record limit
        } catch (err) {
            console.error('Error fetching new alerts:', err);
        }
    };

    // Manually trigger the function here
    fetchAlerts();  // This will call the function immediately when the server starts

    // Auto-update alerts every hour using cron job
    cron.schedule('0 * * * *', fetchAlerts); // Runs every hour

    return router;
};
