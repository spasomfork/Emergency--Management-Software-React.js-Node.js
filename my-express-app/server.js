// server.js
const http = require('http');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const app = express();
const port = 5000;


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emergency management software', // Ensure the database name is correct
    port: 3307 // Make sure this matches your MySQL server configuration
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Import routes and pass db connection
const loginRoutes = require('./login')(db);
const registerRoutes = require('./register')(db);
const incidentRoutes = require('./incident')(db);
const hospitalRoutes = require('./hospital')(db);
const evacuationRoutes = require('./evacuationcentre')(db);
const taskRoutes = require('./task')(db);
const lifelinenumberRoutes = require('./lifelinenumber')(db);
const roleRoutes = require('./roles')(db);
const damageRoutes = require('./damagereporting')(db);
const newsalertRoutes = require('./newsalert')(db);
const resourceRoutes = require('./resource')(db);
const chatRoutes = require('./chat')(db);
const dashboardRoutes = require('./dashboard')(db);
const notification = require('./notification')(db);

app.use(loginRoutes);
app.use(registerRoutes);
app.use(incidentRoutes);
app.use(hospitalRoutes);
app.use(evacuationRoutes);
app.use(taskRoutes);
app.use(lifelinenumberRoutes);
app.use(roleRoutes);
app.use(damageRoutes);
app.use(newsalertRoutes);
app.use(resourceRoutes);
app.use(chatRoutes);
app.use(dashboardRoutes);
app.use(notification);

// Start the server using HTTP
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
