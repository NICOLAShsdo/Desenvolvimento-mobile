const express = require('express');
const pool = require('../db');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireRole(['admin', 'professor']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, p.name as professor_name
      FROM disciplines d
      LEFT JOIN professors p ON p.id = d.professor_id
      ORDER BY d.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar disciplinas' });
  }
});

router.post('/', requireRole(['admin']), async (req, res) => {
  const { name, workload, professor_id } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO disciplines (name, workload, professor_id) VALUES ($1, $2, $3) RETURNING *',
      [name, workload || null, professor_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar disciplina' });
  }
});

module.exports = router;
