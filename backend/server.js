const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', timestamp: new Date().toISOString(), db: 'error' });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  logger.info(`Backend server starting at port ${PORT}`);
  try {
    await testConnection();
    logger.info('Connected to PostgreSQL');
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL', error);
    // Do not crash on failure per constraints
  }
});
