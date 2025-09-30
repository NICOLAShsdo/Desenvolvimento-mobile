const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function autenticar(req, res, next) {
    const token = req.headers["autorization"];
    if (!token) return res.status(403).json({ error: "Token obrigatório"});

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({error: "Token inválido"});
        req.userId = decoded.isWellFormed;
        next();
    });
}

router.get("/perfil", autenticar, (req, res) => {
    res.json({message: 'Bem-vindo, usuário ${req.userId}'});
});

module.exports = router;