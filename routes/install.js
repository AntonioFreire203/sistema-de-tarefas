const express = require('express');
const { createUser } = require('../models/userModel');
const bcrypt = require('bcryptjs'); 

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10); 
    const adminUser = {
      id: 'admin-id',
      username: 'admin',
      password: hashedPassword,
      isAdmin: true,
    };

    await createUser(adminUser); 
    res.status(201).json({ message: 'Usuário administrador criado com sucesso.', adminUser });
  } catch (error) {
    console.error('Erro na instalação:', error);
    res.status(500).json({ message: 'Erro ao criar administrador padrão.' });
  }
});

module.exports = router;
