const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
});

module.exports = router;
