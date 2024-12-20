const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');
const { login } = require('../controllers/authController');

const router = express.Router();

// Rota de login
router.post(
  '/login',
  validate([
    body('username').notEmpty().withMessage('O campo "username" é obrigatório.'),
    body('password').notEmpty().withMessage('O campo "password" é obrigatório.'),
  ]),
  login
);

module.exports = router;
