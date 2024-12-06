const express = require('express');
//const statsRoutes = require('./routes/stats');
const { listUsers, getUser, addUser, removeUser } = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     responses:
 *       200:
 *         description: Sucesso - Retorna a lista de usuários
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
 *                   name:
 *                     type: string
 *                     example: "Antonio Cleber"
 *       403:
 *         description: Permissão negada - Apenas administradores podem acessar
 */
router.get('/', authenticate, authorizeAdmin, listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter detalhes de um usuário
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Sucesso - Detalhes do usuário retornados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Antonio Cleber "
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticate, getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "antonio cleber"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Sucesso - Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "2"
 *                 username:
 *                   type: string
 *                   example: "antonio cleber"
 *       400:
 *         description: Dados inválidos
 */
router.post('/', addUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remover um usuário
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Sucesso - Usuário removido
 *       403:
 *         description: Permissão negada - Apenas administradores podem acessar
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authenticate, authorizeAdmin, removeUser);

module.exports = router;
