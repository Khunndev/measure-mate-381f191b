const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');

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
    await sql.connect(config);
    console.log('Connected to MSSQL server');
    await initializeDatabase();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

async function initializeDatabase() {
  try {
    const initSqlPath = path.join(__dirname, 'db', 'init.sql');
    const initSql = await fs.readFile(initSqlPath, 'utf8');
    
    await sql.query(initSql);
    console.log('Database and table initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

module.exports = { sql, connectDB };
