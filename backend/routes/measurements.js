const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { traceabilityCode, inspectorName, D1, D2 } = req.body;
    
    const pool = await sql.connect();
    const result = await pool.request()
      .input('traceabilityCode', sql.VarChar, traceabilityCode)
      .input('inspectorName', sql.VarChar, inspectorName)
      .input('D1_1', sql.Float, D1[0])
      .input('D1_2', sql.Float, D1[1])
      .input('D1_3', sql.Float, D1[2])
      .input('D1_4', sql.Float, D1[3])
      .input('D1_avg', sql.Float, calculateAverage(D1))
      .input('D2_1', sql.Float, D2[0])
      .input('D2_2', sql.Float, D2[1])
      .input('D2_3', sql.Float, D2[2])
      .input('D2_4', sql.Float, D2[3])
      .input('D2_avg', sql.Float, calculateAverage(D2))
      .query(`
        INSERT INTO Measurements (TraceabilityCode, InspectorName, D1_1, D1_2, D1_3, D1_4, D1_avg, D2_1, D2_2, D2_3, D2_4, D2_avg)
        VALUES (@traceabilityCode, @inspectorName, @D1_1, @D1_2, @D1_3, @D1_4, @D1_avg, @D2_1, @D2_2, @D2_3, @D2_4, @D2_avg)
      `);

    res.status(201).json({ message: 'Measurement saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving measurement' });
  }
});

function calculateAverage(values) {
  const validValues = values.filter(v => v !== '').map(Number);
  return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
}

module.exports = router;
