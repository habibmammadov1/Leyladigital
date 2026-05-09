const { Pool } = require('pg');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Smart Database Configuration
 * Works seamlessly in Local (Docker/Native) and Production (Vercel/Supabase)
 */

// 1. Construct or get Connection String
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && process.env.DB_HOST) {
  // Construct from individual variables (typical for local/docker)
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 5432;
  const database = process.env.DB_NAME || 'leyladigital';
  dbUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;
}

// 2. Determine SSL requirements
// Disable SSL for localhost, 127.0.0.1, or internal Docker 'postgres' host
const isLocal = !dbUrl || 
                dbUrl.includes('localhost') || 
                dbUrl.includes('127.0.0.1') || 
                dbUrl.includes('@postgres:');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocal ? false : {
    rejectUnauthorized: false
  },
  // Serverless-friendly settings
  max: isLocal ? 10 : 1, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
  if (!isLocal) process.exit(-1); // Only crash in prod for safety
});

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    return res;
  } catch (error) {
    logger.error('Database connection test failed', { url: dbUrl.replace(/:[^@]+@/, ':****@'), error: error.message });
    throw error;
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
};
