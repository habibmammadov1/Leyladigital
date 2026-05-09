const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'leyladigital',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const seedData = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    logger.info('Schema created.');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seedSql);
    logger.info('Data seeded successfully.');

    process.exit(0);
  } catch (err) {
    logger.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
