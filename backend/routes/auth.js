const express = require('express');
const router = express.Router();
const axios = require('axios');
const { sql } = require('../db');

router.post('/google', async (req, res) => {
  try {
    const { code } = req.body;
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000',
      grant_type: 'authorization_code',
    });

    const { access_token } = data;
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const pool = await sql.connect();
    const result = await pool.request()
      .input('email', sql.NVarChar, profile.email)
      .input('name', sql.NVarChar, profile.name)
      .query(`
        MERGE INTO Users AS target
        USING (VALUES (@email, @name)) AS source (Email, Name)
        ON target.Email = source.Email
        WHEN MATCHED THEN
          UPDATE SET Name = source.Name
        WHEN NOT MATCHED THEN
          INSERT (Email, Name) VALUES (source.Email, source.Name);
        SELECT * FROM Users WHERE Email = @email;
      `);

    const user = result.recordset[0];
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;