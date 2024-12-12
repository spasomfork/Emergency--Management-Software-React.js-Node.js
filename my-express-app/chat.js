const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Simple in-memory cache for responses
const responseCache = {};

module.exports = (db) => {
  const router = express.Router();

  // Initialize Google Generative AI SDK
  const genAI = new GoogleGenerativeAI('AIzaSyA2jWWRG4x88ODe7ehiYk1GZdJehJYroc0'); // Replace with your API key
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    'Get All Personnel with Role "Admin"': 'SELECT * FROM personnel WHERE Role = "Admin";',
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

  async function generateConversationalResponse(query) {
    // Check if the response is cached
    if (responseCache[query]) {
      return responseCache[query];
    }

    try {
      // Call the model to generate a conversational response
      const result = await model.generateContent(query);

      // Log the full response to inspect its structure
      console.log('API Response:', result);

      // The text is now a function, so we need to invoke it
      const textResponse = result?.response?.text;

      if (typeof textResponse === 'function') {
        // If it's a function, invoke it to get the response text
        const responseMessage = textResponse();
        // Cache the response
        responseCache[query] = responseMessage;
        return responseMessage;
      } else {
        throw new Error('Unexpected response structure: textResponse is not a function');
      }
    } catch (error) {
      console.error('Error generating conversational response:', error.message);
      throw new Error('Failed to generate conversation response.');
    }
  }

  async function logChatMessage(userID, message) {
    // Log asynchronously to avoid blocking API response
    try {
      await new Promise((resolve, reject) => {
        db.query(`INSERT INTO chat (UserID, Message, Timestamp) VALUES (?, ?, NOW())`, [userID, message], (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (err) {
      console.error('Error logging chat message:', err);
    }
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
        // Log asynchronously while sending the response
        logChatMessage(userID, responseMessage); 
        return res.json({ message: responseMessage });

      } else if (queryType === 'sql') {
        const sqlQuery = predefinedQueries[userQuery] || userQuery;

        if (!sqlQuery) return res.status(500).json({ message: 'No SQL query found for this user query' });

        console.log('Executing SQL Query:', sqlQuery);

        db.query(sqlQuery, async (err, results) => {
          if (err) {
            console.error('SQL Execution Error:', err);
            return res.status(500).json({ message: 'Failed to execute SQL query' });
          }

          const responseMessage = JSON.stringify(results);
          logChatMessage(userID, responseMessage); // Log asynchronously
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
