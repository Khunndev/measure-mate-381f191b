const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT ID as id, Name as name FROM Templates');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching templates' });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { elements } = req.body;
    const pool = await sql.connect();
    const result = await pool.request()
      .input('elements', sql.NVarChar(sql.MAX), JSON.stringify(elements))
      .query(`
        INSERT INTO Templates (Elements)
        VALUES (@elements);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving template' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Templates WHERE ID = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    const template = result.recordset[0];
    template.elements = JSON.parse(template.Elements);
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching template' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Templates WHERE ID = @id');
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting template' });
  }
});

module.exports = router;
