const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireRole } = require('../middleware/authMiddleware');

// ================== ROTAS JÁ EXISTENTES (EXEMPLO) ==================
// Boletim do aluno logado
router.get('/me', requireRole(['student']), async (req, res) => {
  try {
    const userId = req.user.id;

    const studentRes = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentRes.rowCount === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const studentId = studentRes.rows[0].id;

    const gradesRes = await pool.query(
      `
      SELECT
        g.id,
        d.name AS discipline_name,
        g.grade1,
        g.grade2,
        g.average,
        g.status
      FROM grades g
      JOIN disciplines d ON d.id = g.discipline_id
      WHERE g.student_id = $1
      ORDER BY d.name
      `,
      [studentId]
    );

    res.json(gradesRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar boletim do aluno.' });
  }
});

// ================== MÓDULO DO PROFESSOR ==================

// 1) Disciplinas do professor logado
router.get('/professor/disciplines', requireRole(['professor']), async (req, res) => {
  try {
    const userId = req.user.id;

    // Recupera o professor pelo user_id
    const profRes = await pool.query(
      'SELECT id FROM professors WHERE user_id = $1',
      [userId]
    );

    if (profRes.rowCount === 0) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    const professorId = profRes.rows[0].id;

    // Busca disciplinas vinculadas a esse professor
    const discRes = await pool.query(
      `
      SELECT id, name, workload
      FROM disciplines
      WHERE professor_id = $1
      ORDER BY name
      `,
      [professorId]
    );

    res.json(discRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar disciplinas do professor.' });
  }
});

// 2) Alunos de uma disciplina (se for usar depois)
router.get(
  '/professor/disciplines/:disciplineId/students',
  requireRole(['professor']),
  async (req, res) => {
    try {
      const { disciplineId } = req.params;
      const userId = req.user.id;

      const profRes = await pool.query(
        'SELECT id FROM professors WHERE user_id = $1',
        [userId]
      );
      if (profRes.rowCount === 0) {
        return res.status(404).json({ message: 'Professor não encontrado.' });
      }
      const professorId = profRes.rows[0].id;

      // Garante que a disciplina pertence a esse professor
      const discCheck = await pool.query(
        'SELECT id FROM disciplines WHERE id = $1 AND professor_id = $2',
        [disciplineId, professorId]
      );
      if (discCheck.rowCount === 0) {
        return res
          .status(403)
          .json({ message: 'Disciplina não pertence a este professor.' });
      }

      const studentsRes = await pool.query(
        `
        SELECT DISTINCT
          s.id,
          s.name,
          s.registration,
          s.course
        FROM grades g
        JOIN students s ON s.id = g.student_id
        WHERE g.discipline_id = $1
        ORDER BY s.name
        `,
        [disciplineId]
      );

      res.json(studentsRes.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar alunos da disciplina.' });
    }
  }
);

// 3) Lançar / Atualizar notas do aluno em uma disciplina
router.post('/professor/grades', requireRole(['professor']), async (req, res) => {
  try {
    const { student_id, discipline_id, grade1, grade2, status } = req.body;
    const userId = req.user.id;

    if (!student_id || !discipline_id) {
      return res
        .status(400)
        .json({ message: 'student_id e discipline_id são obrigatórios.' });
    }

    const profRes = await pool.query(
      'SELECT id FROM professors WHERE user_id = $1',
      [userId]
    );
    if (profRes.rowCount === 0) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }
    const professorId = profRes.rows[0].id;

    const discCheck = await pool.query(
      'SELECT id FROM disciplines WHERE id = $1 AND professor_id = $2',
      [discipline_id, professorId]
    );
    if (discCheck.rowCount === 0) {
      return res
        .status(403)
        .json({ message: 'Disciplina não pertence a este professor.' });
    }

    let average = req.body.average;
    if (average == null && grade1 != null && grade2 != null) {
      average = (Number(grade1) + Number(grade2)) / 2;
    }

    const existingRes = await pool.query(
      `
      SELECT id
      FROM grades
      WHERE student_id = $1 AND discipline_id = $2
      `,
      [student_id, discipline_id]
    );

    let result;
    if (existingRes.rowCount > 0) {
      const gradeId = existingRes.rows[0].id;
      result = await pool.query(
        `
        UPDATE grades
        SET grade1 = $1,
            grade2 = $2,
            average = $3,
            status = $4
        WHERE id = $5
        RETURNING *
        `,
        [grade1, grade2, average, status || null, gradeId]
      );
    } else {
      result = await pool.query(
        `
        INSERT INTO grades (student_id, discipline_id, grade1, grade2, average, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [student_id, discipline_id, grade1, grade2, average, status || null]
      );
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar/atualizar nota.' });
  }
});

module.exports = router;
