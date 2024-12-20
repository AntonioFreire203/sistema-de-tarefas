const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { login } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar login de um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  validate([
    body('username').notEmpty().withMessage('O campo "username" é obrigatório.'),
    body('password').notEmpty().withMessage('O campo "password" é obrigatório.'),
  ]),
  login
);

module.exports = router;
