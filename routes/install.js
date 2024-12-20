const express = require('express');
const { getUsers, createUser } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Importa o gerador de UUID

const router = express.Router();

/**
 * @swagger
 * /install:
 *   get:
 *     summary: Inicializa o sistema e cria um administrador padrão
 *     responses:
 *       200:
 *         description: Sistema inicializado com sucesso
 *       500:
 *         description: Erro ao inicializar o sistema
 */
router.get('/', async (req, res) => {
  try {
    const users = await getUsers(); 

    // Verifica se o administrador já existe
    if (users.some((user) => user.username === 'admin')) {
      return res.status(200).json({ message: 'Administrador já foi criado.' });
    }

    // Cria o administrador inicial
    const hashedPassword = await bcrypt.hash('admin123', 10); 
    const adminUser = {
      id: uuidv4(), 
      username: 'admin',
      password: hashedPassword,
      isAdmin: true,
    };

    await createUser(adminUser); // Salva o administrador
    res.status(201).json({ message: 'Administrador criado com sucesso.', adminUser });
  } catch (error) {
    console.error('Erro ao inicializar o sistema:', error);
    res.status(500).json({ message: 'Erro ao inicializar o sistema.' });
  }
});

module.exports = router;
