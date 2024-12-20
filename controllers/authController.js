const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUsers } = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await getUsers();
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      'sua-chave-secreta',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno ao fazer login.' });
  }
};

module.exports = { login };
