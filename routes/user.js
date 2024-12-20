const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');
const { 
  listUsers, 
  getUser, 
  addUser, 
  updateUser, 
  removeUser, 
  addAdmin 
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apenas administradores podem listar usuários
router.get('/', authenticate, authorizeAdmin, listUsers);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                   username:
 *                     type: string
 *                     example: "usuario_exemplo"
 *                   isAdmin:
 *                     type: boolean
 *                     example: false
 *       403:
 *         description: Permissão negada - Apenas administradores podem acessar
 */
// Listar todos os usuários
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
 *         description: Detalhes do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 username:
 *                   type: string
 *                   example: "usuario_exemplo"
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Usuário não encontrado
 */
// Obter um usuário por ID
router.get(
  '/:id',
  authenticate,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
  ]),
  getUser
);

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
 *                 example: "usuario_exemplo"
 *               password:
 *                 type: string
 *                 example: "Senha123!"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *                   example: "usuario_exemplo"
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Dados inválidos
 */
// Criar um novo usuário
router.post(
  '/',
  validate([
    body('username')
      .notEmpty().withMessage('O campo "username" é obrigatório.')
      .isLength({ min: 3 }).withMessage('O campo "username" deve ter pelo menos 3 caracteres.')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('O nome de usuário deve conter apenas letras, números e sublinhados.'),
    body('password')
      .notEmpty().withMessage('O campo "password" é obrigatório.')
      .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
      .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula.')
      .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula.')
      .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('A senha deve conter pelo menos um caractere especial.'),
  ]),
  addUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar dados de um usuário
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser atualizado
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
 *               username:
 *                 type: string
 *                 example: "usuario_atualizado"
 *               password:
 *                 type: string
 *                 example: "NovaSenha123!"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
// Atualizar um usuário
router.put(
  '/:id',
  authenticate,
  validate([
    body('username')
      .optional()
      .isLength({ min: 3 }).withMessage('O campo "username" deve ter pelo menos 3 caracteres.')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('O nome de usuário deve conter apenas letras, números e sublinhados.'),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
      .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula.')
      .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula.')
      .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('A senha deve conter pelo menos um caractere especial.'),
  ]),
  updateUser
);

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
 *         description: Usuário removido com sucesso
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
// Remover um usuário
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate([
    param('id').isUUID().withMessage('O ID fornecido não é válido.'),
  ]),
  removeUser
);

/**
 * @swagger
 * /users/admin:
 *   post:
 *     summary: Criar um novo administrador
 *     security:
 *       - bearerAuth: [] # Requer token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin_exemplo"
 *               password:
 *                 type: string
 *                 example: "SenhaAdmin123!"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *       403:
 *         description: Permissão negada
 */
// Criar um administrador
router.post(
  '/admin',
  authenticate,
  authorizeAdmin,
  validate([
    body('username').notEmpty().withMessage('O campo "username" é obrigatório.'),
    body('password').notEmpty().withMessage('O campo "password" é obrigatório.'),
  ]),
  addAdmin
);

module.exports = router;
