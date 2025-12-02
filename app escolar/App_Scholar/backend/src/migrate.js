const bcrypt = require('bcryptjs');
const pool = require('./db');

async function migrate() {
  try {
    // Tabelas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'professor', 'student')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        registration VARCHAR(50) UNIQUE NOT NULL,
        course VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS professors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        experience_years INTEGER
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS disciplines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        workload INTEGER,
        professor_id INTEGER REFERENCES professors(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        discipline_id INTEGER REFERENCES disciplines(id) ON DELETE CASCADE,
        grade1 NUMERIC(5,2),
        grade2 NUMERIC(5,2),
        average NUMERIC(5,2),
        status VARCHAR(50)
      );
    `);

    // Usuários padrão
    const adminEmail = 'admin@teste.com';
    const studentEmail = 'aluno@teste.com';

    const adminExists = await pool.query('SELECT 1 FROM users WHERE email = $1', [adminEmail]);
    if (adminExists.rowCount === 0) {
      const adminPass = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Administrador', adminEmail, adminPass, 'admin']
      );
      console.log('Usuário admin criado: admin@teste.com / admin123');
    }

    const studentExists = await pool.query('SELECT 1 FROM users WHERE email = $1', [studentEmail]);
    let studentUserId;
    if (studentExists.rowCount === 0) {
      const studentPass = await bcrypt.hash('aluno123', 10);
      const resUser = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Aluno Teste', studentEmail, studentPass, 'student']
      );
      studentUserId = resUser.rows[0].id;
      console.log('Usuário aluno criado: aluno@teste.com / aluno123');
    } else {
      const resUser = await pool.query('SELECT id FROM users WHERE email = $1', [studentEmail]);
      studentUserId = resUser.rows[0].id;
    }

    // Professor
    const profRes = await pool.query('SELECT id FROM professors LIMIT 1');
    let professorId;
    if (profRes.rowCount === 0) {
      const resProf = await pool.query(
        'INSERT INTO professors (name, title, experience_years) VALUES ($1, $2, $3) RETURNING id',
        ['Prof. João da Silva', 'Mestre em Computação', 5]
      );
      professorId = resProf.rows[0].id;
    } else {
      professorId = profRes.rows[0].id;
    }

    // Aluno padrão
    const studentReg = '2025001';
    const stuRes = await pool.query('SELECT id FROM students WHERE registration = $1', [studentReg]);
    let studentId;
    if (stuRes.rowCount === 0) {
      const resStu = await pool.query(
        'INSERT INTO students (user_id, name, registration, course) VALUES ($1, $2, $3, $4) RETURNING id',
        [studentUserId, 'Aluno Teste', studentReg, 'Análise e Desenvolvimento de Sistemas']
      );
      studentId = resStu.rows[0].id;
    } else {
      studentId = stuRes.rows[0].id;
    }

    // Disciplinas
    const discRes = await pool.query('SELECT id FROM disciplines LIMIT 1');
    let disc1Id, disc2Id;
    if (discRes.rowCount === 0) {
      const d1 = await pool.query(
        'INSERT INTO disciplines (name, workload, professor_id) VALUES ($1, $2, $3) RETURNING id',
        ['Programação Mobile', 80, professorId]
      );
      const d2 = await pool.query(
        'INSERT INTO disciplines (name, workload, professor_id) VALUES ($1, $2, $3) RETURNING id',
        ['Banco de Dados', 80, professorId]
      );
      disc1Id = d1.rows[0].id;
      disc2Id = d2.rows[0].id;
    } else {
      const discsAll = await pool.query('SELECT id FROM disciplines');
      disc1Id = discsAll.rows[0].id;
      disc2Id = discsAll.rows.length > 1 ? discsAll.rows[1].id : discsAll.rows[0].id;
    }

    // Notas exemplo
    const gradesRes = await pool.query('SELECT 1 FROM grades WHERE student_id = $1', [studentId]);
    if (gradesRes.rowCount === 0) {
      await pool.query(
        'INSERT INTO grades (student_id, discipline_id, grade1, grade2, average, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [studentId, disc1Id, 8.0, 9.0, 8.5, 'Aprovado']
      );
      await pool.query(
        'INSERT INTO grades (student_id, discipline_id, grade1, grade2, average, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [studentId, disc2Id, 7.0, 6.0, 6.5, 'Aprovado']
      );
      console.log('Notas de exemplo criadas para o aluno teste.');
    }

    console.log('Migração concluída.');
  } catch (err) {
    console.error('Erro na migração:', err);
  } finally {
    await pool.end();
  }
}

migrate();
