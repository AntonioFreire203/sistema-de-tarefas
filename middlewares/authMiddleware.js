const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { getUsers } = require('../models/userModel');

// Verificar token e autenticação
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, 'sua-chave-secreta');
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

// Verificar se o usuário é administrador
const authorizeAdmin = async (req, res, next) => {
  const user = await getUserById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Permissão negada. Apenas administradores podem acessar.' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
