const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Pool } = require("pg");

const route = express.Router();
const pool = new Pool ({ connectionString: process.env.DATABASE_URL});

Router.post("/register", async (req,res) => {
    const {nome, email, senha} = req.body;
    try {
        const hash = await bcrypt.hash(senha, 10);
        await pool.query(
            "INSERT INTO usuarios (nome, email,senha) VALUES ($1, $2, $3)",
            [nome,email, hash]
        );
        res.status(201).json({ message: "Usuário registrado!"});
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
});

Router.post("/login", async (req, res) =>{
    const {email,senha} = req.body;
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(404).json({error:"Usuário não encontrado"});

        const usuario = result.rows[0];
        const match = await bcrypt.compare(senha, usuario.senha);
        
        if (!match) return res.status(401).json({error: "Senha inválida"});

        const token = jwt.sign({id: usuario.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
   res.json({token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

modulo.export = router;