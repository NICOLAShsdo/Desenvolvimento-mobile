const express = require('express');
const pool = require('../db');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professors ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar professores' });
  }
});

router.post('/', requireRole(['admin']), async (req, res) => {
  const { name, title, experience_years } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO professors (name, title, experience_years) VALUES ($1, $2, $3) RETURNING *',
      [name, title || null, experience_years || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar professor' });
  }
});

module.exports = router;
