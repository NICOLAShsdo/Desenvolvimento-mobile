const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
