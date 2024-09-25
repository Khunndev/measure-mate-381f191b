const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await sql.connect();
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: { id: user.ID, username: user.Username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
