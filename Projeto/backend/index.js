const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Conectado ao PostgreSQL"))
  .catch(err => console.error("Erro ao conectar:", err));

// Importa as rotas
const authRoutes = require("./auth");          // login e registro
const protectedRoutes = require("./protected"); // rotas protegidas

// Usa as rotas
app.use("/auth", authRoutes);   // exemplo: POST /auth/register, POST /auth/login
app.use("/api", protectedRoutes); // exemplo: GET /api/perfil

// Inicializa servidor
app.listen(4000, () => {
  console.log("🚀 Servidor rodando na porta 4000");
});