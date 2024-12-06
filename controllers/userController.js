const { v4: uuidv4 } = require('uuid');
const { getUsers, getUserById, createUser, deleteUser } = require('../models/userModel');

// Lista todos os usuários
const listUsers = async (req, res) => {
  const users = await getUsers(); // Chama o modelo para listar os usuários
  res.json(users);
};

// Obtém um usuário pelo ID
const getUser = async (req, res) => {
  const user = await getUserById(req.params.id); // Chama o modelo para buscar um usuário
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }
  res.json(user);
};

// Adiciona um novo usuário
const addUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
  }
  const newUser = { id: uuidv4(), username, password };
  const createdUser = await createUser(newUser); // Chama o modelo para adicionar um usuário
  res.status(201).json(createdUser);
};

// Remove um usuário pelo ID
const removeUser = async (req, res) => {
  const success = await deleteUser(req.params.id); // Chama o modelo para remover um usuário
  if (!success) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }
  res.json({ message: 'Usuário removido com sucesso.' });
};

module.exports = { listUsers, getUser, addUser, removeUser };
