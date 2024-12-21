const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const errorMiddleware = require('./middlewares/errorMiddleware');
const installRoutes = require('./routes/install');
const authRoutes = require('./routes/auth'); 



const app = express();

const fs = require('fs');
const path = require('path');

// Configuração de logs
const logsDir = path.join(__dirname, 'data', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Exemplo',
      version: '1.0.0',
      description: 'API de exemplo documentada com Swagger',
    },
    tags: [
      { name: 'Autenticação', description: 'Rotas relacionadas à autenticação' },
      { name: 'Tarefas', description: 'Rotas relacionadas às tarefas' },
      { name: 'Usuários', description: 'Rotas relacionadas aos usuários' },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para parsing do body
app.use(bodyParser.json());

// Rotas
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/install', installRoutes);
app.use('/auth', authRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
