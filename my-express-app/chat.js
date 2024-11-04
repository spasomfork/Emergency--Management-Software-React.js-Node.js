const express = require('express');
const axios = require('axios');

module.exports = (db) => {
  const router = express.Router();

  const SQL_MILLENNIALS_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B';
  const SQL_MILLENNIALS_API_KEY = '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'; // Replace with your actual API key
  const axiosConfig = {
    headers: { Authorization: `Bearer ${SQL_MILLENNIALS_API_KEY}` },
    timeout: 10000, // Adjust timeout as needed
  };

  // Predefined questions and corresponding SQL queries
  const predefinedQueries = {
    'Get All Damage Reports': 'SELECT * FROM damagereport;',
    'Get Damage Reports with Severity Level "High"': 'SELECT * FROM damagereport WHERE Severity = "High";',
    'Get Damage Reports with Severity Level "Mild"': 'SELECT * FROM damagereport WHERE Severity = "Mild";',
    'Get Damage Reports with Severity Level "Low"': 'SELECT * FROM damagereport WHERE Severity = "Low";',
    'Count Total Number of Damage Reports': 'SELECT COUNT(*) AS TotalDamageReports FROM damagereport;',
    'Get All Emergency Contacts': 'SELECT * FROM emergencycontact;',
    'Get All Evacuation Centers with Capacity Greater than 100': 'SELECT * FROM evacuationcenter WHERE Capacity > 100;',
    'Get All Incidents Ordered by DateTime': 'SELECT * FROM incident ORDER BY DateTime DESC;',
    'Get Average Capacity of Hospitals': 'SELECT AVG(Capacity) AS AverageCapacity FROM hospital;',
    'Find Maximum Capacity of Evacuation Centers': 'SELECT MAX(Capacity) AS MaxCapacity FROM evacuationcenter;',
    'Get Total Number of Resources': 'SELECT SUM(Quantity) AS TotalResources FROM resource;',
    'Get All Personnel with Role "Admin"': 'SELECT * FROM personnel WHERE Role = "Amdin";',
    'Get All Personnel with Role "Relief Organization"': 'SELECT * FROM personnel WHERE Role = "Relief Organization";',
    'Get All Personnel with Role "User"': 'SELECT * FROM personnel WHERE Role = "User";',
    'Find Volunteers with Availability Not Equal to "Available"': 'SELECT * FROM volunteer WHERE Availability != "Available";',
    'Get All News Alerts within a Specific Date Range': 'SELECT * FROM newsalert WHERE DateTime BETWEEN "2024-01-01" AND "2024-12-31";',
    'Get Total Damage Reported for Each Severity Level': 'SELECT Severity, COUNT(*) AS TotalReports FROM damagereport GROUP BY Severity;',
    'Find Incidents with Description Containing "Flood"': 'SELECT * FROM incident WHERE Description LIKE "%Flood%";',
    'Get All Inventory Items at a Specific Location': 'SELECT * FROM inventory WHERE Location IN ("Warehouse A", "Warehouse B");',
    'Get Minimum Quantity of Resources': 'SELECT MIN(Quantity) AS MinResourceQuantity FROM resource;',
    'Get All Tasks Assigned to a Specific User': 'SELECT * FROM task WHERE TaskID = 3;',
  };

  function classifyQueryType(query) {
    const sqlKeywords = ['fetch', 'data', 'report', 'select', 'table', 'join', 'how many', 'count', 'list'];
    const lowercaseQuery = query.toLowerCase();
    return sqlKeywords.some(keyword => lowercaseQuery.includes(keyword)) || predefinedQueries[query] ? 'sql' : 'conversation';
  }

  async function generateConversationalResponse(query, retries = 3) {
    const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B';
    const HUGGING_FACE_API_KEY = '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'; // Replace with your actual API key
    const axiosConfigConversation = {
      headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
      timeout: 10000,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(HUGGING_FACE_API_URL, { inputs: query }, axiosConfigConversation);
        return response.data[0]?.generated_text.trim() || "I'm here to help with your questions!";
      } catch (error) {
        if (attempt === retries) throw new Error("Failed to generate conversation response: " + error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async function logChatMessage(userID, message) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO chat (UserID, Message, Timestamp) VALUES (?, ?, NOW())`, [userID, message], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  router.post('/chat/ask', async (req, res) => {
    try {
      const userQuery = req.body.query;
      const userID = req.session.user ? req.session.user.id : null;

      if (!userQuery) {
        return res.status(400).json({ message: 'Query is required' });
      }

      const queryType = classifyQueryType(userQuery);

      if (queryType === 'conversation') {
        const responseMessage = await generateConversationalResponse(userQuery);
        await logChatMessage(userID, responseMessage);
        return res.json({ message: responseMessage });

      } else if (queryType === 'sql') {
        const sqlQuery = predefinedQueries[userQuery] || userQuery;

        if (!sqlQuery) return res.status(500).json({ message: 'No SQL query found for this user query' });

        console.log('Executing SQL Query:', sqlQuery);

        db.query(sqlQuery, (err, results) => {
          if (err) {
            console.error('SQL Execution Error:', err);
            return res.status(500).json({ message: 'Failed to execute SQL query' });
          }

          const responseMessage = JSON.stringify(results);
          logChatMessage(userID, responseMessage); // Log response
          res.json({ message: responseMessage });
        });
      }
    } catch (error) {
      console.error('Error in chat API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};
