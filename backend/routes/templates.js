const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM Templates');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching templates' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const pool = await sql.connect();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .query('INSERT INTO Templates (Name) VALUES (@name); SELECT SCOPE_IDENTITY() AS id');
    res.status(201).json({ id: result.recordset[0].id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating template' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .query('UPDATE Templates SET Name = @name WHERE ID = @id');
    res.status(200).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating template' });
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
