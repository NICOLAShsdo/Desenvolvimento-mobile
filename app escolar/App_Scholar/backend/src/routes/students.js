const express = require('express');
const pool = require('../db');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Listar alunos
router.get('/', requireRole(['admin', 'professor']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar alunos' });
  }
});

// Criar aluno
router.post('/', requireRole(['admin', 'professor']), async (req, res) => {
  const { name, registration, course } = req.body;
  if (!name || !registration || !course) {
    return res.status(400).json({ message: 'Nome, matrícula e curso são obrigatórios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO students (name, registration, course) VALUES ($1, $2, $3) RETURNING *',
      [name, registration, course]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar aluno' });
  }
});

module.exports = router;
