const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    console.log('Connecting to database with config:', config);
    const pool = await sql.connect(config);
    console.log('Connected to MSSQL server');
    await createTemplatesTable(pool);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

async function createTemplatesTable(pool) {
  try {
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Templates' and xtype='U')
      CREATE TABLE Templates (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        Elements NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);
    console.log('Templates table created or already exists');
  } catch (err) {
    console.error('Error creating Templates table:', err);
  }
}

module.exports = { sql, connectDB };
