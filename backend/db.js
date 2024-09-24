const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();  // Load environment variables from .env

// Config with fallback
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,  // fallback to localhost
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    console.log('Connecting to database with config:', config);  // Debug log

    const pool = await sql.connect(config);  // connect using pool
    console.log('Connected to MSSQL server');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}


module.exports = { sql, connectDB };
