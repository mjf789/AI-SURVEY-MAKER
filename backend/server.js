// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import BOTH route files
const surveyRoutes = require('./routes/survey');
const enhancedSurveyRoutes = require('./routes/enhancedSurvey');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API routes - use BOTH route sets
app.use('/api', surveyRoutes);
app.use('/api', enhancedSurveyRoutes); // Add enhanced routes

// In production, serve the built React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Available endpoints:
    - POST /api/extract-dvs
    - POST /api/parse-scales
    - POST /api/generate-qsf
    - POST /api/extract-scales
    - POST /api/generate-survey
    `);
    if (process.env.NODE_ENV !== 'production') {
        console.log('In development mode - run the React dev server separately on port 5173');
    }
});