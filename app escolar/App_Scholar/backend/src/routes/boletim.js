const express = require('express');
const pool = require('../db');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Boletim do próprio aluno logado
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const studentResult = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId]
    );
    const student = studentResult.rows[0];
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado para este usuário' });
    }
    const boletim = await getBoletimForStudent(student.id);
    res.json({ student, boletim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar boletim' });
  }
});

// Boletim por aluno (admin/professor)
router.get('/:studentId', requireRole(['admin', 'professor']), async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const studentResult = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );
    const student = studentResult.rows[0];
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    const boletim = await getBoletimForStudent(student.id);
    res.json({ student, boletim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar boletim' });
  }
});

async function getBoletimForStudent(studentId) {
  const result = await pool.query(`
    SELECT
      d.name as discipline_name,
      d.workload,
      g.grade1,
      g.grade2,
      g.average,
      g.status
    FROM grades g
    JOIN disciplines d ON d.id = g.discipline_id
    WHERE g.student_id = $1
    ORDER BY d.name
  `, [studentId]);
  return result.rows;
}

module.exports = router;
