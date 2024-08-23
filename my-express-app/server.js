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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emergency management software',
    port: 3307
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
const hospitalRoutesRoutes = require('./hospital')(db);
const evacuationRoutes = require('./evacuationcentre')(db);
const taskRoutes = require('./task')(db);
const lifelinenumberRoutes = require('./lifelinenumber')(db);

app.use(incidentRoutes);
app.use(loginRoutes);
app.use(registerRoutes);
app.use(hospitalRoutesRoutes);
app.use(evacuationRoutes);
app.use(taskRoutes);
app.use(lifelinenumberRoutes);

// Start the server using HTTP
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
