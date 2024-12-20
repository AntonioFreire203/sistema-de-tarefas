const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { 
  listTasks, 
  addTask, 
  updateTaskDetails, 
  removeTask, 
  updateTaskStatus 
} = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   title:
 *                     type: string
 *                     example: "Nova tarefa"
 *                   status:
 *                     type: string
 *                     example: "Em andamento"
 *                   adminId:
 *                     type: string
 *                     example: "admin-id"
 *                   userIds:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "user-id"
 */
router.get('/', authenticate, listTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa (somente para administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tarefa Exemplo"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "user-id"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  authenticate,
  validate([
    body('title').notEmpty().withMessage('O campo "title" é obrigatório.'),
    body('userIds').optional().isArray().withMessage('O campo "userIds" deve ser um array de IDs de usuários.'),
  ]),
  addTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza os detalhes de uma tarefa (somente administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tarefa Atualizada"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Tarefa não encontrada
 */
router.put(
  '/:id',
  authenticate,
  validate([
    body('title').optional().isString().withMessage('O campo "title" deve ser uma string.'),
  ]),
  updateTaskDetails
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma tarefa (somente usuários atribuídos)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Em andamento"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Tarefa não encontrada
 */
/*
router.patch(
  '/:id/status',
  authenticate,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
    body('status')
      .notEmpty().withMessage('O campo "status" é obrigatório.')
      .isIn(['Em andamento', 'Pausada', 'Concluída']).withMessage('Status inválido.'),
  ]),
  updateTaskStatus
);


*/
router.patch(
  '/:id/status',
  authenticate,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
    body('status')
      .notEmpty().withMessage('O campo "status" é obrigatório.')
      .isIn(['Em andamento', 'Pausada', 'Concluída']).withMessage('Status inválido.'),
  ]),
  (req, res, next) => {
    console.log(`[DEBUG] Chegou na rota PATCH /tasks/${req.params.id}/status`);
    next();
  },
  updateTaskStatus
);



/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove uma tarefa (somente administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete('/:id', authenticate, removeTask);

module.exports = router;
