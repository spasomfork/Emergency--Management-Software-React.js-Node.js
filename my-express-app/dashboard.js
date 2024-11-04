const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Dashboard data endpoint
    router.get('/dashboard-data', (req, res) => {
        const queries = {
            incidents: 'SELECT COUNT(*) AS totalIncidents FROM incident',
            hospitals: 'SELECT COUNT(*) AS totalHospitals FROM hospital',
            activeHospitals: 'SELECT SUM(Capacity) AS activeHospitals FROM hospital WHERE Capacity > 0 AND Status = \'Active\'',
            evacuationCenters: 
                'SELECT ' +  
                    'SUM(CASE WHEN AvailabilityStatus = \'Active\' THEN 1 ELSE 0 END) AS activeCenters, ' +
                    'SUM(CASE WHEN AvailabilityStatus = \'Deactive\' THEN 1 ELSE 0 END) AS deactiveCenters ' +
                'FROM evacuationcenter',
            tasks: 
                'SELECT ' +  
                    'SUM(CASE WHEN Status = \'Complete\' THEN 1 ELSE 0 END) AS completeTasks, ' +
                    'SUM(CASE WHEN Status = \'InProgress\' THEN 1 ELSE 0 END) AS inProgressTasks ' +
                'FROM task',
            personnelCount: 'SELECT COUNT(*) AS personnelCount FROM personnel',
            damageReports: 
                'SELECT ' +  
                    'SUM(CASE WHEN Severity = \'Low\' THEN 1 ELSE 0 END) AS low, ' +
                    'SUM(CASE WHEN Severity = \'Mild\' THEN 1 ELSE 0 END) AS mild, ' +
                    'SUM(CASE WHEN Severity = \'High\' THEN 1 ELSE 0 END) AS high ' +
                'FROM damagereport'
        };

        const results = {};

        // Execute all queries
        const promises = Object.entries(queries).map(([key, query]) =>
            new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        results[key] = result[0]; // Assuming result is an array and you're interested in the first element
                        resolve();
                    }
                });
            })
        );

        Promise.all(promises)
            .then(() => res.json(results))  // Send response with the results
            .catch((err) => {
                console.error('Error fetching dashboard data:', err);
                res.status(500).json({ message: 'Failed to retrieve dashboard data', details: err });
            });
    });

    return router;
};
