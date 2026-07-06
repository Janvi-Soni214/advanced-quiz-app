const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

const app = express();

// Initialize DB Connection
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Main App Router Interfaces
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));

app.get('/', (req, res) => {
  res.send('Quiz Platform API Running Production-Ready...');
});

// UPGRADE 4: Centralized Production-Grade Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`❌ Intercepted System Exception: ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Node Processing Error',
    // Only display stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server blazing on port ${PORT}`);
});