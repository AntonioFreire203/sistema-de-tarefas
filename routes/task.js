const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const {listTasks, addTask, updateTaskDetails,removeTask,updateTaskStatus,assignUsersToTask} = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Rotas relacionadas às tarefas
 */


/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
router.get('/', authenticate, listTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa (somente para administradores)
 *     tags: [Tarefas]
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
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
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
 *     tags: [Tarefas]  
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 */
router.put(
  '/:id',
  authenticate,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
    body('title').optional().isString().withMessage('O campo "title" deve ser uma string.'),
  ]),
  updateTaskDetails
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma tarefa (somente usuários atribuídos)
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
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
  updateTaskStatus
);

/**
 * @swagger
 * /tasks/{id}/assign:
 *   patch:
 *     summary: Vincula usuários a uma tarefa (somente administradores)
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuários vinculados com sucesso
 */
router.patch(
  '/:id/assign',
  authenticate,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
    body('userIds')
      .notEmpty().withMessage('O campo "userIds" é obrigatório.')
      .isArray().withMessage('O campo "userIds" deve ser um array de IDs de usuários.'),
  ]),
  assignUsersToTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove uma tarefa (somente administradores)
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 */
router.delete('/:id', authenticate, validate([param('id').isUUID().withMessage('O ID fornecido não é válido.')]), removeTask);

module.exports = router;
