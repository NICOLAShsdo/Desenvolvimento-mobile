const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const professorRoutes = require('./routes/professors');
const disciplineRoutes = require('./routes/disciplines');
const gradeRoutes = require('./routes/grades');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Boletim backend rodando' });
});

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/professors', professorRoutes);
app.use('/disciplines', disciplineRoutes);

// 👇 ESSA LINHA É FUNDAMENTAL
app.use('/grades', gradeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
