const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
//const statsRoutes = require('./routes/stats');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'data', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}


// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Exemplo',
      version: '1.0.0',
      description: 'API de exemplo documentada com Swagger',
    },
  },
  apis: ['./routes/*.js'], // Caminho para as rotas documentadas com JSDoc
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para parsing do body
app.use(bodyParser.json());

// Rotas
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
//app.use('/stats', statsRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
