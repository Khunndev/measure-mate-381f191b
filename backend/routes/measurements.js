const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { traceabilityCode, D1, D2 } = req.body;
    
    const pool = await sql.connect();
    const result = await pool.request()
      .input('traceabilityCode', sql.VarChar, traceabilityCode)
      .input('D1', sql.VarChar, JSON.stringify(D1))
      .input('D2', sql.VarChar, JSON.stringify(D2))
      .query(`
        INSERT INTO Measurements (TraceabilityCode, D1, D2)
        VALUES (@traceabilityCode, @D1, @D2)
      `);

    res.status(201).json({ message: 'Measurement saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving measurement' });
  }
});

module.exports = router;